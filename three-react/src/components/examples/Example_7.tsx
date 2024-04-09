import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import TWEEN from '@tweenjs/tween.js';
// 
import './Example_6/styles.css';
import annotations from './Example_6/annotations.json';
import { Tween } from './Example_1';
import { getGeometry } from './Example_9';



// 
export default function Example_7() {

    const controls = useRef<any>();
    const camera = useRef<any>();

    const buttons = annotations.map(({ title, lookAt, position }) => {

        const onClick = () => {
            new TWEEN.Tween(controls.current.target)
                .to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 2100)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();

            // change camera position
            new TWEEN.Tween(camera.current.position)
                .to({ x: position.x, y: position.y, z: position.z }, 2000)
                .easing(TWEEN.Easing.Cubic.Out)
                .start()
        }

        return <button onClick={onClick}>{title}</button>;
    })

    return (<>
        <Canvas shadows>
            <PerspectiveCamera ref={camera} makeDefault position={[10, 10, 10]} />
            <directionalLight
                intensity={1}
                castShadow={true}
                shadow-bias={-0.0002}
                shadow-mapSize={[2048, 2048]}
                position={[85.0, 80.0, 70.0]}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={30}
                shadow-camera-bottom={-30}
            />
            <Environment files='/img/drakensberg_solitary_mountain_1k.hdr' background />
            <OrbitControls ref={controls} target={[0, 1, 0]} />
            <Arena controls={controls} />
            <Tween />
            <Stats />
        </Canvas>
        <div id='ui'>{buttons}</div>
    </>)
}



// 
useGLTF.preload('/models/collision-world.glb');

function Arena({ controls }: any) {

    const { nodes, materials } = useGLTF('/models/collision-world.glb');

    const onDoubleClick = (e: any) => {
        new TWEEN.Tween(controls.current.target)
            .to({ x: e.point.x, y: e.point.y, z: e.point.z }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    return (
        <group dispose={null}>
            <mesh
                geometry={getGeometry(nodes.Cube004)}
                material={materials['Material.001']}
                position={[7.68, -5.59, 26.38]} scale={0.5}
                castShadow receiveShadow
                material-envMapIntensity={0.4}
                onDoubleClick={onDoubleClick}
            />
        </group>
    )
}
