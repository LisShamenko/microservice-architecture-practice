import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame, Vector3 } from '@react-three/fiber';
import * as THREE from 'three';



// 
export default function Part_1() {

    // Внутри `JSX` теги в нижнем регистре рассматриваются как элементы HTML. 
    // Если такой тег является потомком `React Three Fiber`, то он будет 
    // рассматриваться как объект `Three.JS`.

    // Изменение `ref` не приводит к повторному рендерингу компонента.

    // Поскольку `useEffect` асинхронный, обратный вызов выполняется после того, 
    // как базовые пиксели `WebGL` будут отрисованы на `Canvas`. Если использовать 
    // `frameloop="demand"`, то можно увидеть как объект визуализируется перед 
    // изменением его положения, а затем холст рендерится еще раз. Этого можно
    // избежать, если вместо `useEffect` использовать `useLayoutEffect`, который 
    // вызывается синхронно, прежде чем браузер сможет выполнить отрисовку.
    // Но `useLayoutEffect` может снизить производительность, поэтому следует 
    // отдавать предпочтение `useEffect`.

    //      <Canvas camera={{ position: [0, 0, 2] }} frameloop="demand">
    return (
        <Canvas camera={{ position: [0, 0, 2] }}>
            <Box position={[-0.75, 0, 0]} name="A" />
            <Box position={[0.75, 0, 0]} name="B" />
        </Canvas>
    )
}



// 
interface IBoxProps {
    position?: Vector3,
    name?: string,
}

function Box(props: IBoxProps) {

    // useRef
    const ref = useRef<any>(null);

    useEffect(() => {
        console.log('--- (ref.current === undefined) --- ref = ', ref);
        console.log('--- uuid = ', ref.current?.geometry.uuid);
    })

    useEffect(() => { // useLayoutEffect(() => { // 
        if (ref.current.name === 'B') {
            ref.current.position.y = 1;
        }
    })

    // dependency array
    const [v, setV] = useState();
    useEffect(() => {
        console.log('executed whenever v changes');
    }, [v])

    // clean up
    useEffect(() => {
        const onDocumentKey = (e: any) => {
            console.log(e.code);
        }
        document.addEventListener('keydown', onDocumentKey);
        return () => {
            document.removeEventListener('keydown', onDocumentKey);
        }
    }, [])

    // useFrame
    useFrame((_, delta) => {
        if (rotate) {
            ref.current.rotation.x += 1 * delta; // ref.current.rotateX(1 * delta); // 
            ref.current.rotation.y += 0.5 * delta; // ref.current.rotateY(0.5 * delta); // 
        }
    })

    // events
    const [hovered, setHover] = useState(false);
    const [rotate, setRotate] = useState(false);

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        // позволяет избежать срабатывания события для объекта `mesh`
        // находящегося позади первого `mesh` (останавливает событие)
        e.stopPropagation();
        setRotate(!rotate);
        setCount((count + 1) % 2);
        console.log('--- on_Pointer_Down --- ' + e.eventObject.name);
    }
    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        console.log('--- on_Pointer_Up --- ' + e.eventObject.name);
    }
    const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
        setHover(true);
        console.log('--- on_Pointer_Over --- ' + e.eventObject.name);
    }
    const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
        setHover(false);
        console.log('--- on_Pointer_Out --- ' + e.eventObject.name);
    }
    const onUpdate = (self: any) => {
        console.log('--- on_Update --- ', self);
    }

    // useMemo
    const [count, setCount] = useState(0);
    const geometry = useMemo(
        // без использования useMemo объекты BoxGeometry и SphereGeometry
        // будут создаваться заново при каждом рендеринге (uuid меняется)
        () => [new THREE.BoxGeometry(), new THREE.SphereGeometry(0.785398)],
        []
    )

    return (
        <mesh {...props} ref={ref}
            scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onUpdate={onUpdate}
            geometry={geometry[count]}
        >
            <meshBasicMaterial
                color={hovered ? 0xff0000 : 0x00ff00}
                wireframe
            />
        </mesh>
    )
}

function BasicMaterialBox() {
    return (
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color={0x00ff00} wireframe />
        </mesh>
    )
}
