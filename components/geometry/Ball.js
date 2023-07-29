import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function Ball(props) {
    let radius = props.radius ? props.radius : 1;
    let color = props.color ? props.color : "grey";
    const ref = useRef();
    const [dir, setDir] = useState(1);

    useFrame(() => {
        const delta = 0.1/2;
        const far = props.far ? props.far : props.position[2];
        const near = props.near ? props.near : props.position[2];
        if(ref.current.position.z > far) {
            ref.current.position = far;
            setDir(-1);
        }
        if(ref.current.position.z < near) {
            ref.current.position = near;
            setDir(1);
        }

        if(far != near)
            ref.current.position.z += delta*dir;
    });

    return (
        <mesh ref={ref} {...props}>
            <sphereBufferGeometry attach="geometry" args={[radius]} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    )
}