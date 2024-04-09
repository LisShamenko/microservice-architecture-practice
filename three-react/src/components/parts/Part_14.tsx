import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three-stdlib';

extend({ OrbitControls });



// 
export default function Part_14() {
    return (
        <Canvas camera={{ position: [0, 0, 3] }}>
            <Polygon />
            <Controls />
        </Canvas>
    )
}



// 
function Polygon() {
    return (
        <mesh>
            <dodecahedronGeometry />
            <meshNormalMaterial wireframe />
        </mesh>
    )
}

function Controls() {
    const { camera, gl: { domElement } } = useThree();
    // @ts-ignore
    return <orbitControls args={[camera, domElement]} />
}
