import { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { Hud, OrthographicCamera, Environment, useGLTF, OrbitControls } from '@react-three/drei';
import { TextureLoader, MathUtils, Material } from 'three';
// 
import { getGeometry } from './Example_9';
import { Loader } from './Example_1';



// 
export default function Example_13() {
    return (<>
        <Canvas shadows camera={{ position: [2.25, 1, 2.25] }}>
            <Suspense fallback={<Loader />}>
                <Environment preset="forest" background
                    ground={{ height: 2, radius: 115, scale: 100 }}
                />
                <directionalLight position={[5, 1.5, 3]}
                    intensity={2} castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-bias={-0.0001}
                />
                <Room />
                <ArmChair />
                <OrbitControls target={[1.5, 0.8, 1.5]}
                    minPolarAngle={0} maxPolarAngle={Math.PI / 2 + Math.PI / 12}
                    enablePan={false} minDistance={0.75} maxDistance={3}
                />
            </Suspense>
        </Canvas>

        <div id="instructions">
            Models from{' '}
            <a href="https://sweethome3d.com" target="_blank" rel="noreferrer">
                Sweet Home 3D
            </a>
            <br />
            Textures from{' '}
            <a href="https://polyhaven.com" target="_blank" rel="noreferrer">
                Poly Haven
            </a>
        </div>
    </>);
}



// 
useGLTF.preload('/models/armchair-transformed.glb');
useGLTF.preload('/models/room-transformed.glb');



// 
function Button({ id, texture, position, roughness, setSelected }: any) {

    const ref = useRef<any>();
    const [hovered, setHovered] = useState(false);

    useFrame((_, delta) => {
        ref.current.scale.y = ref.current.scale.x = ref.current.scale.z =
            MathUtils.lerp(ref.current.scale.y, hovered ? 1.5 : 1, 0.25);
        hovered && ref.current.rotateY(delta * 5);
    })
    return (
        <mesh ref={ref} position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={() => setSelected(id)}
        >
            <sphereGeometry />
            <meshStandardMaterial map={texture} roughness={roughness} envMapIntensity={1.5} />
        </mesh>
    )
}

function MaterialMenu({ setSelected }: any) {

    const texture = useLoader(TextureLoader, [
        '/img/fabric_pattern_05.jpg',
        '/img/leather_red.jpg',
        '/img/fabric_pattern_07.jpg',
        '/img/book_pattern.jpg',
        '/img/denim_fabric_02.jpg',
    ]);

    return (
        <Hud>
            <OrthographicCamera makeDefault position={[0, 0, 2]} zoom={50} />
            <Environment preset="forest" />
            <Button id={0} texture={texture[0]} position={[-6, -4, 0]} setSelected={setSelected} />
            <Button id={1} texture={texture[1]} position={[-3, -4, 0]} roughness={0.2} setSelected={setSelected} />
            <Button id={2} texture={texture[2]} position={[-0, -4, 0]} setSelected={setSelected} />
            <Button id={3} texture={texture[3]} position={[3, -4, 0]} roughness={0.5} setSelected={setSelected} />
            <Button id={4} texture={texture[4]} position={[6, -4, 0]} setSelected={setSelected} />
        </Hud>
    )
}

function ArmChair() {

    const ref = useRef<any>();
    const [selected, setSelected] = useState(0);
    const { nodes, materials } = useGLTF('/models/armchair-transformed.glb');

    const materialOverrides = useMemo<Material[]>(() => {
        return [
            materials.fabric_pattern_05,
            materials.red_leather,
            materials.fabric_pattern_7,
            materials.book_pattern,
            materials.denim_fabric_02,
        ]
    }, [materials]);

    return (
        <>
            <group dispose={null} position={[1.5, 0.299, 1.5]}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <mesh ref={ref} castShadow receiveShadow
                        geometry={getGeometry(nodes.armchair001_1)}
                        material={materialOverrides[selected]}
                    />
                    <mesh castShadow
                        geometry={getGeometry(nodes.armchair001_3)}
                        material={materials.wooden_legs}
                    />
                </group>
            </group>
            <MaterialMenu setSelected={setSelected} />
        </>
    )
}

function Room() {
    const { nodes, materials } = useGLTF('/models/room-transformed.glb');

    return (
        <>
            <group dispose={null} position-y={0.3}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <mesh geometry={getGeometry(nodes.room_1)} material={materials.ground_1} receiveShadow />
                    <mesh geometry={getGeometry(nodes.room_2)} material={materials.wall_1_2} castShadow receiveShadow />
                    <mesh geometry={getGeometry(nodes.room_3)} material={materials.room_5_30} receiveShadow />
                    <mesh geometry={getGeometry(nodes.room_4)} material={materials.white} castShadow receiveShadow />
                    <mesh geometry={getGeometry(nodes.room_5)} material={materials.flltgrey} material-transparent={true} material-opacity={0.1} />
                    <mesh geometry={getGeometry(nodes.room_6)} material={materials.dkgrey} receiveShadow />
                    <mesh geometry={getGeometry(nodes.room_7)} material={materials.amber} castShadow />
                    <mesh geometry={getGeometry(nodes.room_8)} material={materials.yellow_green} castShadow />
                    <mesh geometry={getGeometry(nodes.room_9)} material={materials.flbrown} castShadow />
                </group>
            </group>
        </>
    )
}
