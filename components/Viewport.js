import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useEffect } from "react";
import { Color, PerspectiveCamera, Vector3 } from "three";
import { initReducer } from "../redux/reducer";
import { stateContext } from "../redux/context";
import { theme } from "../settings/assets";

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
    }, 1); // the 1 takes over rendering to make it manual

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
    const eyeToPhone = 3;
    const eyeToEdge = 2;
    const fov = 67// deg(Math.atan(eyeToEdge/eyeToPhone)); // ~67
    let views = [
        new PerspectiveCamera(fov, w/2/h, 0.1, 1000),
        new PerspectiveCamera(fov, w/2/h, 0.1, 1000)
    ]
    
    let pinchAngle = 0 // TODO: refactor into reducer
    views.forEach((camera, i) =>  {
        let pinch = pinchAngle-i*2*pinchAngle;
        camera.position.fromArray([0, 0, 2]);
        camera.rotation.fromArray([rad(state.x), rad(state.y+pinch), rad(state.z)]);
        
        gl.setViewport(i*w/2, 0, w/2, h);
        gl.setScissor(i*w/2, 0, w/2, h);
        gl.setClearColor(new Color(theme.dark));
        gl.setScissorTest(true);

        camera.updateProjectionMatrix();

        gl.render(scene, camera);
    });
}

/*
* FOV
* near: phone screen z - eye z ~= 2"
* at z=0, ~1.5" from middle to edge
* arctan(1.5/2)
* arctan(3/2)*2 = 67.4 deg
* trial-and-error until looking straight up and down works
*/