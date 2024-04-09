import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import TWEEN from '@tweenjs/tween.js';
// 
import { getGeometry } from './Example_9';
import { Loader, Tween } from './Example_1';



// 
export default function Example_18() {
    const ref = useRef<any>()
    return (
        <>
            <Canvas camera={{ position: [4, 0, 3] }}>
                <Suspense fallback={<Loader />}>
                    <Environment preset="forest" />
                    <OrbitControls ref={ref} target={[4, 0, 0]} />
                    <Model controls={ref} />
                    <Tween />
                </Suspense>
            </Canvas>
            <div id="instructions">Doubleclick to tween the OrbitControls target</div>
        </>
    )
}



// 
useGLTF.preload('/models/scan-transformed.glb');

function Model({ controls }: any) {
    const { nodes, materials } = useGLTF('/models/scan-transformed.glb');

    return (
        <group dispose={null}>
            <mesh geometry={getGeometry(nodes.Mesh_0)} material={materials.material_0} />

            {/* 
                A box used for raycasting since the photogrammetry 
                geometry has so many faces that it makes the raycaster 
                slow 
            */}

            <mesh
                position={[0, -0.25, -0.6]}
                rotation-y={-Math.PI / 64}
                onDoubleClick={({ point }) => {
                    new TWEEN.Tween(controls.current.target)
                        .to({ x: point.x, y: point.y, z: point.z, }, 500)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .start();
                }}
            >
                <boxGeometry args={[30, 3, 0.1]} />
                <meshBasicMaterial wireframe visible={false} />
            </mesh>
        </group>
    )
}
