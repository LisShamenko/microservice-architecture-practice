import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3, Material } from 'three';
import { useControls } from 'leva';



//
export default function Part_6() {
    return (
        <Canvas camera={{ position: [4, 4, 1.5] }} shadows>
            <Floor />
            <Lights />
            <Polyhedron
                name="meshBasicMaterial"
                position={new Vector3(-3, 1, 0)}
                material={new THREE.MeshBasicMaterial({
                    color: 'yellow',
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
                    color: 'lime', flatShading: true,
                })}
            />
            <Polyhedron
                name="meshStandardMaterial"
                position={new Vector3(3, 1, 0)}
                material={new THREE.MeshStandardMaterial({
                    color: 0xff0033, flatShading: true,
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

    const ambCtl = useControls('Ambient Light', {
        visible: false, intensity: { value: 1.0, min: 0, max: 1.0, step: 0.1 },
    })

    const dirCtl = useControls('Directional Light', {
        visible: true, position: { x: 3.3, y: 1.0, z: 4.4 }, castShadow: true,
    })

    const pointCtl = useControls('Point Light', {
        visible: false, position: { x: 2, y: 0, z: 0 }, castShadow: true,
    })

    const spotCtl = useControls('Spot Light', {
        visible: false, position: { x: 3, y: 2.5, z: 1 }, castShadow: true,
    })

    return (<>
        <ambientLight visible={ambCtl.visible}
            intensity={ambCtl.intensity}
        />
        <directionalLight visible={dirCtl.visible}
            castShadow={dirCtl.castShadow}
            position={new Vector3(
                dirCtl.position.x, dirCtl.position.y, dirCtl.position.z,
            )}
        />
        <pointLight visible={pointCtl.visible}
            castShadow={pointCtl.castShadow}
            position={new Vector3(
                pointCtl.position.x, pointCtl.position.y, pointCtl.position.z,
            )}
        />
        <spotLight visible={spotCtl.visible}
            castShadow={spotCtl.castShadow}
            position={new Vector3(
                spotCtl.position.x, spotCtl.position.y, spotCtl.position.z,
            )}
        />
    </>)
}



// 
interface IProps {
    name?: string,
    position?: Vector3,
    material?: Material,
}

export function Polyhedron(props: IProps) {
    const ref = useRef<any>();

    useFrame((_, delta) => {
        ref.current.rotation.x += 0.2 * delta;
        ref.current.rotation.y += 0.05 * delta;
    })

    return (
        <mesh {...props} ref={ref} castShadow receiveShadow>
            <icosahedronGeometry args={[1, 1]} />
        </mesh>
    )
}

//
export function Floor() {
    return (
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <circleGeometry args={[10]} />
            <meshStandardMaterial />
        </mesh>
    )
}
