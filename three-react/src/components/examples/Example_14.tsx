import { Canvas } from '@react-three/fiber';
import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';



// 
export default function Example_14() {

    const ref = useRef<any>();

    return (
        <Canvas camera={{ position: [0, 0, 2] }}>
            <Box ref={ref} />
        </Canvas>
    )
}



// 
const Box = forwardRef(function Box(props: any, ref: any) {

    useFrame((_, delta) => {
        ref.current.rotation.x += 1 * delta;
        ref.current.rotation.y += 0.5 * delta;
    })

    return (
        <mesh {...props} ref={ref}>
            <boxGeometry />
            <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    )
})
