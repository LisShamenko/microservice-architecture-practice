import { useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { create } from 'zustand';
import { BackSide, TextureLoader } from 'three';
import TWEEN from '@tweenjs/tween.js';
// 
import { Tween } from './Example_1';
import './Example_31/styles.css';



// 
export default function Example_31() {

    const { position, fov } = useStore<any>((state) => state);
    const setParameters = useStore((state: any) => state.setParameters);

    return (
        <>
            <Canvas camera={{ position, fov }}>
                <Sphere />
                <Camera />
                <OrbitControls enablePan={false} enableZoom={false} />
                <Tween />
                <Stats />
            </Canvas>
            <button id="button0" onClick={() => setParameters([50, 80, 50], 135)}>
                Fisheye
            </button>
            <button id="button1" onClick={() => setParameters([0, 0, 10], 70)}>
                Panorama
            </button>
        </>
    )
}



// 
const useStore = create((set) => ({
    position: [50, 80, 50],
    fov: 135,
    setParameters: (position: any, fov: any) => {
        set({ position })
        set({ fov })
    }
}))

function Sphere() {
    
    const texture = useLoader(TextureLoader, '/img/vignaioli_night_2k.jpg');

    return (
        <>
            <mesh>
                <sphereGeometry args={[100, 128, 128]} />
                <meshBasicMaterial map={texture} side={BackSide} />
            </mesh>
        </>
    )
}

function Camera() {

    const { camera } = useThree();
    const [x, y, z] = useStore((state: any) => state.position);
    const fov = useStore((state: any) => state.fov);

    useEffect(() => {

        new TWEEN.Tween(camera.position)
            .to({ x: x, y: y, z: z }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

        new TWEEN.Tween(camera)
            .to({ fov: fov }, 1000)
            .start()
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => camera.updateProjectionMatrix());

    }, [x, y, z, fov])

    return <></>;
}
