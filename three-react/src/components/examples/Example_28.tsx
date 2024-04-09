import { useRef, useEffect } from 'react';
import { Stats, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useCompoundBody, usePlane, useBox, useSphere, useContactMaterial } from '@react-three/cannon';



// 
export default function Example_28() {
    return (
        <>
            <Canvas shadows camera={{ position: [1.2, 6.5, 3.5] }}>
                <spotLight position={[2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow intensity={Math.PI * 25} />
                <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 4} penumbra={0.5} castShadow intensity={Math.PI * 25} />
                <Game />
                <OrbitControls target={[1.2, 0, -2]} />
                <Stats />
            </Canvas>
            <div id="instructions">
                <kbd>←</kbd> <kbd>→</kbd> for Flippers
                <br />
                <kbd>Space</kbd> to launch
            </div>
        </>
    )
}



// 
function useKeyboard() {
    const keyMap = useRef<any>({});

    useEffect(() => {

        const onDocumentKey = (e: any) => {
            keyMap.current[e.code] = (e.type === 'keydown');
        }

        document.addEventListener('keydown', onDocumentKey);
        document.addEventListener('keyup', onDocumentKey);
        return () => {
            document.removeEventListener('keydown', onDocumentKey);
            document.removeEventListener('keyup', onDocumentKey);
        }
    }, [])

    return keyMap.current;
}

function lerp(from: any, to: any, speed: any) {
    const r = (1 - speed) * from + speed * to;
    return Math.abs(from - to) < 0.001 ? to : r;
}

function Plane(props: any) {

    const [ref] = usePlane(
        () => ({ mass: 0, material: 'object', ...props }),
        useRef<any>()
    );

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[25, 25]} />
            <meshStandardMaterial />
        </mesh>
    )
}

function FlipperLeft({ position, keyboard }: any) {

    const cylinderArgs = [0.25, 0.25, 1];
    const boxArgs = [2, 0.5, 0.25];
    const [ref, { rotation }] = useCompoundBody(
        () => ({
            mass: 0,
            position,
            shapes: [
                { args: cylinderArgs, type: 'Cylinder' },
                { args: boxArgs, position: [1, 0, 0], type: 'Box' }
            ]
        }),
        useRef<any>()
    )

    const targetRotation = useRef<any>();

    useEffect(() => {
        const unsubscribe = rotation.subscribe((v) => {
            rotation.set(v[0], lerp(v[1], targetRotation.current, 0.8), v[2]);
        })
        return unsubscribe;
    }, [])

    useFrame(() => {
        keyboard['ArrowLeft']
            ? (targetRotation.current = 0.2)
            : (targetRotation.current = -0.2);
    })

    return (
        <mesh ref={ref} castShadow>
            {/* @ts-ignore */}
            <cylinderGeometry args={cylinderArgs} />
            <meshNormalMaterial />
            <mesh position={[1, 0, 0]} castShadow>
                {/* @ts-ignore */}
                <boxGeometry args={boxArgs} />
                <meshNormalMaterial />
            </mesh>
        </mesh>
    )
}

function FlipperRight({ position, keyboard }: any) {

    const cylinderArgs = [0.25, 0.25, 1];
    const boxArgs = [2, 0.5, 0.25];
    const [ref, { rotation }] = useCompoundBody(
        () => ({
            mass: 0,
            position,
            shapes: [
                { args: cylinderArgs, type: 'Cylinder' },
                { args: boxArgs, position: [-1, 0, 0], type: 'Box' }
            ]
        }),
        useRef<any>()
    )

    const targetRotation = useRef<any>();

    useEffect(() => {
        const unsubscribe = rotation.subscribe((v) => {
            rotation.set(v[0], lerp(v[1], targetRotation.current, 0.8), v[2]);
        })
        return unsubscribe;
    }, [])

    useFrame(() => {
        keyboard['ArrowRight']
            ? (targetRotation.current = -0.2)
            : (targetRotation.current = 0.2);
    })

    return (
        <mesh ref={ref} position={position} castShadow>
            {/* @ts-ignore */}
            <cylinderGeometry args={cylinderArgs} />
            <meshNormalMaterial />
            <mesh position={[-1, 0, 0]} castShadow>
                {/* @ts-ignore */}
                <boxGeometry args={boxArgs} />
                <meshNormalMaterial />
            </mesh>
        </mesh>
    )
}

function Spring({ position, keyboard }: any) {

    const boxArgs = [1.4, 1, 0.3];
    const cylinderArgs = [0.1, 0.1, 2];
    const [ref, api] = useCompoundBody(
        () => ({
            mass: 0,
            position,
            shapes: [
                { args: boxArgs, type: 'Box', material: 'object' },
                {
                    args: cylinderArgs,
                    position: [0, 0, 1],
                    rotation: [-Math.PI / 2, 0, 0],
                    type: 'Cylinder'
                }
            ]
        }),
        useRef<any>()
    )

    const targetPosition = useRef<any>();
    const speed = useRef<any>();

    useEffect(() => {
        const unsubscribe = api.position.subscribe((v) => {
            api.position.set(v[0], v[1], lerp(v[2], targetPosition.current, speed.current));
        })
        return unsubscribe;
    }, [])

    useFrame((_, delta) => {
        if (keyboard['Space']) {
            targetPosition.current = 3;
            speed.current = delta * 5;
        }
        else {
            targetPosition.current = 1;
            speed.current = delta * 10;
        }
    })

    return (
        <mesh ref={ref} position={position} castShadow>
            {/* @ts-ignore */}
            <boxGeometry args={boxArgs} />
            <meshNormalMaterial />
            <mesh position={[0, 0, 1]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
                {/* @ts-ignore */}
                <cylinderGeometry args={cylinderArgs} />
                <meshNormalMaterial />
            </mesh>
        </mesh>
    )
}

function Controllers() {
    const keyboard = useKeyboard();

    return (
        <>
            {/* <Debug> */}
            <FlipperLeft position={[-2.5, 0.5, 2]} rotation={[0.1, 0, 0]} keyboard={keyboard} />
            <FlipperRight position={[2.5, 0.5, 2]} keyboard={keyboard} />
            <Spring position={[5.04, 0.5, 0]} keyboard={keyboard} />
            {/* </Debug> */}
        </>
    )
}

function Ball(props: any) {

    useContactMaterial('object', 'slippery', {
        friction: 0,
        restitution: 0.5,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 1
    })

    const [ref, { position, velocity, angularVelocity }] = useSphere<any>(() => ({
        args: [0.5],
        mass: 1,
        material: 'slippery',
        onCollide: (c) => {
            if (c.body.name === 'bumber') {
                const cn = c.contact.contactNormal;
                velocity.set(cn[0] * 10, cn[1] * 10, cn[2] * 10);
            }
        },
        ...props
    }))

    useEffect(() => {
        const unsubscribe = position.subscribe((v) => {
            if (v[2] > 6) {
                velocity.set(0, 0, 0);
                angularVelocity.set(0, 0, 0);
                position.set(5.04, 2, -1);
            }
        })
        return unsubscribe;
    }, [position, velocity])

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial />
        </mesh>
    )
}

function Wall({ args, ...props }: any) {

    const [ref] = useBox<any>(() => ({ args, mass: 0, material: 'object', ...props }))

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={args} />
            <meshNormalMaterial />
        </mesh>
    )
}

function Bumber(props: any) {

    const targetScale = useRef<any>(1);

    const [ref] = useSphere<any>(() => ({
        args: [0.5],
        mass: 0,
        onCollide: () => {
            targetScale.current = 1.2;
        },
        ...props
    }))

    useFrame((_, delta) => {
        ref.current.scale.x = ref.current.scale.z = targetScale.current;
        targetScale.current = lerp(targetScale.current, 1, delta * 10);
    })

    return (
        <mesh ref={ref} name={'bumber'} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.25]} />
            <meshNormalMaterial />
        </mesh>
    )
}

function SlidingBox({ args, ...props }: any) {

    const [ref, { position }] = useBox(
        () => ({ args, mass: 0, material: 'object', ...props }),
        useRef<any>()
    )

    const targetPosition = useRef<any>(0);
    const direction = useRef<any>(1);

    useEffect(() => {
        const unsubscribe = position.subscribe((v) => {
            position.set(lerp(v[0], targetPosition.current, 0.1), v[1], v[2]);
        })
        return unsubscribe;
    }, [])

    useFrame((_, delta) => {
        targetPosition.current += direction.current * delta;
        if (targetPosition.current > 2) direction.current = -1;
        if (targetPosition.current < -2) direction.current = 1;
    })

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={args} />
            <meshNormalMaterial />
        </mesh>
    )
}

function Game() {
    return (
        <Physics gravity={[0, -9.8, 3]}>
            <Plane rotation={[-Math.PI / 2, 0, 0]} />
            <Wall args={[0.25, 1, 4]} position={[-3.4, 0.5, -0.1]} rotation={[0, Math.PI / 8, 0]} />
            <Wall args={[0.25, 1, 4]} position={[3.4, 0.5, -0.1]} rotation={[0, -Math.PI / 8, 0]} />
            <Wall args={[0.25, 1, 8]} position={[-4.17, 0.5, -6]} />
            <Wall args={[0.25, 1, 11]} position={[4.17, 0.5, -2.5]} />
            <Wall args={[0.25, 1, 12]} position={[5.9, 0.5, -3]} />
            <Wall args={[0.25, 1, 4]} position={[-2.4, 0.5, -11.1]} rotation={[0, -Math.PI / 3, 0]} />
            <Wall args={[0.25, 1, 6]} position={[3.25, 0.5, -10.6]} rotation={[0, Math.PI / 3, 0]} />
            <Wall args={[0.25, 1, 1.2]} position={[0, 0.5, -12.1]} rotation={[0, Math.PI / 2, 0]} />
            <Bumber position={[-2, 0.5, -4]} />
            <Bumber position={[2, 0.5, -4]} />
            <SlidingBox args={[1, 0.5, 0.1]} position={[0, 0.5, -1]} />
            <Controllers />
            <Ball position={[5.04, 2, -1]} />
        </Physics>
    )
}
