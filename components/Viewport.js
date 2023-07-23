import { useFrame, useThree } from "@react-three/fiber"
import { useEffect } from "react";
import { Color, PerspectiveCamera } from "three";

export default function Viewport() {
    const { scene, gl, size } = useThree();
    
    let w, h;
    useEffect(() => {
        w = size.width;
        h = size.height;
    })
    useFrame(()=>{
        draw(scene, gl, w, h);
    });

    return <></>;
}

  // landscape: 2556w x 1011h
  // portrait: 1179w x 2388h
function draw( scene, gl, w, h ) {
    const scale = 1
    w = w/scale;
    h = h/scale;

    const camera = new PerspectiveCamera(45, w/h, 1, 1000);
    camera.position.fromArray([0, 0, 5]);
    camera.up.fromArray([0, 1, 0]);

    for(let i = 0; i<3; i++) {
        gl.setViewport(i*w/2, 0, w/2, h);
        gl.setScissor(i*w/2, 0, w/2, h);
        gl.setClearColor(new Color().setRGB(0.5, 0.5, 0.7));
        gl.setScissorTest(true);

        camera.aspect = w/h;
        camera.updateProjectionMatrix();

        gl.render(scene, camera);
    }
}