import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Color, Euler, Vector3, Material } from 'three';
import { Leva, useControls } from 'leva';
// 
import './Part_4.css';



// 
export default function Part_4() {

    // [leva configuration](https://github.com/pmndrs/leva/blob/main/docs/configuration.md)

    const polyhedron = useMemo(
        () => [
            new THREE.BoxGeometry(),
            new THREE.SphereGeometry(0.785398),
            new THREE.DodecahedronGeometry(0.785398),
            new THREE.IcosahedronGeometry(0.785398),
        ],
        []
    )

    const options = useMemo(() => {
        return {
            x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
            y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
            z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
            visible: true,
            color: 'lime'
        }
    }, [])

    const pA = useControls('Polyhedron A', options);
    const pB = useControls('Polyhedron B', options);

    return (<>
        <div id="leva__root">
            <Leva collapsed />
        </div>
        <div className="canvas-container">
            <Canvas camera={{ position: [-1, 4, 2.5] }}>
                {/* <color attach="background" args={[options.color]} /> */}
                <directionalLight position={[1, 1, 1]} />
                <Polyhedron
                    name="meshBasicMaterial"
                    visible={pA.visible}
                    position={new Vector3(-3, 1, 0)}
                    rotation={new Euler(pA.x, pA.y, pA.z)}
                    // color={new Color(pA.color)}
                    material={new THREE.MeshBasicMaterial({
                        color: 'yellow',
                    })}
                    polyhedron={polyhedron}
                />
                <Polyhedron
                    name="meshNormalMaterial"
                    visible={pB.visible}
                    position={new Vector3(-1, 1, 0)}
                    rotation={new Euler(pB.x, pB.y, pB.z)}
                    // color={new Color(pB.color)}
                    material={new THREE.MeshNormalMaterial({
                        flatShading: true,
                    })}
                    polyhedron={polyhedron}
                />
                <Polyhedron
                    name="meshPhongMaterial"
                    position={new Vector3(1, 1, 0)}
                    material={new THREE.MeshPhongMaterial({
                        color: 'lime', flatShading: true,
                    })}
                    polyhedron={polyhedron}
                />
                <Polyhedron
                    name="meshStandardMaterial"
                    position={new Vector3(3, 1, 0)}
                    material={new THREE.MeshStandardMaterial({
                        color: 0xff0033, flatShading: true,
                    })}
                    polyhedron={polyhedron}
                />
                <OrbitControls target-y={1} />
                <axesHelper args={[5]} />
                <gridHelper />
            </Canvas>
        </div>
    </>)
}



//
interface IPolyhedronProps {
    name: string,
    polyhedron: THREE.BufferGeometry[],
    visible?: boolean,
    material?: Material,
    position?: Vector3,
    rotation?: Euler,
    color?: Color,
}

function Polyhedron({
    name, polyhedron, visible, material,
    position, rotation, color = new Color(),
}: IPolyhedronProps) {
    const ref = useRef<any>();
    const [count, setCount] = useState(2);

    console.log('--- uuid = ', polyhedron[count].uuid);

    useFrame((_, delta) => {
        ref.current.rotation.x += 0.2 * delta;
        ref.current.rotation.y += 0.05 * delta;
    })

    useControls(name, {
        wireframe: {
            value: false,
            onChange: (v) => {
                ref.current.material.wireframe = v;
            },
        },
        flatShading: {
            value: true,
            onChange: (v) => {
                ref.current.material.flatShading = v;
                ref.current.material.needsUpdate = true;
            },
        },
        color: {
            value: 'lime',
            onChange: (v) => {
                ref.current.material.color = new THREE.Color(v);
            },
        },
    })

    return (
        <mesh ref={ref} visible={visible} material={material}
            position={position} rotation={rotation}
            onPointerDown={() => {
                setCount((count + 1) % 3);
            }}
            geometry={polyhedron[count]}
        />
    )
}
