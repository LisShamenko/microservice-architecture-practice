import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Stats, OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import { GUI } from 'dat.gui';



// 
export default function Example_17() {
    return (
        <Canvas shadows camera={{ position: [0, 0, 1.75] }}>
            <Environment files="/img/venice_sunset_1k.hdr" />
            <directionalLight
                intensity={Math.PI}
                position={[4, 0, 2]}
                castShadow={true}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-2}
                shadow-camera-right={2}
                shadow-camera-top={-2}
                shadow-camera-bottom={2}
                shadow-camera-near={0.1}
                shadow-camera-far={7}
            />
            <Earth />
            <OrbitControls />
            <Stats />
        </Canvas>
    )
}



// 
function Earth() {

    const meshRef = useRef<any>();
    const materialRef = useRef<any>();
    const { gl } = useThree();

    const texture = useLoader(TextureLoader, '/img/worldColour.5400x2700.jpg');
    const displacementMap = useLoader(TextureLoader, '/img/gebco_bathy_2700x1350.jpg');

    useEffect(() => {
        const gui = new GUI();
        gui.add(materialRef.current, 'wireframe', 0, Math.PI * 2);
        gui.add(materialRef.current, 'displacementScale', 0, 1.0, 0.1);
        return () => {
            gui.destroy();
        }
    }, [])

    useEffect(() => {
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    }, [texture, gl])

    useFrame((_, delta) => {
        meshRef.current.rotation.y += delta / 4;
    })

    return (
        <mesh ref={meshRef} castShadow={true} receiveShadow={true}>
            <icosahedronGeometry args={[1, 128]} />
            <meshStandardMaterial
                ref={materialRef}
                wireframe={false}
                map={texture}
                displacementMap={displacementMap}
                displacementScale={0.5}
            />
        </mesh>
    )
}
