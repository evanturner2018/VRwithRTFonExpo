import { useFrame, useThree } from "@react-three/fiber"
import { useEffect } from "react";
import { Color, PerspectiveCamera } from "three";
import { initReducer } from "../redux/reducer";

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
function draw( scene, gl, w, h, state=initReducer() ) {

    let views = [
        new PerspectiveCamera(45, w/h, 1, 1000),
        new PerspectiveCamera(45, w/h, 1, 1000),
    ];
    views.push(views[0]); // TODO: figure out why final camera is smaller

    views.forEach((camera, i) =>  {
        camera.position.fromArray([0, 0, 5]);
        camera.rotateX = state.x;
        camera.rotateY = state.y;
        camera.rotateZ = state.z;
        
        gl.setViewport(i*w/2, 0, w/2, h);
        gl.setScissor(i*w/2, 0, w/2, h);
        gl.setClearColor(new Color().setRGB(0.5, 0.5, 0.7));
        gl.setScissorTest(true);

        camera.updateProjectionMatrix();

        gl.render(scene, camera);
    });
}

/*
the final render is smaller than all before it
could be:
* <Canvas /> taking control of camera and messing up Viewport/Scissor
could solve:
* set Viewport to not render in the regular loop
* make two cameras and attach them to the render loop
* make camera/viewport/scissor a <> component
*/