import { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stats, OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { useControls, button } from 'leva';
import TWEEN from '@tweenjs/tween.js'
// 
import annotations from './Example_6/annotations.json';
import { Tween } from './Example_1';
import { getGeometry } from './Example_9';



// 
export default function Example_6() {

    const ref = useRef<any>();

    return (
        <Canvas camera={{ position: [10, 10, 10] }} shadows>
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
            <Environment files="/img/drakensberg_solitary_mountain_1k.hdr" background />
            <OrbitControls ref={ref} target={[0, 1, 0]} />
            <Arena controls={ref} />
            <Stats />
            <Tween />
        </Canvas>
    )
}



// 
useGLTF.preload('/models/collision-world.glb');

function Arena({ controls }: any) {

    const { nodes, materials } = useGLTF('/models/collision-world.glb');
    const { camera } = useThree();

    useControls('Camera', () => {
        console.log('--- creating buttons');

        // using reduce
        const _buttons = annotations.reduce(
            (acc, { title, position, lookAt }) =>
                Object.assign(acc, {
                    [title]: button(() => {

                        // change target
                        new TWEEN.Tween(controls.current.target)
                            .to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 2100)
                            .easing(TWEEN.Easing.Cubic.Out)
                            .start();

                        // change camera position
                        new TWEEN.Tween(camera.position)
                            .to({ x: position.x, y: position.y, z: position.z }, 2000)
                            .easing(TWEEN.Easing.Cubic.Out)
                            .start();
                    })
                }),
            {}
        )
        return _buttons;
    })

    const onDoubleClick = (e: any) => {
        new TWEEN.Tween(controls.current.target)
            .to({ x: e.point.x, y: e.point.y, z: e.point.z }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
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
