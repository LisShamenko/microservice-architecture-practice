import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stats, useAnimations } from '@react-three/drei';
import { AnimationClip } from 'three';
// 
import { getGeometry, getSkeleton } from './Example_9';
import { Loader } from './Example_1';



// 
export default function Example_18() {
    return (
        <>
            <Suspense fallback={<Loader />}>
                <Canvas camera={{ position: [0, 1.3, 0.2] }}>
                    <ambientLight />
                    <directionalLight position={[-5, 5, 5]} intensity={Math.PI * 2} />
                    <Eve />
                    <OrbitControls target={[0, 1.1, 0]} />
                    <Stats />
                </Canvas>
            </Suspense>
            <div id="instructions">
                Model from{' '}
                <a href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
                    Mixamo
                </a>
            </div>
        </>
    )
}



// 
useGLTF.preload(['/models/eve.glb', '/models/eve@walking.glb']);

function Eve() {

    const ref = useRef<any>();
    const { nodes, materials } = useGLTF('/models/eve.glb');
    const { animations } = useGLTF('/models/eve@walking.glb');
    const { actions } = useAnimations<AnimationClip>(animations, ref);

    useEffect(() => {
        const action = actions['Armature|mixamo.com|Layer0'];
        if (action) {
            action.play();
        }
    }, [actions])

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
