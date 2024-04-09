import { useRef } from 'react';
import { Stats, OrbitControls, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Debug, Physics, useBox, usePlane } from '@react-three/cannon';
import { useControls } from 'leva';



// 
export default function Example_22() {

    const gravity = useControls('Gravity', {
        x: { value: 0, min: -10, max: 10, step: 0.1 },
        y: { value: -9.8, min: -10, max: 10, step: 0.1 },
        z: { value: 0, min: -10, max: 10, step: 0.1 }
    })

    return (
        <Canvas camera={{ position: [0, 4, 4] }}>
            <Environment
                preset="forest"
                background
                ground={{
                    height: 2,
                    radius: 115,
                    scale: 100
                }}
            />
            <Physics gravity={[gravity.x, gravity.y, gravity.z]}>
                <Debug>
                    <Plane rotation={[-Math.PI / 2, 0, 0]} />
                    {[0, 1, 2, 3, 4, 5].map((x) =>
                        [0, 1, 2, 3, 4, 5].map((z) =>
                            <Box key={x + z * 6} position={[(x - 2.5) * 1.01, 2, (z - 2.5) * 1.01]} />
                        )
                    )}
                </Debug>
            </Physics>
            <OrbitControls target-y={0.5} enableZoom={false} />
            <Stats />
        </Canvas>
    )
}



// 
function Plane(props: any) {
    usePlane(() => ({ ...props }));
    return <></>;
}

function Box(props: any) {

    const [ref, api] = useBox(
        () => ({
            args: [1, 1, 1],
            mass: 0,
            type: 'Dynamic',
            ...props,
        }),
        useRef<any>()
    );

    return (
        <mesh ref={ref}
            onPointerDown={(e) => {
                e.stopPropagation()
                api.mass.set(1)
            }}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    )
}
