import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useProgress, Stats } from '@react-three/drei';
import TWEEN from '@tweenjs/tween.js';
//
import { Model } from './Example_1/house.model';
import annotations from './Example_1/annotations.json';
import './Example_1/styles.css';



// 
export default function Example_1() {

    const ref = useRef<any>(null);

    return (
        <Canvas camera={{ position: [0, 0, 3] }}>
            <OrbitControls ref={ref} target={[8, 2, 3]} />
            <Suspense fallback={<Loader />}>
                <Environment preset="forest" background blur={0.75} />
                <Model />
                <Annotations controls={ref} />
                <Tween />
            </Suspense>
            <Stats />
        </Canvas>
    )
}



// 
function Annotations({ controls }: any) {

    const { camera } = useThree();
    const [selected, setSelected] = useState(-1);

    const onPointerDown = (a: any, i: number) => {
        setSelected(i);

        // [tween.js](https://github.com/tweenjs/tween.js)

        // change target
        new TWEEN.Tween(controls.current.target)
            .to({ x: a.lookAt.x, y: a.lookAt.y, z: a.lookAt.z }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        // change camera position
        new TWEEN.Tween(camera.position)
            .to({ x: a.camPos.x, y: a.camPos.y, z: a.camPos.z }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    return (<>
        {annotations.map((a, i) => {
            return (
                <Html key={i} position={[a.lookAt.x, a.lookAt.y, a.lookAt.z]}>

                    <svg height="34" width="34" transform="translate(-16 -16)"
                        style={{ cursor: 'pointer' }}
                    >
                        <circle cx="17" cy="17" r="16"
                            stroke="white" strokeWidth="2" fill="rgba(0,0,0,.66)"
                            onPointerDown={() => onPointerDown(a, i)}
                        />
                        <text x="12" y="22" fill="white"
                            style={{ pointerEvents: 'none' }}
                            fontSize={17} fontFamily="monospace"
                        >
                            {i + 1}
                        </text>
                    </svg>

                    {a.description && i === selected && (
                        <div id={'desc_' + i} className="annotationDescription"
                            dangerouslySetInnerHTML={{ __html: a.description }}
                        />
                    )}
                </Html>
            )
        })}
    </>)
}



// 
export function Tween() {
    useFrame(() => {
        TWEEN.update();
    })
    return <></>;
}

export function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
}
