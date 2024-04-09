import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3, Material } from 'three';
import { useControls } from 'leva';



//
export default function Part_5() {
    return (
        <Canvas camera={{ position: [4, 4, 1.5] }}>
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
    const ambientRef = useRef<any>();
    const directionalRef = useRef<any>();
    const pointRef = useRef<any>();
    const spotRef = useRef<any>();

    useControls('Ambient Light', {
        visible: {
            value: false,
            onChange: (v) => {
                ambientRef.current.visible = v;
            }
        },
        color: {
            value: 'white',
            onChange: (v) => {
                ambientRef.current.color = new THREE.Color(v);
            }
        }
    })

    useControls('Directional Light', {
        visible: {
            value: true,
            onChange: (v) => {
                directionalRef.current.visible = v;
            }
        },
        position: {
            value: { x: 1, y: 1, z: 1 },
            onChange: (v) => {
                directionalRef.current.position.copy(v);
            }
        },
        color: {
            value: 'white',
            onChange: (v) => {
                directionalRef.current.color = new THREE.Color(v);
            }
        }
    })

    useControls('Point Light', {
        visible: {
            value: false,
            onChange: (v) => {
                pointRef.current.visible = v;
            }
        },
        position: {
            value: { x: 2, y: 0, z: 0 },
            onChange: (v) => {
                pointRef.current.position.copy(v);
            }
        },
        color: {
            value: 'white',
            onChange: (v) => {
                pointRef.current.color = new THREE.Color(v);
            }
        }
    })

    useControls('Spot Light', {
        visible: {
            value: false,
            onChange: (v) => {
                spotRef.current.visible = v;
            }
        },
        position: {
            value: { x: 3, y: 2.5, z: 1 },
            onChange: (v) => {
                spotRef.current.position.copy(v);
            }
        },
        color: {
            value: 'white',
            onChange: (v) => {
                spotRef.current.color = new THREE.Color(v);
            }
        }
    })

    return (<>
        <ambientLight ref={ambientRef} />
        <directionalLight ref={directionalRef} />
        <pointLight ref={pointRef} />
        <spotLight ref={spotRef} />
    </>)
}



// 
interface IProps {
    name?: string,
    position?: Vector3,
    material?: Material,
}

function Polyhedron(props: IProps) {
    const ref = useRef<any>();

    useFrame((_, delta) => {
        ref.current.rotation.x += 0.2 * delta;
        ref.current.rotation.y += 0.05 * delta;
    })

    return (
        <mesh {...props} ref={ref}>
            <icosahedronGeometry args={[1, 1]} />
        </mesh>
    )
}
