import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stats, Text } from '@react-three/drei';
import { Color, Vector3 } from 'three';



// 
export default function Example_12() {
    return (
        <Canvas camera={{ position: [0, 0, 6] }}>
            <directionalLight position={[0, 0, 1]} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <group key={i * 9}>
                    <Box position={[-5, -4.5 + i * 1.5, 0]} text={'S'} />
                    <Box position={[-3, -4.5 + i * 1.5, 0]} text={'B'} />
                    <Box position={[-1, -4.5 + i * 1.5, 0]} text={'C'} />
                    <Box position={[1, -4.5 + i * 1.5, 0]} text={'O'} />
                    <Box position={[3, -4.5 + i * 1.5, 0]} text={'D'} />
                    <Box position={[5, -4.5 + i * 1.5, 0]} text={'E'} />
                </group>
            ))}
            <Rig />
            <Stats />
        </Canvas>
    );
}



// 
function Box({ text, ...props }: any) {

    const ref = useRef<any>();
    const black = useMemo(() => new Color('black'), []);
    const lime = useMemo(() => new Color('lime'), []);
    const [hovered, setHovered] = useState(false);

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 2.5;
        const y = (mouse.y * viewport.height) / 2.5;
        ref.current.lookAt(x, y, 1);
        ref.current.material.color.lerp(hovered ? lime : black, 0.05);
    })

    return (
        <mesh {...props} ref={ref}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry />
            <meshStandardMaterial color={lime} />
            <Text fontSize={0.5} position-z={0.501}>
                {text}
            </Text>
            {props.children}
        </mesh>
    )
}

function Rig() {
    const { camera, mouse } = useThree();
    const vec = new Vector3();

    return useFrame(() => {
        camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.05);
        camera.lookAt(0, 0, 0);
    })
}
