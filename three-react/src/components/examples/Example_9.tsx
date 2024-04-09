import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stats, Environment, PointerLockControls, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { Camera, Object3D, Sphere, Vector3 } from 'three';
// 
import './Example_9/styles.css';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import { Octree } from 'three/examples/jsm/math/Octree';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper';



// 
export default function Example_9() {
    return (<>
        <Canvas shadows>
            <directionalLight
                intensity={1}
                castShadow={true}
                shadow-bias={-0.00015}
                shadow-radius={4}
                shadow-blur={10}
                shadow-mapSize={[2048, 2048]}
                position={[85.0, 80.0, 70.0]}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={30}
                shadow-camera-bottom={-30}
            />
            <Environment files="/img/rustig_koppie_puresky_1k.hdr" background />
            <Game />
            <PointerLockControls />
            <Stats />
        </Canvas>
        <Overlay />
    </>)
}



// 
export function getGeometry(obj: any) {
    return obj.geometry;
}

export function getMaterial(obj: any) {
    return obj.material;
}

export function getSkeleton(obj: any) {
    return obj.skeleton;
}



// 
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;
const BALL_COUNT = 100;
const RADIUS = 0.2;
const BALLS = [...Array(BALL_COUNT)].map(() => ({
    position: [Math.random() * 50 - 25, 20, Math.random() * 50 - 25]
}))
const V1 = new Vector3();
const V2 = new Vector3();
const V3 = new Vector3();



// 
function useOctree(scene: Object3D) {
    return useMemo(() => {
        return new Octree().fromGraphNode(scene);
    }, [scene]);
}

function useOctreeHelper(octree: Octree) {

    const { scene } = useThree();

    useEffect(() => {
        const helper = new OctreeHelper(octree, 'hotpink');
        helper.name = 'octreeHelper';
        scene.add(helper);
        return () => {
            scene.remove(helper);
        }
    }, [octree, scene]);

    useControls('Octree Helper', {
        visible: {
            value: false,
            onChange: (v) => {
                const item1 = scene.getObjectByName('octreeHelper');
                if (item1) item1.visible = v;

                const item2 = document.getElementById('Octree Helper.visible');
                if (item2) item2.blur();
            }
        }
    })
}

function useKeyboard() {

    const keyMap = useRef<any>({});

    useEffect(() => {
        const onDocumentKey = (e: any) => {
            keyMap.current[e.code] = (e.type === 'keydown');
        }
        document.addEventListener('keydown', onDocumentKey);
        document.addEventListener('keyup', onDocumentKey);
        return () => {
            document.removeEventListener('keydown', onDocumentKey);
            document.removeEventListener('keyup', onDocumentKey);
        }
    })

    return keyMap.current;
}

function Ball({ radius }: any) {
    return (
        <mesh castShadow>
            <sphereGeometry args={[radius]} />
            <meshStandardMaterial />
        </mesh>
    )
}

function SphereCollider({
    id, radius, octree, position, colliders,
    checkSphereCollisions, children,
}: any) {

    const ref = useRef<any>();
    const sphere = useMemo(
        () => new Sphere(new Vector3(...position), radius),
        [position, radius]
    );
    const velocity = useMemo(() => new Vector3(), []);

    useEffect(() => {
        colliders[id] = { sphere: sphere, velocity: velocity };
    }, [colliders, id, sphere, velocity]);

    // 
    function updateSphere(
        delta: number, octree: Octree, sphere: Sphere, velocity: Vector3,
    ) {

        sphere.center.addScaledVector(velocity, delta);
        const result = octree.sphereIntersect(sphere);

        if (result) {
            const factor = -result.normal.dot(velocity);
            velocity.addScaledVector(result.normal, factor * 1.5);
            sphere.center.add(result.normal.multiplyScalar(result.depth));
        }
        else {
            velocity.y -= GRAVITY * delta;
        }

        const damping = Math.exp(-1.5 * delta) - 1;
        velocity.addScaledVector(velocity, damping);

        checkSphereCollisions(sphere, velocity);

        ref.current.position.copy(sphere.center);
    }

    useFrame((_, delta) => {
        const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
            updateSphere(deltaSteps, octree, sphere, velocity);
        }
    })

    return <group ref={ref}>{children}</group>
}

// 
function Player({ octree, colliders }: any) {

    const playerOnFloor = useRef(false);
    const playerVelocity = useMemo(() => new Vector3(), []);
    const playerDirection = useMemo(() => new Vector3(), []);
    const capsule = useMemo(
        () => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5),
        []
    );
    const { camera } = useThree();
    let clicked = 0;

    const onPointerDown = () => {
        throwBall(camera, capsule, playerDirection, playerVelocity, clicked++);
    }

    useEffect(() => {
        document.addEventListener('pointerdown', onPointerDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
        }
    })

    useEffect(() => {
        //console.log('adding reference to this capsule collider')
        colliders[BALL_COUNT] = { capsule: capsule, velocity: playerVelocity };
    }, [colliders, capsule, playerVelocity]);

    const keyboard = useKeyboard();

    function getForwardVector(camera: Camera, playerDirection: Vector3) {
        camera.getWorldDirection(playerDirection);
        playerDirection.y = 0;
        playerDirection.normalize();
        return playerDirection;
    }

    function getSideVector(camera: Camera, playerDirection: Vector3) {
        camera.getWorldDirection(playerDirection);
        playerDirection.y = 0;
        playerDirection.normalize();
        playerDirection.cross(camera.up);
        return playerDirection;
    }

    function controls(
        camera: Camera, delta: number, playerVelocity: Vector3,
        playerOnFloor: boolean, playerDirection: Vector3,
    ) {
        const speedDelta = delta * (playerOnFloor ? 25 : 8);

        keyboard['KeyA'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(-speedDelta));
        keyboard['KeyD'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(speedDelta));
        keyboard['KeyW'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(speedDelta));
        keyboard['KeyS'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta));

        if (playerOnFloor) {
            if (keyboard['Space']) {
                playerVelocity.y = 15;
            }
        }
    }

    function updatePlayer(
        camera: Camera, delta: number, octree: Octree,
        capsule: Capsule, playerVelocity: Vector3,
        playerOnFloor: boolean,
    ) {

        let damping = Math.exp(-4 * delta) - 1;
        if (!playerOnFloor) {
            playerVelocity.y -= GRAVITY * delta;
            damping *= 0.1; // small air resistance
        }

        playerVelocity.addScaledVector(playerVelocity, damping);
        const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
        capsule.translate(deltaPosition);
        playerOnFloor = playerCollisions(capsule, octree, playerVelocity);
        camera.position.copy(capsule.end);

        return playerOnFloor;
    }

    function throwBall(
        camera: Camera, capsule: Capsule,
        playerDirection: Vector3, playerVelocity: Vector3,
        count: number,
    ) {
        const { sphere, velocity } = colliders[count % BALL_COUNT];
        camera.getWorldDirection(playerDirection);
        sphere.center.copy(capsule.end).addScaledVector(playerDirection, capsule.radius * 1.5);
        velocity.copy(playerDirection).multiplyScalar(50);
        velocity.addScaledVector(playerVelocity, 2);
    }

    function playerCollisions(capsule: Capsule, octree: Octree, playerVelocity: Vector3) {
        const result = octree.capsuleIntersect(capsule);
        let playerOnFloor = false;
        if (result) {
            playerOnFloor = result.normal.y > 0;
            if (!playerOnFloor) {
                playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
            }
            capsule.translate(result.normal.multiplyScalar(result.depth));
        }
        return playerOnFloor;
    }

    function teleportPlayerIfOob(camera: Camera, capsule: Capsule, playerVelocity: Vector3) {
        if (camera.position.y <= -100) {
            playerVelocity.set(0, 0, 0);
            capsule.start.set(0, 10, 0);
            capsule.end.set(0, 11, 0);
            camera.position.copy(capsule.end);
            camera.rotation.set(0, 0, 0);
        }
    }

    useFrame(({ camera }, delta) => {

        controls(camera, delta, playerVelocity, playerOnFloor.current, playerDirection);

        const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
            playerOnFloor.current = updatePlayer(
                camera, deltaSteps, octree, capsule,
                playerVelocity, playerOnFloor.current
            );
        }

        teleportPlayerIfOob(camera, capsule, playerVelocity);
    })

    return <></>;
}

function Game() {

    const { nodes, scene } = useGLTF('/models/scene-transformed.glb');
    const octree = useOctree(scene);
    useOctreeHelper(octree);

    const colliders = useRef<any[]>([]);

    function checkSphereCollisions(sphere: Sphere, velocity: Vector3) {

        for (let i = 0, length = colliders.current.length; i < length; i++) {
            const c = colliders.current[i];

            if (c.sphere) {
                const d2 = sphere.center.distanceToSquared(c.sphere.center);
                const r = sphere.radius + c.sphere.radius;
                const r2 = r * r;

                if (d2 < r2) {
                    const normal = V1.subVectors(sphere.center, c.sphere.center).normalize();
                    const impact1 = V2.copy(normal).multiplyScalar(normal.dot(velocity));
                    const impact2 = V3.copy(normal).multiplyScalar(normal.dot(c.velocity));
                    velocity.add(impact2).sub(impact1);
                    c.velocity.add(impact1).sub(impact2);
                    const d = (r - Math.sqrt(d2)) / 2;
                    sphere.center.addScaledVector(normal, d);
                    c.sphere.center.addScaledVector(normal, -d);
                }
            }
            else if (c.capsule) {
                const center = V1.addVectors(c.capsule.start, c.capsule.end).multiplyScalar(0.5);
                const r = sphere.radius + c.capsule.radius;
                const r2 = r * r;

                for (const point of [c.capsule.start, c.capsule.end, center]) {
                    const d2 = point.distanceToSquared(sphere.center);

                    if (d2 < r2) {
                        const normal = V1.subVectors(point, sphere.center).normalize();
                        const impact1 = V2.copy(normal).multiplyScalar(normal.dot(c.velocity));
                        const impact2 = V3.copy(normal).multiplyScalar(normal.dot(velocity));
                        c.velocity.add(impact2).sub(impact1);
                        velocity.add(impact1).sub(impact2);
                        const d = (r - Math.sqrt(d2)) / 2;
                        sphere.center.addScaledVector(normal, -d);
                    }
                }
            }
        }
    }

    return (<>
        <group dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={getGeometry(nodes.Suzanne007)}
                material={getMaterial(nodes.Suzanne007)}
                position={[1.74, 1.04, 24.97]}
            />
        </group>
        {BALLS.map(({ position }, i) => (
            <SphereCollider
                key={i}
                id={i}
                radius={RADIUS}
                octree={octree}
                position={position}
                colliders={colliders.current}
                checkSphereCollisions={checkSphereCollisions}
            >
                <Ball radius={RADIUS} />
            </SphereCollider>
        ))}
        <Player octree={octree} colliders={colliders.current} />
    </>)
}

function Overlay() {
    return (
        <div id="instructions">
            <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move.
            <br />
            Space to jump.
            <br />
            Mouse click to shoot.
        </div>
    )
}
