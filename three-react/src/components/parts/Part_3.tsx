import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Stats } from '@react-three/drei';
import { Vector3 } from 'three';
import { Perf } from 'r3f-perf';
// 
import './Part_3.css';



// 
export default function Part_3() {

    // `WARNING in ./node_modules/@mediapipe/tasks-vision/vision_bundle.mjs`
    // добавить в корень проекта файл `.env`, содержащий:
    // GENERATE_SOURCEMAP=false

    // [R3F-Perf](https://github.com/utsuboco/r3f-perf#options) - более сложное 
    // решение для мониторинга производительности. Значение calls показывает 
    // количество визуализированных сеток при последнем рендеринге.

    // [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
    // - `enableDamping={true}` - при отпускании мыши, вращение медленно замедляется.
    // - `enablePan={false}` - отключает перемещение.
    // - `enableRotate={false}` - отключает вращение.

    // [PointerLockControls](https://threejs.org/docs/index.html?q=pointe#examples/en/controls/PointerLockControls)

    const controlType: any = ControlType.orbit;

    return (<>
        <Canvas camera={{ position: [0, 0, 2] }}>
            <mesh position={[0, -50, 0]}>
                <boxGeometry args={[100, 20, 100, 20, 4, 20]} />
                <meshBasicMaterial color={0x00ff00} wireframe />
            </mesh>
            <Statistics controls={controlType} />
        </Canvas>
        {(controlType === ControlType.pointerLockButton) &&
            <PointerLockButton />
        }
    </>)
}



//
export enum ControlType {
    orbit, orbitLimit, pointerLock, pointerLockButton,
}

export interface IStatisticsProps {
    controls?: ControlType,
    target?: Vector3,
}

function Statistics({
    controls = ControlType.orbit,
    target = new Vector3(),
}: IStatisticsProps) {
    return (
        <>
            <Stats showPanel={2} className="stats" />
            <Perf position="bottom-left" />
            {controls === ControlType.orbit && (
                <OrbitControls target={target} />
            )}
            {controls === ControlType.orbitLimit && (
                <OrbitControls
                    minAzimuthAngle={-Math.PI / 4}
                    maxAzimuthAngle={Math.PI / 4}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                />
            )}
            {controls === ControlType.pointerLock && (
                <PointerLockControls />
            )}
            {controls === ControlType.pointerLockButton && (
                <PointerLockControls selector="#button" />
            )}
            <axesHelper args={[10]} />
            <gridHelper
                args={[20, 20, 'teal', 'teal']}
                position={new Vector3(0, -1, 0)}
                rotation={[Math.PI / 1, 0, 0]}
            />
        </>
    )
}



// 
export const PointerLockButton = () => {

    const [showInstructions, setShowInstructions] = useState(true);

    const pointerlockchange = () => {
        setShowInstructions(!showInstructions);
    }

    useEffect(() => {
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        return () => {
            document.removeEventListener('pointerlockchange', pointerlockchange, false);
        }
    })

    return (
        <div id="instructions" className={showInstructions ? 'show' : 'hide'}>
            Instructions
            <button id="button">Click To Enter</button>
        </div>
    )
}
