import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { Stats, useProgress, Html, useGLTF, Environment, Hud, OrthographicCamera } from '@react-three/drei';
import { Physics, Debug, usePlane, useBox, useSphere, useCylinder, useCompoundBody, useContactMaterial, useDistanceConstraint } from '@react-three/cannon';
import { Vec3 } from 'cannon-es';
import { create } from 'zustand';
import { AnimationMixer, TextureLoader, Vector3, Euler, Quaternion, Matrix4, Object3D, DoubleSide, RepeatWrapping } from 'three';
import { Leva, useControls } from 'leva';
// 
import { getGeometry, getSkeleton } from './Example_9';



// 
export default function Example_27() {
    return (
        <>
            <Canvas shadows>
                <Suspense fallback={<Loader />}>
                    <Environment files="/img/digital_painting_water-1mb.hdr" background />
                    <Physics>
                        <Game />
                    </Physics>
                    <Stats />
                </Suspense>
            </Canvas>
            <Instructions />
            <Leva collapsed />
        </>
    )
}



// 
const useStore = create((set) => ({
    groundObjects: {},
    actions: {},
    // @ts-ignore
    mixer: new AnimationMixer(),
    gameStarted: false,
    setGameStarted: (v: any) => set({ gameStarted: v }),
    time: 0,
    setTime: (v: any) => set({ time: v }),
    finished: false,
    setFinished: (v: any) => set({ finished: v })
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

    return { pivot, alt, yaw, pitch }
}

function useKeyboard() {
    const keyMap = useRef<any>({});

    useEffect(() => {

        const onDocumentKey = (e: any) => {
            keyMap.current[e.code] = e.type === 'keydown';
        }

        document.addEventListener('keydown', onDocumentKey);
        document.addEventListener('keyup', onDocumentKey);
        return () => {
            document.removeEventListener('keydown', onDocumentKey);
            document.removeEventListener('keyup', onDocumentKey);
        }
    })

    return keyMap.current
}

function Eve() {

    const ref = useRef<any>();
    const { nodes, materials, animations } = useGLTF('/models/eve.glb');
    const idleAnimation = useGLTF('/models/eve@idle.glb').animations;
    const walkAnimation = useGLTF('/models/eve@walking.glb').animations;
    const jumpAnimation = useGLTF('/models/eve@jump.glb').animations;

    const { actions, mixer } = useStore<any>((state) => state);

    useEffect(() => {
        actions['default'] = mixer.clipAction(animations[0], ref.current);
        actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current);
        actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current);
        actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current);
        actions['idle'].play();
    }, [mixer, actions, animations, idleAnimation, walkAnimation, jumpAnimation])

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
])

function Finish({ position }: any) {

    const { nodes, materials } = useGLTF('/models/finish.glb');
    const { groundObjects, setFinished } = useStore<any>((state) => state);
    const texture = useLoader(TextureLoader, '/img/finish.png');

    const [ref] = useCylinder(
        () => ({
            args: [3.4, 3.4, 0.37, 12],
            mass: 0,
            onCollide: () => {
                console.log('finished')
                setFinished(true)
            },
            position,
            material: 'ground'
        }),
        useRef<any>()
    )

    useEffect(() => {
        const id = ref.current.id;
        groundObjects[id] = ref.current;
        return () => {
            delete groundObjects[id];
        }
    }, [groundObjects, ref])

    useEffect(() => {
        texture.repeat.x = 2;
        texture.wrapS = RepeatWrapping;
        texture.flipY = true;
    }, [texture])

    useEffect(() => {
        const interval = setInterval(() => {
            // @ts-ignore
            materials['Material.002'].map.rotation += Math.PI;
        }, 500)
        return () => clearInterval(interval);
    }, [materials])

    useFrame((_, delta) => {
        texture.offset.x += delta / 3;
    })

    return (
        <group dispose={null}>
            <mesh ref={ref} geometry={getGeometry(nodes.Cylinder)} material={materials['Material.002']} receiveShadow>
                <mesh position-y={3}>
                    <cylinderGeometry args={[3.4, 3.4, 2, 12, 1, true]} />
                    <meshPhongMaterial map={texture} transparent={true} opacity={0.75} side={DoubleSide} />
                </mesh>
            </mesh>
        </group>
    )
}



// 
useGLTF.preload('/models/finish.glb');

function Start({ position }: any) {

    const [ref] = useCylinder(() => ({
        args: [3.78, 3.78, 0.267, 12],
        mass: 0,
        position,
        material: 'ground',
    }),
        useRef<any>()
    );

    const { nodes, materials } = useGLTF('/models/start.glb');
    const groundObjects = useStore<any>((state: any) => state.groundObjects);

    useEffect(() => {
        const id = ref.current.id;
        groundObjects[id] = ref.current;
        return () => {
            delete groundObjects[id];
        }
    }, [groundObjects, ref]);

    useEffect(() => {
        const interval = setInterval(() => {
            // @ts-ignore
            materials['Material.001'].map.rotation += Math.PI;
        }, 500)
        return () => clearInterval(interval);
    }, [materials])

    return (
        <group dispose={null}>
            <mesh ref={ref} geometry={getGeometry(nodes.Cylinder)} material={materials['Material.001']} receiveShadow />
        </group>
    )
}



// 
useGLTF.preload('/models/start.glb')

function Platform({ args, position, rotation }: any) {

    const [ref] = useBox(() => ({
        args: args,
        mass: 0,
        position: position,
        rotation: rotation,
        material: 'ground'
    }),
        useRef<any>()
    );

    const groundObjects = useStore<any>((state: any) => state.groundObjects);

    useEffect(() => {
        const id = ref.current.id;
        groundObjects[id] = ref.current;
        return () => {
            delete groundObjects[id];
        }
    }, [groundObjects, ref])

    return (
        <mesh ref={ref} receiveShadow rotation={rotation}>
            <boxGeometry args={args} />
            <meshStandardMaterial />
        </mesh>
    )
}

function Pendulum({ position, impulse }: any) {
    const [link0] = useSphere<any>(() => ({
        args: [0.25],
        mass: 0,
        position: [position[0], position[1] + 3.5, position[2]]
    }))

    const [link1] = useSphere<any>(() => ({
        args: [0.25],
        mass: 1,
        position: [position[0], position[1] + 3, position[2]],
        angularFactor: [0, 0, 0]
    }))

    const [link2] = useSphere<any>(() => ({
        args: [0.25],
        mass: 1,
        position: [position[0], position[1] + 2.5, position[2]],
        angularFactor: [0, 0, 0]
    }))

    const [link3] = useSphere<any>(() => ({
        args: [0.25],
        mass: 1,
        position: [position[0], position[1] + 2, position[2]],
        angularFactor: [0, 0, 0]
    }))

    const [link4] = useSphere<any>(() => ({
        args: [0.25],
        mass: 1,
        position: [position[0], position[1] + 1.5, position[2]],
        angularFactor: [0, 0, 0]
    }))

    const [link5, api] = useSphere<any>(() => ({
        args: [0.5],
        mass: 10,
        position: [position[0], position[1] + 1, position[2]]
    }))

    useDistanceConstraint(link0, link1, {
        distance: 0.5
    })
    useDistanceConstraint(link1, link2, {
        distance: 0.5
    })
    useDistanceConstraint(link2, link3, {
        distance: 0.5
    })
    useDistanceConstraint(link3, link4, {
        distance: 0.5
    })
    useDistanceConstraint(link4, link5, {
        distance: 0.75
    })

    useEffect(() => {
        api.applyImpulse(impulse, [0, 0, 0]); //start it right away

        const interval = setInterval(() => {
            api.applyImpulse(impulse, [0, 0, 0]);
        }, 3000)
        return () => clearInterval(interval);
    }, [api, impulse])

    return (
        <group>
            <group ref={link0}>
                <mesh scale={[1.2, 1.2, 1.2]} rotation-y={Math.PI / 1.7}>
                    <torusGeometry args={[0.25, 0.025, 8, 12]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
            <group ref={link1}>
                <mesh scale={[1.2, 1.2, 1.2]} rotation-y={Math.PI / 2.3}>
                    <torusGeometry args={[0.25, 0.025, 8, 12]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
            <group ref={link2}>
                <mesh scale={[1.2, 1.2, 1.2]} rotation-y={Math.PI / 1.7}>
                    <torusGeometry args={[0.25, 0.025, 8, 12]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
            <group ref={link3}>
                <mesh scale={[1.2, 1.2, 1.2]} rotation-y={Math.PI / 2.3}>
                    <torusGeometry args={[0.25, 0.025, 8, 12]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
            <group ref={link4}>
                <mesh scale={[1.2, 1.2, 1.2]} rotation-y={Math.PI / 1.7}>
                    <torusGeometry args={[0.25, 0.025, 8, 12]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
            <group ref={link5}>
                <mesh>
                    <sphereGeometry args={[0.5]} />
                    <meshStandardMaterial />
                </mesh>
            </group>
        </group>
    )
}

function Spinner({ position }: any) {
    const [ref, { angularFactor, linearFactor, angularVelocity }] = useCompoundBody(
        () => ({
            mass: 1,
            position: position,
            shapes: [
                { args: [0.4], position: [1.75, 0, 0], type: 'Sphere' },
                { args: [0.4], position: [1.05, 0, 0], type: 'Sphere' },
                { args: [0.75], position: [0, 0, 0], type: 'Sphere' },
                { args: [0.4], position: [-1.05, 0, 0], type: 'Sphere' },
                { args: [0.4], position: [-1.75, 0, 0], type: 'Sphere' }
            ]
        }),
        useRef<any>()
    )

    useEffect(() => {
        angularFactor.set(0, 1, 0); // causes the obstacles to remain upright in case of collision
        linearFactor.set(0, 0, 0);  // locks it in place so it doesnt slide when bumped
    }, [angularFactor, linearFactor])

    useFrame((_, delta) => {
        angularVelocity.set(0, 100 * delta, 0);
    })

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 1.5]} />
            <meshStandardMaterial />
            <mesh rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
                <cylinderGeometry args={[0.25, 0.25, 4]} />
                <meshStandardMaterial />
            </mesh>
        </mesh>
    )
}

function Player({ position }: any) {
    //console.log("in Player")
    const playerGrounded = useRef<any>(false);
    const inJumpAction = useRef<any>(false);
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
    const prevActiveAction = useRef<any>(0); // 0:idle, 1:walking, 2:jumping
    const keyboard = useKeyboard();

    const { groundObjects, actions, mixer, setTime, setFinished } = useStore<any>((state) => state);

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
                        // landed
                        inJumpAction.current = false;
                        actions['jump'].fadeOut(0.1);
                    }
                }
            },
            material: 'slippery',
            linearDamping: 0,
            position: position
        }),
        useRef<any>()
    )

    useFrame(({ raycaster }, delta) => {
        let activeAction = 0; // 0:idle, 1:walking, 2:jumping
        body.angularFactor.set(0, 0, 0);

        ref.current.getWorldPosition(worldPosition);

        playerGrounded.current = false;
        raycasterOffset.copy(worldPosition);
        raycasterOffset.y += 0.01;
        raycaster.set(raycasterOffset, new Vector3(down.x, down.y, down.z));
        raycaster.intersectObjects(Object.values(groundObjects), false).forEach((i) => {
            if (i.distance < 0.028) {
                playerGrounded.current = true;
            }
        })
        if (!playerGrounded.current) {
            body.linearDamping.set(0); // in the air
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
                // if grounded I can walk
                if (keyboard['KeyW']) {
                    activeAction = 1;
                    inputVelocity.z = -delta;
                }
                if (keyboard['KeyS']) {
                    activeAction = 1;
                    inputVelocity.z = delta;
                }
                if (keyboard['KeyA']) {
                    activeAction = 1;
                    inputVelocity.x = -delta;
                }
                if (keyboard['KeyD']) {
                    activeAction = 1;
                    inputVelocity.x = delta;
                }
            }
            inputVelocity.setLength(delta * 40); // clamps walking speed

            if (activeAction !== prevActiveAction.current) {
                if (prevActiveAction.current !== 1 && activeAction === 1) {
                    actions['walk'].reset().fadeIn(0.1).play();
                    actions['idle'].fadeOut(0.1);
                }
                if (prevActiveAction.current !== 0 && activeAction === 0) {
                    actions['idle'].reset().fadeIn(0.1).play();
                    actions['walk'].fadeOut(0.1);
                }
                prevActiveAction.current = activeAction;
            }

            if (keyboard['Space']) {
                if (playerGrounded.current && !inJumpAction.current) {
                    activeAction = 2;
                    inJumpAction.current = true;
                    actions['jump'].reset().fadeIn(0.1).play();
                    inputVelocity.y = 6;
                }
            }

            euler.y = yaw.rotation.y;
            euler.order = 'YZX';
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

        if (worldPosition.y < -3) {
            body.velocity.set(0, 0, 0);
            body.position.set(0, 1, 0);
            group.current.position.set(0, 1, 0);
            setFinished(false);
            setTime(0);
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

function Overlay() {
    const { gameStarted, finished, time, setTime } = useStore<any>((state) => state);

    useEffect(() => {

        const interval = setInterval(() => {
            gameStarted && !finished && setTime(time + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [gameStarted, time, setTime, finished])

    return (
        <>
            <Hud>
                <OrthographicCamera makeDefault />
                <Html>
                    <div id="time">{gameStarted && time}</div>
                </Html>
                <Html>
                    <div id="levelCompleted">{finished && 'Level Completed. Well Done!'}</div>
                </Html>
            </Hud>
        </>
    )
}

function Instructions() {
    const { gameStarted, setGameStarted } = useStore<any>((state) => state);

    function pointerlockchange() {
        setGameStarted(!gameStarted);
        // disabling and enabling button after 2 seconds prevents pointerlock error if re-entered to quickly
        if (!gameStarted) {

            const item2 = document.getElementById('button');
            if (item2) {
                item2.style.visibility = 'hidden';
                setTimeout(() => {
                    item2.style.visibility = 'visible';
                }, 2000)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        return () => {
            document.removeEventListener('pointerlockchange', pointerlockchange, false);
        }
    })

    return (
        <div id="instructions" className={gameStarted ? 'hide' : 'show'}>
            <h1>Obstacle Course</h1>
            <p>Get to the end and be the best</p>
            <kbd>W</kbd>&nbsp;<kbd>A</kbd>&nbsp;<kbd>S</kbd>&nbsp;<kbd>D</kbd> to move
            <br />
            <kbd>SPACE</kbd> to jump.
            <br />
            <br />
            <button
                id="button"
                onClick={async (e: any) => {
                    !gameStarted && (await e.target.requestPointerLock())
                }}>
                Click To Play
            </button>
            <p>
                'Eve' model and animations from{' '}
                <a href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
                    Mixamo
                </a>
            </p>
        </div>
    )
}

function ToggleDebug({ children }: any) {
    const debugRendererVisible = useControls('Debug Renderer', { visible: false });

    return (<>
        {debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}
    </>);
}

function Game() {
    const lightRef = useRef<any>();

    useContactMaterial('ground', 'slippery', {
        friction: 0,
        restitution: 0.01,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3
    })

    useFrame((state) => {
        lightRef.current.position.set(
            state.camera.position.x + 10,
            state.camera.position.y + 7.5,
            state.camera.position.z + 7.5
        );
        lightRef.current.target.position.x = state.camera.position.x;
        lightRef.current.target.updateMatrixWorld();
    })

    return (
        <>
            <ToggleDebug>
                <Start position={[0, -0.5, 0]} />

                <Platform args={[1, 0.1, 2]} position={[0, 0, 6]} />
                <Platform args={[2, 0.1, 1]} position={[3, 0.25, 6]} />
                <Platform args={[2, 0.1, 1]} position={[6, 1, 6]} />
                <Platform args={[0.25, 0.1, 5]} position={[6, 2, 2]} />
                <Platform args={[4, 0.1, 5]} position={[6, 2, -3]} />

                <Spinner position={[6, 2.8, -3]} />

                <Platform args={[1, 0.1, 2]} position={[6.5, 2.5, -7.5]} />
                <Platform args={[4, 0.1, 4]} position={[2.5, 3, -8]} />

                <Spinner position={[2.5, 3.8, -8]} />

                <Platform args={[1, 0.1, 2]} position={[1.5, 3.5, -3.5]} rotation={[Math.PI / -8, 0, 0]} />
                <Platform args={[6, 0.1, 1]} position={[-1, 4.5, -1]} />

                <Pendulum position={[0, 4.5, -1]} impulse={[0, 0, 20]} />
                <Pendulum position={[-2, 4.5, -1]} impulse={[10, 0, 10]} />

                <Platform args={[1.5, 0.1, 8]} position={[-5.5, 4.5, 4.5]} rotation={[0, 0, Math.PI / -8]} />

                <Pendulum position={[-5, 4.5, 2.5]} impulse={[20, 0, 0]} />
                <Pendulum position={[-5, 4.5, 5]} impulse={[15, 0, 5]} />

                <Platform args={[1, 0.1, 2]} position={[-4.5, 4, 8]} />

                <Finish position={[0.5, 4.0, 10]} />
            </ToggleDebug>
            <Player position={[0, 1, 0]} />
            <Overlay />
            <directionalLight
                ref={lightRef}
                position={[10, 7.5, 7.5]}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-20}
                shadow-camera-right={40}
                shadow-camera-top={30}
                intensity={Math.PI * 1.5}
            />
        </>
    )
}

function Loader() {
    const { progress, item, loaded, total } = useProgress();
    //console.log(progress, item, loaded, total)

    const item1 = document.getElementById('instructions');
    if (item1) item1.style.display = 'block';
    return (
        <Html center>
            <div id="progress">{progress} % loaded</div>
        </Html>
    )
}
