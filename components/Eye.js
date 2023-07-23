import { useThree } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei";

export default function Eye(props) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { gl } = useThree();
    // left, bottom, width, height
    // unrenders boxes for some reason???
    //gl.setViewport(props.left, 0, w/2, h); 
    gl.setScissor(props.left, 0, w/2, h);

    return (<PerspectiveCamera
        position={[0, 0, 5]}
        aspect = {w/h}
        rotation={[0, 0, 0]}
    />);
}