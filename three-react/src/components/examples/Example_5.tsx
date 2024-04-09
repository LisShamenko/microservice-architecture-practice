import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, Vector3 } from 'three';



// 
export default function Example_5() {
    return (
        <Canvas camera={{ position: [0, 0, 4] }}>
            <directionalLight position={[1, 1, 1]} intensity={Math.PI * 1.5} />
            <Box position={[0, 1.5, 0]} name="A0">
                <Box position={[-0.66, -1, 0]} name="B0">
                    <Box position={[-0.66, -1, 0]} name="C0">
                        <Box position={[-0.66, -1, 0]} name="D0" />
                        <Box position={[0.66, -1, 0]} name="D1" />
                    </Box>
                    <Box position={[0.66, -1, 0]} name="C1">
                        <Box position={[0.66, -1, 0]} name="D2" />
                    </Box>
                </Box>
                <Box position={[0.66, -1, 0]} name="B1">
                    <Box position={[0.66, -1, 0]} name="C2">
                        <Box position={[0.66, -1, 0]} name="D3" />
                    </Box>
                </Box>
            </Box>
            <Rig />
        </Canvas>
    )
}



// 
function Box(props: any) {

    const ref = useRef<any>();
    const [count, setCount] = useState(0);
    const black = new Color('black');

    console.log('--- Box ' + props.name + ', count = ' + count);

    useEffect(() => {
        ref.current.material.color.set(0x00ff00);
    })

    useFrame(() => {
        ref.current.material.color.lerp(black, 0.1);
    })

    return (
        <mesh {...props} ref={ref}
            onPointerDown={(e) => {
                // e.stopPropagation();
                setCount(count + 1);
            }}>
            <boxGeometry />
            <meshStandardMaterial />
            <Text fontSize={0.5} position-z={0.501}>{count}</Text>
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
