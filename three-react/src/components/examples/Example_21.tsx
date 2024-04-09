import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { Stats, useGLTF } from '@react-three/drei';
import { Physics, Debug, usePlane, useBox, useCompoundBody, useContactMaterial } from '@react-three/cannon';
import { Vec3 } from 'cannon-es';
import { create } from 'zustand';
import { AnimationMixer, TextureLoader, Vector3, Euler, Quaternion, Matrix4, Object3D } from 'three';
import { useControls } from 'leva';
// 
import { getGeometry, getSkeleton } from './Example_9';
import { Loader } from './Example_1';



// 
export default function Example_21() {
    return (
        <>
            <div id="instructions">
                <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move
                <br />
                <kbd>Space</kbd> to jump.
                <br />
                Model from{' '}
                <a href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
                    Mixamo
                </a>
            </div>
            <Canvas shadows onPointerDown={(e: any) => e.target.requestPointerLock()}>
                <Suspense fallback={<Loader />}>
                    <spotLight
                        position={[2.5, 5, 5]}
                        angle={Math.PI / 3}
                        penumbra={0.5}
                        castShadow
                        shadow-mapSize-height={2048}
                        shadow-mapSize-width={2048}
                        intensity={Math.PI * 25}
                    />
                    <spotLight
                        position={[-2.5, 5, 5]}
                        angle={Math.PI / 3}
                        penumbra={0.5}
                        castShadow
                        shadow-mapSize-height={2048}
                        shadow-mapSize-width={2048}
                        intensity={Math.PI * 25}
                    />
                    <Physics>
                        <Game />
                    </Physics>
                    <Stats />
                </Suspense>
            </Canvas>
        </>
    )
}



// 
const OBSTACLES = [...Array(25)].map((_, i) => ({
    position: [(Math.random() - 0.5) * 25, 2 * i, (Math.random() - 0.5) * 25],
    args: [Math.random() * 10, Math.random() * 2, Math.random() * 5]
}))

export const useStore = create(() => ({
    groundObjects: {},
    actions: {},
    // @ts-ignore
    mixer: new AnimationMixer(),
}))

function useFollowCam(ref: any, offset: any) {
    const { scene, camera } = useThree();

    const pivot = useMemo(() => new Object3D(), []);
    const alt = useMemo(() => new Object3D(), []);
    const yaw = useMemo(() => new Object3D(), []);
    const pitch = useMemo(() => new Object3D(), []);
    const worldPosition = useMemo(() => new Vector3(), []);

    function onDocumentMouseMove(e: any) {
        if (document.pointerLockElement) {
            e.preventDefault();
            yaw.rotation.y -= e.movementX * 0.002;
            const v = pitch.rotation.x - e.movementY * 0.002;
            if (v > -1 && v < 0.1) {
                pitch.rotation.x = v;
            }
        }
    }

    function onDocumentMouseWheel(e: any) {
        if (document.pointerLockElement) {
            e.preventDefault();
            const v = camera.position.z + e.deltaY * 0.005;
            if (v >= 0.5 && v <= 5) {
                camera.position.z = v;
            }
        }
    }

    useEffect(() => {
        scene.add(pivot);
        pivot.add(alt);
        alt.position.y = offset[1];
        alt.add(yaw);
        yaw.add(pitch);
        pitch.add(camera);
        camera.position.set(offset[0], 0, offset[2]);

        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mousewheel', onDocumentMouseWheel, { passive: false });
        return () => {
            document.removeEventListener('mousemove', onDocumentMouseMove);
            document.removeEventListener('mousewheel', onDocumentMouseWheel);
        }
    }, [camera])

    useFrame((_, delta) => {
        ref.current.getWorldPosition(worldPosition);
        pivot.position.lerp(worldPosition, delta * 5);
    })

    return { pivot, alt, yaw, pitch };
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

function Eve() {
    const ref = useRef<any>();
    const { nodes, materials } = useGLTF('/models/eve.glb');
    const idleAnimation = useGLTF('/models/eve@idle.glb').animations;
    const walkAnimation = useGLTF('/models/eve@walking.glb').animations;
    const jumpAnimation = useGLTF('/models/eve@jump.glb').animations;

    const { actions, mixer } = useStore<any>((state) => state);

    useEffect(() => {
        actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current);
        actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current);
        actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current);
        actions['idle'].play();
    }, [actions, mixer, idleAnimation, walkAnimation, jumpAnimation]);

    return (
        <group ref={ref} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        castShadow
                        name="Mesh"
                        frustumCulled={false}
                        geometry={getGeometry(nodes.Mesh)}
                        material={materials.SpacePirate_M}
                        skeleton={getSkeleton(nodes.Mesh)}
                    />
                </group>
            </group>
        </group>
    )
}



// 
useGLTF.preload([
    '/models/eve.glb',
    '/models/eve@idle.glb',
    '/models/eve@walking.glb',
    '/models/eve@jump.glb',
]);

function Player({ position }: any) {

    const playerGrounded = useRef(false);
    const inJumpAction = useRef(false);
    const group = useRef<any>();
    const { yaw } = useFollowCam(group, [0, 1, 1.5]);
    const velocity = useMemo(() => new Vector3(), []);
    const inputVelocity = useMemo(() => new Vector3(), []);
    const euler = useMemo(() => new Euler(), []);
    const quat = useMemo(() => new Quaternion(), []);
    const targetQuaternion = useMemo(() => new Quaternion(), []);
    const worldPosition = useMemo(() => new Vector3(), []);
    const raycasterOffset = useMemo(() => new Vector3(), []);
    const contactNormal = useMemo(() => new Vec3(0, 0, 0), []);
    const down = useMemo(() => new Vec3(0, -1, 0), []);
    const rotationMatrix = useMemo(() => new Matrix4(), []);
    const prevActiveAction = useRef(0); // 0:idle, 1:walking, 2:jumping
    const keyboard = useKeyboard();

    const { groundObjects, actions, mixer } = useStore<any>((state) => state);

    useContactMaterial('ground', 'slippery', {
        friction: 0,
        restitution: 0.01,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3
    });

    const [ref, body] = useCompoundBody(
        () => ({
            mass: 1,
            shapes: [
                { args: [0.25], position: [0, 0.25, 0], type: 'Sphere' },
                { args: [0.25], position: [0, 0.75, 0], type: 'Sphere' },
                { args: [0.25], position: [0, 1.25, 0], type: 'Sphere' }
            ],
            onCollide: (e) => {
                if (e.contact.bi.id !== e.body.id) {
                    const v = e.contact.ni;
                    contactNormal.set(v[0], v[1], v[2]);
                }
                if (contactNormal.dot(down) > 0.5) {
                    if (inJumpAction.current) {
                        inJumpAction.current = false;
                        actions['jump'].fadeOut(0.1);
                        actions['idle'].reset().fadeIn(0.1).play();
                    }
                }
            },
            material: 'slippery',
            linearDamping: 0,
            position: position
        }),
        useRef<any>()
    );

    useFrame(({ raycaster }, delta) => {
        let activeAction = 0; // 0:idle, 1:walking, 2:jumping

        body.angularFactor.set(0, 0, 0);

        ref.current.getWorldPosition(worldPosition);

        playerGrounded.current = false;
        raycasterOffset.copy(worldPosition);
        raycasterOffset.y += 0.01;
        raycaster.set(raycasterOffset, new Vector3(down.x, down.y, down.z));
        raycaster.intersectObjects(Object.values(groundObjects), false).forEach((i) => {
            //console.log(i.distance)
            if (i.distance < 0.021) {
                playerGrounded.current = true;
            }
        })

        if (!playerGrounded.current) {
            //console.log('in air')
            body.linearDamping.set(0);
        }
        else {
            body.linearDamping.set(0.9999999);
        }

        const distance = worldPosition.distanceTo(group.current.position);

        rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up);
        targetQuaternion.setFromRotationMatrix(rotationMatrix);
        if (distance > 0.0001 && !group.current.quaternion.equals(targetQuaternion)) {
            targetQuaternion.z = 0;
            targetQuaternion.x = 0;
            targetQuaternion.normalize();
            group.current.quaternion.rotateTowards(targetQuaternion, delta * 20);
        }

        if (document.pointerLockElement) {
            inputVelocity.set(0, 0, 0);

            if (playerGrounded.current) {
                if (keyboard['KeyW']) {
                    activeAction = 1;
                    inputVelocity.z = -1;
                }
                if (keyboard['KeyS']) {
                    activeAction = 1;
                    inputVelocity.z = 1;
                }
                if (keyboard['KeyA']) {
                    activeAction = 1;
                    inputVelocity.x = -1;
                }
                if (keyboard['KeyD']) {
                    activeAction = 1;
                    inputVelocity.x = 1;
                }
            }
            inputVelocity.setLength(delta * 40);

            if (activeAction !== prevActiveAction.current) {
                //console.log('--- active action changed');
                if (prevActiveAction.current !== 1 && activeAction === 1) {
                    //console.log('--- idle --> walking');
                    actions['idle'].fadeOut(0.1);
                    actions['walk'].reset().fadeIn(0.1).play();
                }
                if (prevActiveAction.current !== 0 && activeAction === 0) {
                    //console.log('--- walking --> idle');
                    actions['walk'].fadeOut(0.1);
                    actions['idle'].reset().fadeIn(0.1).play();
                }
                prevActiveAction.current = activeAction;
            }

            if (keyboard['Space']) {
                if (playerGrounded.current && !inJumpAction.current) {
                    console.log('jump');
                    activeAction = 2;
                    inJumpAction.current = true;
                    actions['walk'].fadeOut(0.1);
                    actions['idle'].fadeOut(0.1);
                    actions['jump'].reset().fadeIn(0.1).play();
                    inputVelocity.y = 6;
                }
            }

            euler.y = yaw.rotation.y;
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);

            body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);
        }

        if (activeAction === 1) {
            mixer.update(distance / 3);
        }
        else {
            mixer.update(delta);
        }

        group.current.position.lerp(worldPosition, 0.3);
    })

    return (
        <>
            <group ref={group} position={position}>
                <Suspense fallback={null}>
                    <Eve />
                </Suspense>
            </group>
        </>
    )
}

function Obstacle({ args, position, ...props }: any) {
    const [ref] = useBox(() => ({ args, mass: 1, position: position, ...props }), useRef<any>());

    const groundObjects = useStore<any>((state) => state.groundObjects);

    useEffect(() => {
        const id = ref.current.id;
        groundObjects[id] = ref.current;
        return () => {
            delete groundObjects[id];
        }
    }, [groundObjects, ref]);

    return (
        <mesh ref={ref} castShadow receiveShadow>
            {/* @ts-ignore */}
            <boxGeometry args={[...args]} />
            <meshStandardMaterial />
        </mesh>
    )
}

function Obstacles() {
    return (
        <>
            {OBSTACLES.map(({ position, args }, i) => (
                <Obstacle key={i} position={position} args={args} material={'ground'}></Obstacle>
            ))}
        </>
    )
}

function Floor() {

    const [ref] = usePlane(
        () => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }),
        useRef<any>()
    );

    const texture = useLoader(TextureLoader, '/img/grid.png');
    const groundObjects = useStore<any>((state) => state.groundObjects);

    useEffect(() => {
        const id = ref.current.id;
        groundObjects[id] = ref.current;
        return () => {
            delete groundObjects[id];
        }
    }, [groundObjects, ref]);

    return (
        <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

function ToggleDebug({ children }: any) {
    const debugRendererVisible = useControls('Debug Renderer', { visible: false });

    return <>{debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}</>
}

function Game() {
    return (
        <>
            <ToggleDebug>
                <Floor />
                <Obstacles />
                <Player position={[0, 1, 0]} />
            </ToggleDebug>
        </>
    )
}
