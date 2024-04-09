import { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Vector3, BufferGeometry, DoubleSide } from 'three';
import { GUI } from 'dat.gui';



// 
export default function Example_2() {

    // [dat.GUI](https://github.com/dataarts/dat.gui/tree/master)

    return (
        <Canvas camera={{ position: [1, 1, 3] }}>
            <Polyhedron />
            <OrbitControls />
            <Stats />
        </Canvas>
    )
}



// 
function Polyhedron() {

    const data = { x: 1 };

    const geometry = useMemo(() => {
        let g = new BufferGeometry();
        const points = [
            new Vector3(-1, 1, -1), //c
            new Vector3(-1, -1, 1), //b
            new Vector3(1, 1, 1),   //a

            new Vector3(1, 1, 1),   //a
            new Vector3(1, -1, -1), //d
            new Vector3(-1, 1, -1), //c

            new Vector3(-1, -1, 1), //b
            new Vector3(1, -1, -1), //d
            new Vector3(1, 1, 1),   //a

            new Vector3(-1, 1, -1), //c
            new Vector3(1, -1, -1), //d
            new Vector3(-1, -1, 1)  //b
        ];
        g.setFromPoints(points);
        g.computeVertexNormals();
        return g;
    }, [])

    useEffect(() => {
        const gui = new GUI();
        gui.add(data, "x", -5, -1, 0.01).onChange(() => {
            geometry.attributes.position.array[3] = data.x;
            geometry.attributes.position.needsUpdate = true;
        })
        return () => {
            gui.destroy();
        }
    }, [])

    return (
        <mesh geometry={geometry}>
            <meshNormalMaterial side={DoubleSide} />
        </mesh>
    )
}
