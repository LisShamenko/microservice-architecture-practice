import { useRef, useMemo } from 'react';
import { MeshNormalMaterial, IcosahedronGeometry, TorusKnotGeometry } from 'three';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, useGLTF } from '@react-three/drei';
import { Debug, Physics, useBox, usePlane, useSphere, useTrimesh, useCylinder, useConvexPolyhedron } from '@react-three/cannon';
import { useControls } from 'leva';
// 
import { getGeometry } from './Example_9';
import CannonUtils from './Utils/cannonUtils.mjs';



// 
export default function Example_21() {

    const gravity = useControls('Gravity', {
        x: { value: 0, min: -10, max: 10, step: 0.1 },
        y: { value: -9.8, min: -10, max: 10, step: 0.1 },
        z: { value: 0, min: -10, max: 10, step: 0.1 }
    })

    return (
        <Canvas shadows camera={{ position: [0, 2, 4] }}>
            <spotLight position={[2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow intensity={Math.PI * 25} />
            <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow intensity={Math.PI * 25} />
            <Physics gravity={[gravity.x, gravity.y, gravity.z]}>
                <Debug>
                    <Plane rotation={[-Math.PI / 2, 0, 0]} />
                    <Box position={[-4, 3, 0]} />
                    <Sphere position={[-2, 3, 0]} />
                    <Cylinder position={[0, 3, 0]} />
                    <Icosahedron position={[2, 3, 0]} />
                    <TorusKnot position={[4, 3, 0]} />
                    <Monkey position={[-2, 20, 0]} />
                </Debug>
            </Physics>
            <OrbitControls target-y={0.5} />
            <Stats />
        </Canvas>
    )
}



// 
useGLTF.preload('/models/suzanne.glb');

function Plane(props: any) {
    const [ref] = usePlane(() => ({ mass: 0, ...props }), useRef<any>());
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[25, 25]} />
            <meshStandardMaterial />
        </mesh>
    )
}

function Box(props: any) {
    const [ref, api] = useBox(() => ({ args: [1, 1, 1], mass: 1, ...props }), useRef<any>());

    return (
        <mesh ref={ref} castShadow onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    )
}

function Sphere(props: any) {
    const [ref, api] = useSphere(() => ({ args: [0.75], mass: 1, ...props }), useRef<any>())

    return (
        <mesh ref={ref} castShadow onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <sphereGeometry args={[0.75]} />
            <meshNormalMaterial />
        </mesh>
    )
}

function Cylinder(props: any) {
    const [ref, api] = useCylinder(() => ({ args: [1, 1, 2, 8], mass: 1, ...props }), useRef<any>());

    return (
        <mesh ref={ref} castShadow onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <cylinderGeometry args={[1, 1, 2, 8]} />
            <meshNormalMaterial />
        </mesh>
    )
}

function Icosahedron(props: any) {
    const geometry = useMemo(() => new IcosahedronGeometry(1, 0), []);
    const args = useMemo(() => CannonUtils.toConvexPolyhedronProps(geometry), [geometry]);
    const [ref, api] = useConvexPolyhedron(
        () => ({ args, mass: 1, ...props }),
        useRef<any>(),
    );

    return (
        <mesh ref={ref} castShadow geometry={geometry} onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <meshNormalMaterial />
        </mesh>
    )
}

function TorusKnot(props: any) {
    const geometry = useMemo<any>(() => new TorusKnotGeometry(), []);
    const [ref, api] = useTrimesh(
        () => ({
            args: [geometry.attributes.position.array, geometry.index.array],
            mass: 1,
            ...props
        }),
        useRef<any>()
    )

    return (
        <mesh ref={ref} castShadow onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <torusKnotGeometry />
            <meshNormalMaterial />
        </mesh>
    )
}

function Monkey(props: any) {
    const { nodes } = useGLTF('/models/suzanne.glb');
    const geometry = getGeometry(nodes.Suzanne);

    const [ref, api] = useTrimesh(
        () => ({
            args: [geometry.attributes.position.array, geometry.index.array],
            mass: 1,
            ...props
        }),
        useRef<any>()
    )
    return (
        <group ref={ref} {...props} dispose={null} onPointerDown={() => api.velocity.set(0, 5, 0)}>
            <mesh castShadow geometry={geometry} material={useMemo(() => new MeshNormalMaterial(), [])} />
        </group>
    )
}
