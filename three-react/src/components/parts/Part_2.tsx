import { useRef, useState } from 'react';
import { Canvas, useFrame, Vector3 } from '@react-three/fiber';
import * as THREE from 'three';



//
export default function Part_2() {
    const polyhedron = [
        new THREE.BoxGeometry(),
        new THREE.SphereGeometry(0.785398),
        new THREE.DodecahedronGeometry(0.785398)
    ]

    return (
        <Canvas camera={{ position: [0, 0, 3] }}>
            <Polyhedron position={[-0.75, -0.75, 0]} polyhedron={polyhedron} />
            <Polyhedron position={[0.75, -0.75, 0]} polyhedron={polyhedron} />
            <Polyhedron position={[-0.75, 0.75, 0]} polyhedron={polyhedron} />
            <Polyhedron position={[0.75, 0.75, 0]} polyhedron={polyhedron} />
        </Canvas>
    )
}



// 
interface IPolyhedronProps {
    position?: Vector3,
    polyhedron: THREE.BufferGeometry[],
}

function Polyhedron({ position, polyhedron }: IPolyhedronProps) {
    const ref = useRef<any>();
    const [count, setCount] = useState(0);

    console.log('--- polyhedron = ', polyhedron);

    useFrame((_, delta) => {
        ref.current.rotation.x += delta;
        ref.current.rotation.y += 0.5 * delta;
    })

    return (
        <mesh position={position} ref={ref}
            onPointerDown={() => {
                setCount((count + 1) % 3);
            }}
            geometry={polyhedron[count]}
        >
            <meshBasicMaterial color={'lime'} wireframe />
        </mesh>
    )
}
