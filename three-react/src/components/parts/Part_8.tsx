import { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Circle, Clone, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { useControls } from 'leva';
// 
import './Part_8.css';



// 
interface IProps {
    url: string,
}

function Model({ url }: IProps) {
    const { scene } = useGLTF(url);
    return (
        <Clone object={scene} />
    )
}



// 
export default function Part_8() {

    const gltf = useLoader(GLTFLoader, '/models/monkey.glb');

    const Models = [
        { title: 'Hammer', url: './models/hammer.glb' },
        { title: 'Drill', url: './models/drill.glb' },
        { title: 'Tape Measure', url: './models/tapeMeasure.glb' }
    ]

    const { title } = useControls({
        title: {
            options: Models.map(({ title }) => title),
        }
    })

    return (<>
        <Canvas camera={{ position: [-0.5, 1, 2], near: 0.025 }} shadows>
            <Environment background blur={0.05}
                // preset={EnvironmentPresets.city}
                files="./img/workshop_1k.hdr"
            />
            <Suspense>
                <Model url={Models[Models.findIndex((m) => m.title === title)].url} />
            </Suspense>
            <directionalLight castShadow
                position={[3.3, 1.0, 4.4]}
                intensity={Math.PI * 2}
            />
            <primitive
                object={gltf.scene}
                position={[0, 1, 0]}
                children-0-castShadow
            />
            <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
                <meshStandardMaterial />
            </Circle>
            <OrbitControls target={[0, 1, 0]} autoRotate />
            <axesHelper args={[5]} />
        </Canvas>
        <span id="info">The {title} is selected.</span>
    </>)
}

//      useGLTF.preload(Models.map(({ url }) => url))
