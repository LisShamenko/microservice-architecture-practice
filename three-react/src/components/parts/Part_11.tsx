import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
// 
import { ShoeDracoModel } from './shoe-draco.model';



// 
export default function Part_11() {

    // [@react-three/gltfjsx](https://www.npmjs.com/package/@react-three/gltfjsx)
    // - Генератор `JSX`.
    //     `npx gltfjsx ./public/models/shoe-draco.glb`
    // - Сжатие `glTF`.
    //     `npx gltfjsx ./my-very-large-gltf-file.glb -T`

    return (<>
        <Canvas camera={{ position: [0, 0, 1.66] }}>
            <Environment preset="forest" />
            <ShoeDracoModel />
            <ContactShadows position={[0, -0.8, 0]} color="#ffffff" />
            <OrbitControls autoRotate />
        </Canvas>
    </>)
}
