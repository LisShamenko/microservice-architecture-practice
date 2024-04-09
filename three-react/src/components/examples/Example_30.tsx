import { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
import { Stats, OrbitControls, useGLTF } from '@react-three/drei';
// 
import { getGeometry, getSkeleton } from './Example_9';
import { Loader } from './Example_1';



// 
export default function Example_30() {
    return (
        <>
            <div id="instructions">
                <kbd>W</kbd> to walk
                <br />
                <kbd>W</kbd> & <kbd>⇧ Shift</kbd> to run.
                <br />
                <kbd>Space</kbd> to jump
                <br />
                <kbd>Q</kbd> to fancy pose
                <br />
                <br />
                Model from{' '}
                <a href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
                    Mixamo
                </a>
            </div>
            <Suspense fallback={<Loader />}>
                <Canvas camera={{ position: [0, 1, 1] }} shadows>
                    <spotLight position={[2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
                    <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} intensity={Math.PI * 50} />
                    <Eve />
                    <OrbitControls target={[0, 0.75, 0]} />
                    <Stats />
                </Canvas>
            </Suspense>
        </>
    )
}


// 
useGLTF.preload([
    '/models/eve.glb',
    '/models/eve@idle.glb',
    '/models/eve@running.glb',
    '/models/eve@walking.glb',
    '/models/eve@jump.glb',
    '/models/eve@pose.glb',
]);

function Eve() {

    const ref = useRef<any>();
    const { nodes, materials } = useGLTF('/models/eve.glb');
    const idleAnimation = useGLTF('/models/eve@idle.glb').animations;
    const walkAnimation = useGLTF('/models/eve@walking.glb').animations;
    const runningAnimation = useGLTF('/models/eve@running.glb').animations;
    const jumpAnimation = useGLTF('/models/eve@jump.glb').animations;
    const poseAnimation = useGLTF('/models/eve@pose.glb').animations;
    const actions = useMemo<any>(() => [], []);

    // @ts-ignore
    const mixer = useMemo(() => new AnimationMixer(), []);
    const keyboard = useKeyboard();
    const [action, setAction] = useState<any>();
    let [wait, setWait] = useState(false);
    let actionAssigned;

    useEffect(() => {
        actions['idle'] = mixer.clipAction(idleAnimation[0], ref.current);
        actions['walk'] = mixer.clipAction(walkAnimation[0], ref.current);
        actions['running'] = mixer.clipAction(runningAnimation[0], ref.current);
        actions['jump'] = mixer.clipAction(jumpAnimation[0], ref.current);
        actions['pose'] = mixer.clipAction(poseAnimation[0], ref.current);
        actions['idle'].play();
    }, [])

    useEffect(() => {
        action?.reset().fadeIn(0.1).play();
        return () => {
            action?.fadeOut(0.1);
        }
    }, [action])

    useFrame((_, delta) => {
        if (!wait) {
            actionAssigned = false;

            if (keyboard['KeyW']) {
                setAction(actions['walk']);
                actionAssigned = true;
            }

            if (keyboard['KeyW'] && keyboard['ShiftLeft']) {
                setAction(actions['running']);
                actionAssigned = true;
            }

            if (keyboard['Space']) {
                setAction(actions['jump']);
                actionAssigned = true;
                setWait(true); // wait for jump to finish
                setTimeout(() => setWait(false), 1000);
            }

            if (keyboard['KeyQ']) {
                setAction(actions['pose']);
                actionAssigned = true;
            }

            !actionAssigned && setAction(actions['idle']);
        }

        mixer.update(delta);
    })

    return (
        <group ref={ref} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        castShadow name="Mesh" frustumCulled={false}
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

    return keyMap.current;
}
