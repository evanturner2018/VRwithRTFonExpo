import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useEffect } from "react";
import { Color, PerspectiveCamera } from "three";
import { initReducer } from "../redux/reducer";
import { stateContext } from "../redux/context";

export default function Viewport() {
    const { scene, gl, size } = useThree();
    const state = useContext(stateContext);

    let w, h;
    useEffect(() => {
        w = size.width;
        h = size.height;
    })
    useFrame(()=>{
        draw(scene, gl, w, h, state);
    });

    return <></>;
}

function rad(deg) {
    return Math.PI*deg/180;
}

function deg(rad) {
    return 180*rad/Math.PI;
}

  // landscape: 2556w x 1011h
  // portrait: 1179w x 2388h
function draw( scene, gl, w, h, state=initReducer() ) {
    const eyeToPhone = 1.5;
    const eyeToEdge = 1;
    const fov = 50//deg(Math.atan(eyeToEdge/eyeToPhone)); // ~100
    let views = [
        new PerspectiveCamera(fov, w/h, 1, 1000),
        new PerspectiveCamera(fov, w/h, 1, 1000)
    ]
    views.push(views[0]); // TODO: figure out why final camera is smaller
    
    views.forEach((camera, i) =>  {
        camera.position.fromArray([0, 0, 10]);
        camera.rotation.fromArray([rad(state.x), rad(state.y), rad(state.z)])
        
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

/*
* FOV
* near: phone screen z - eye z ~= 2"
* at z=0, ~1.5" from middle to edge
* arctan(1.5/2)
* trial-and-error until looking straight up and down works
*/