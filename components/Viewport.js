import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useEffect, useState } from "react";
import { Color, PerspectiveCamera, Vector3 } from "three";
import { initReducer } from "../redux/reducer";
import { stateContext, stateDispatchContext } from "../redux/context";
import { theme } from "../assets/assets";

export default function Viewport() {
    const state = useContext(stateContext);
    const dispatch = useContext(stateDispatchContext);
    let scale = 1;
    useFrame(({scene, gl, size}, delta)=>{
        let w = size.width;
        let h = size.height;
    
        // pinch by rotating along camera.up axis
        let pinchAngle = 0;
        state.views.forEach((camera, i) =>  {
            camera.aspect = w/2/h;

            scale = delta*100;
            camera.rotation.x += state.sensorX*scale;
            camera.rotation.y += state.sensorY*scale;
            camera.rotation.z += state.sensorZ*scale;
    
            gl.setViewport(i*w/2, 0, w/2, h);
            gl.setScissor(i*w/2, 0, w/2, h);
            gl.setClearColor(new Color(theme.dark));
            gl.setScissorTest(true);
    
            camera.updateProjectionMatrix();
    
            gl.render(scene, camera);
        });
        dispatch({
            type: 'cameraUpdate'
        });
    }, 1); // the 1 takes over rendering to make it manual

    return <></>;
}

function draw(scene, gl, w, h, state, dispatch) {
    const eyeToPhone = 3;
    const eyeToEdge = 2;
    const fov = 67// deg(Math.atan(eyeToEdge/eyeToPhone)); // ~67

    // pinch by rotating along camera.up axis
    let pinchAngle = 0;
    let views = [
        new PerspectiveCamera(fov, w/2/h, 0.1, 1000),
        new PerspectiveCamera(fov, w/2/h, 0.1, 1000)
    ];
    views.forEach((camera, i) =>  {
        camera.position.fromArray([0, 0, 0]);
        camera.rotation.x += state.sensorX;
        camera.rotation.y += state.sensorY;
        camera.rotation.z += state.sensorZ;

        gl.setViewport(i*w/2, 0, w/2, h);
        gl.setScissor(i*w/2, 0, w/2, h);
        gl.setClearColor(new Color(theme.dark));
        gl.setScissorTest(true);

        camera.updateProjectionMatrix();

        gl.render(scene, camera);
    });
    dispatch({
        type: 'cameraUpdate'
    });
}

function rad(deg) {
    return Math.PI*(deg%360)/180;
}

function deg(rad) {
    return 180*rad/Math.PI;
}

/*
* FOV
* near: phone screen z - eye z ~= 2"
* at z=0, ~1.5" from middle to edge
* arctan(1.5/2)
* arctan(3/2)*2 = 67.4 deg
* trial-and-error until looking straight up and down works
*/