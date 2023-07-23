import { useThree } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect } from "react";

export default function Eye(props) {
    const { gl } = useThree();
    // left, bottom, width, height
    // unrenders boxes for some reason???
    gl.setViewport(props.left, 0, props.w/2, props.h); 
    gl.setScissor(props.left, 0, props.w/2, props.h);

    useEffect(()=>{
        props.setData(props.w)
    }, [])

    return (<PerspectiveCamera
        position={[0, 0, 5]}
        aspect = {props.w/props.h}
        rotation={[0, 0, 0]}
    />);
}

// scissor: rectangle limiting draw area on canvas
// landscape: 2556w x 1011h
// portrait: 1179w x 2388h
