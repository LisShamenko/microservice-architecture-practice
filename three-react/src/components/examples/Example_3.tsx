import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color, MathUtils } from 'three';



// 
export default function Example_3() {
    return (
        <Canvas camera={{ position: [0, 0, 4] }}>
            <Box position-x={-2.5}>
                <Box position-x={1.25}>
                    <Box position-x={1.25}>
                        <Box position-x={1.25}>
                            <Box position-x={1.25} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Canvas>
    )
}



// 
function Box(props: any) {

    const ref = useRef<any>(null);
    const [hovered, setHover] = useState(false);
    const [rotate, setRotate] = useState(false);
    const color = new Color();

    useFrame((_, delta) => {
        if (rotate) {
            ref.current.rotation.x += 1 * delta;
        }

        ref.current.scale.y = ref.current.scale.z = MathUtils.lerp(
            ref.current.scale.y, hovered ? 1.2 : 1, 0.1
        );

        ref.current.material.color.lerp(
            color.set(hovered ? 0xff0000 : 0x00ff00), 0.1
        );
    })

    // 
    const onPointerDown = (e: any) => {
        e.stopPropagation();
        setRotate(!rotate);
    }

    const onPointerOver = (e: any) => {
        e.stopPropagation();
        setHover(true);
    }

    const onPointerOut = (e: any) => {
        e.stopPropagation();
        setHover(false);
    }

    return (
        <mesh {...props} ref={ref}
            onPointerDown={onPointerDown}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <boxGeometry onUpdate={(e) => e.rotateZ(Math.PI / 2)} />
            <meshBasicMaterial wireframe />
            {props.children}
        </mesh>
    )
}
