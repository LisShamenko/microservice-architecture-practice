import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Environment, OrbitControls, Stats, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { Vector3 } from 'three';
// 
import './Part_10.css';



// 
const Models: any = {
    hammer: '/models/hammer_annotated.glb',
    drill: '/models/drill_annotated.glb',
    tapeMeasure: '/models/tapeMeasure_annotated.glb',
};

export default function Part_10() {

    const { model } = useControls({
        model: { value: 'hammer', options: Object.keys(Models) },
    })

    return (<>
        <Canvas camera={{ position: [0, 0, -0.2], near: 0.025 }}>
            <Environment files="/img/workshop_1k.hdr" background />
            <group>
                <Model url={Models[model]} />
            </group>
            <OrbitControls autoRotate />
            <Stats />
        </Canvas>
        <span id="info">
            The {model.replace(/([A-Z])/g, ' $1').toLowerCase()} is selected.
        </span>
    </>)
}



// 
interface IProps {
    url: string,
}

function Model({ url }: IProps) {

    const { scene } = useGLTF(url);
    const [cache, setCache] = useState<any>({});

    if (!cache[url]) {
        const annotations: any[] = [];

        scene.traverse((o) => {
            if (o.userData.prop) {
                annotations.push(
                    <Html key={o.uuid} distanceFactor={0.25}
                        position={new Vector3(o.position.x, o.position.y, o.position.z)}
                    >
                        <div className="annotation">{o.userData.prop}</div>
                    </Html>
                )

                //      <Html position={[0, 0, -1]} occlude>
                //          <div>this text will occlude if position obstructed</div>
                //      </Html>

                //      <Html position={[0, 0, -2]} transform>
                //          <div>this text will rotate with the scene</div>
                //      </Html>

            }
        })

        console.log('--- Caching JSX for url: ' + url);
        setCache({
            ...cache,
            [url]: <primitive object={scene}>{annotations}</primitive>,
        })
    }
    return cache[url];
}
