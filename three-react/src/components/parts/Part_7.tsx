import { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { useControls } from 'leva';
// 
import { Floor, Polyhedron } from './Part_6';



// 
export default function Part_7() {
    const texture = useLoader(THREE.TextureLoader, './img/grid.png');

    return (
        <Canvas camera={{ position: [4, 4, 1.5] }} shadows>
            <Floor />
            <Lights />
            <Polyhedron
                name="meshBasicMaterial"
                position={new Vector3(-3, 1, 0)}
                material={new THREE.MeshBasicMaterial({
                    map: texture,
                })}
            />
            <Polyhedron
                name="meshNormalMaterial"
                position={new Vector3(-1, 1, 0)}
                material={new THREE.MeshNormalMaterial({
                    flatShading: true,
                })}
            />
            <Polyhedron
                name="meshPhongMaterial"
                position={new Vector3(1, 1, 0)}
                material={new THREE.MeshPhongMaterial({
                    map: texture, flatShading: true,
                })}
            />
            <Polyhedron
                name="meshStandardMaterial"
                position={new Vector3(3, 1, 0)}
                material={new THREE.MeshStandardMaterial({
                    map: texture, flatShading: true,
                })}
            />
            <OrbitControls target={[2, 2, 0]} />
            <axesHelper args={[5]} />
            <gridHelper />
            <Stats />
        </Canvas>
    )
}



// 
function Lights() {
    const dirRef = useRef<any>();

    useControls('Directional Light', {
        intensity: {
            value: 1,
            min: 0,
            max: 5,
            step: 0.1,
            onChange: (v) => {
                dirRef.current.intensity = v;
            },
        },
        position: {
            value: { x: 3, y: 2.5, z: 1 },
            onChange: (v) => {
                dirRef.current.position.copy(v);
            },
        },
    })

    return (
        <directionalLight ref={dirRef} castShadow />
    )
}
