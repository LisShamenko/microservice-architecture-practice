import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';



// 
export default function Part_13() {

    const keyMap = useKeyboard();

    return (
        <Canvas camera={{ position: [1, 2, 3] }}>
            <Box position={[-1.5, 0.5, 0]} keyMap={keyMap} />
            <Box position={[0, 0.5, 0]} keyMap={keyMap} selected />
            <Box position={[1.5, 0.5, 0]} keyMap={keyMap} />
            <OrbitControls />
            <axesHelper args={[5]} />
            <gridHelper />
            <Stats />
        </Canvas>
    )
}



// 
export function useKeyboard() {

    const keyMap = useRef<any>({});

    useEffect(() => {
        const onDocumentKey = (e: any) => {
            keyMap.current[e.code] = e.type === 'keydown';
        }
        document.addEventListener('keydown', onDocumentKey);
        document.addEventListener('keyup', onDocumentKey);
        return () => {
            document.removeEventListener('keydown', onDocumentKey);
            document.removeEventListener('keyup', onDocumentKey);
        }
    }, [])

    return keyMap.current;
}



// 
function Box(props: any) {

    const ref = useRef<any>(null);
    const keyMap = props.keyMap;
    const [selected, setSelected] = useState(props.selected)

    useFrame((_, delta) => {
        keyMap['KeyA'] && selected && (ref.current.position.x -= 1 * delta);
        keyMap['KeyD'] && selected && (ref.current.position.x += 1 * delta);
        keyMap['KeyW'] && selected && (ref.current.position.z -= 1 * delta);
        keyMap['KeyS'] && selected && (ref.current.position.z += 1 * delta);
    })

    return (
        <mesh ref={ref} {...props} onPointerDown={() => setSelected(!selected)}>
            <boxGeometry />
            <meshBasicMaterial color={0x00ff00} wireframe={!selected} />
        </mesh>
    )
}
