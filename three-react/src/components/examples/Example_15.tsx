import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Vector2, Vector3, MathUtils } from 'three';
import { Stats, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Selection, Select, EffectComposer, Outline } from '@react-three/postprocessing';
import { create } from 'zustand';
// 
import { getGeometry, getMaterial } from './Example_9';



// 
export default function Example_15() {

    // [zustand](https://www.npmjs.com/package/zustand)
    // [@react-three/postprocessing](https://www.npmjs.com/package/@react-three/postprocessing)

    return (<>
        <Canvas>
            <Teleport />
            <Environment files="/img/rustig_koppie_puresky_1k.hdr" background />
            <Scene />
            <Stats />
        </Canvas>
        <div id="instructions">
            Click the floor to slide to the circle.
            <br />
            Click a model to orbit around it.
        </div>
    </>)
}



// 
interface ICustomStore {
    to: Vector3,
    orbitmode: boolean,
    setOrbitmode: (v: any) => void,
    autoRotate: boolean,
    setAutoRotate: (v: any) => void,
}

const useStore = create<ICustomStore>((set) => ({
    to: new Vector3(0, 1, 10),
    orbitmode: false,
    setOrbitmode: (v: any) => set({ orbitmode: v }),
    autoRotate: false,
    setAutoRotate: (v: any) => set({ autoRotate: v })
}));



// 
function Teleport() {

    const pivotY = useRef<any>();
    const pivotX = useRef<any>();
    const offset = useRef<any>();
    const circleRef = useRef<any>();
    const circleEffectRef = useRef<any>();
    const date = useRef<number>(0);

    const dragVector = useMemo(() => new Vector2(), []);
    const { orbitmode, setOrbitmode, autoRotate, setAutoRotate, to } = useStore((state) => state);

    useEffect(() => {

        const onPointerMove = (e: any) => {
            dragVector.set(e.movementX, e.movementY);

            if (e.buttons) {
                if (orbitmode) {
                    setAutoRotate(false);
                    pivotX.current.rotation.x -= e.movementY / 1000;
                    pivotY.current.rotation.y -= ((dragVector.x / 5) * Math.PI) / 180;
                }
                else {
                    pivotX.current.rotation.x += ((dragVector.y / 10) * Math.PI) / 180;
                    pivotY.current.rotation.y += ((dragVector.x / 10) * Math.PI) / 180;
                }
            }
        }

        document.addEventListener('pointermove', onPointerMove);
        return () => {
            document.removeEventListener('pointermove', onPointerMove);
        }
    })

    useFrame((_, delta) => {
        if (orbitmode) {
            offset.current.position.z = MathUtils.lerp(
                offset.current.position.z, 4, delta * 2
            );
            autoRotate && (pivotY.current.rotation.y += delta / 2);
        }
        else {
            offset.current.position.z = MathUtils.lerp(
                offset.current.position.z, 0, delta * 2
            );
        }

        pivotY.current.position.lerp(to, delta * 2);
        circleEffectRef.current.material.opacity > 0.02
            ? (circleEffectRef.current.material.opacity -= delta * 0.5)
            : (circleEffectRef.current.visible = false);
    })

    // 
    const onPointerMove = ({ point }: any) => {
        circleRef.current.position.z = point.z;
        circleRef.current.position.x = point.x;
    }

    const onPointerDown = () => {
        date.current = Date.now();
    }

    const onPointerUp = ({ point }: any) => {
        if (Date.now() - date.current < 200) {
            // a quick click
            setOrbitmode(false);
            to.set(point.x, 1, point.z);
            circleEffectRef.current.position.copy(circleRef.current.position);
            circleEffectRef.current.material.opacity = 0.99;
            circleEffectRef.current.visible = true;
        }
    }

    return (<>
        <group ref={pivotY}>
            <group ref={pivotX}>
                <group ref={offset}>
                    <PerspectiveCamera makeDefault />
                </group>
            </group>
        </group>

        <mesh visible={false} rotation-x={-Math.PI / 2} position={[0, 0, 0]}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            <planeGeometry args={[19.4, 19.4]} />
        </mesh>

        <mesh ref={circleRef} rotation-x={-Math.PI / 2} position-y={0.011}>
            <ringGeometry args={[0.3, 0.4]} />
            <meshBasicMaterial color={0x000000} transparent opacity={0.25} />
        </mesh>

        <mesh ref={circleEffectRef} rotation-x={-Math.PI / 2} position-y={0.01}>
            <ringGeometry args={[0, 0.3]} />
            <meshBasicMaterial color={0x000000} transparent />
        </mesh>
    </>)
}



// 
interface ISelectable {
    geometry: any,
    material: any,
    position: number[],
}

function Selectable({ geometry, material, position }: ISelectable) {

    const [hovered, setHover] = useState<boolean>(false);
    const { setOrbitmode, setAutoRotate, to } = useStore((state) => state);

    // 
    const onPointerOver = (e: any) => {
        e.stopPropagation();
        setHover(true);
    }

    const onPointerOut = () => {
        setHover(false);
    }

    const onClick = (e: any) => {
        e.stopPropagation();
        to.set(position[0], position[1], position[2]);
        setOrbitmode(true);
        setTimeout(() => setAutoRotate(true), 1000);
    }

    const pos = new Vector3(position[0], position[1], position[2]);

    return (
        <Select enabled={hovered}>
            <mesh
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
                geometry={geometry}
                material={material}
                position={pos}
            />
        </Select>
    )
}



// 
useGLTF.preload('/models/teleport-scene-transformed.glb');

function Scene() {

    const { nodes, materials } = useGLTF(
        '/models/teleport-scene-transformed.glb'
    );

    return (
        <group dispose={null}>
            <mesh
                scale={[10, 1, 10]}
                geometry={getGeometry(nodes.Plane)}
                material={getMaterial(nodes.Plane)}
            />
            <Selection>
                <EffectComposer multisampling={8} autoClear={false}>
                    <Outline blur visibleEdgeColor={0xffffff} edgeStrength={100} width={1000} />
                </EffectComposer>
                <Selectable geometry={getGeometry(nodes.Cube)} material={materials.Material} position={[8, 1, 8]} />
                <Selectable geometry={getGeometry(nodes.Cylinder)} material={getMaterial(nodes.Cylinder)} position={[8, 1, -8]} />
                <Selectable geometry={getGeometry(nodes.Icosphere)} material={getMaterial(nodes.Icosphere)} position={[-8, 1, -8]} />
                <Selectable geometry={getGeometry(nodes.Cone)} material={getMaterial(nodes.Cone)} position={[-8, 1, 8]} />
                <Selectable geometry={getGeometry(nodes.Suzanne)} material={getMaterial(nodes.Suzanne)} position={[0, 1, 0]} />
            </Selection>
        </group>
    )
}
