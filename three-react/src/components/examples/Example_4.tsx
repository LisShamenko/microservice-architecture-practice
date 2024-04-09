import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// 
import { lerp } from '../parts/Part_12';



// 
export default function Example_4() {
    return (
        <Canvas camera={{ position: [3, 0, 2] }}>
            <Polygon position={[-1, 0, 0]} />
            <Polygon position={[1, 0, 0]} />
            <OrbitControls />
        </Canvas>
    )
}



// 
function Polygon({ position }: any) {

    const ref = useRef<any>();
    const [hover, setHover] = useState(false);

    useFrame((_, delta) => {
        if (hover) {
            ref.current.rotation.x += delta;
            ref.current.rotation.y += 0.5 * delta;
        }

        ref.current.material.opacity = lerp(
            ref.current.material.opacity, hover ? 0.25 : 1, 0.1
        );
    })

    // 
    const onPointerOver = (e: any) => {
        e.stopPropagation();
        setHover(true);
    }

    const onPointerOut = (e: any) => {
        e.stopPropagation();
        setHover(false);
    }

    return (
        <mesh ref={ref} position={position}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <dodecahedronGeometry />
            <meshNormalMaterial transparent={true} />
        </mesh>
    )
}
