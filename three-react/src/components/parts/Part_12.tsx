import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector3, Color, MathUtils } from 'three';
import { Stats, Environment, Center } from '@react-three/drei';



// 
export default function Part_12() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <Environment preset="forest" background />
            <Center>
                {[0, 1, 2, 3, 4].map((x) => [0, 1, 2].map((y) => (
                    <Button key={x + y * 5} position={[x * 2.5, y * 2.5, 0]} />
                )))}
            </Center>
            <Rig />
            <Stats />
        </Canvas>
    )
}



// 
const vec = new Vector3();

function Rig() {
    return useFrame(({ camera, mouse }) => {
        vec.set(mouse.x * 2, mouse.y * 2, camera.position.z);
        camera.position.lerp(vec, 0.025);
        camera.lookAt(0, 0, 0);
    })
}



// 
const black = new Color('black');

export function lerp(from: number, to: number, speed: number) {
    const r = (1 - speed) * from + speed * to;
    return Math.abs(from - to) < 0.001 ? to : r;
}

function Button(props: any) {

    const ref = useRef<any>(null);
    const [hovered, setHovered] = useState(false);
    const [selected, setSelected] = useState(false);

    const colorTo = useMemo(
        () => new Color(Math.floor(Math.random() * 16777216)),
        []
    )

    useFrame(() => {
        ref.current.rotation.x = hovered
            ? MathUtils.lerp(ref.current.rotation.x, -Math.PI * 2, 0.025)
            : MathUtils.lerp(ref.current.rotation.x, 0, 0.025);

        ref.current.position.z = selected
            ? lerp(ref.current.position.z, 0, 0.025)
            : lerp(ref.current.position.z, -3, 0.025);

        ref.current.material.color.lerp(selected ? colorTo : black, 0.025);
    })

    return (
        <mesh {...props} ref={ref}
            onPointerDown={() => setSelected(!selected)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <icosahedronGeometry />
            <meshPhysicalMaterial
                roughness={0} metalness={0} thickness={3.12}
                ior={1.74} transmission={1.0}
            />
        </mesh>
    )
}
