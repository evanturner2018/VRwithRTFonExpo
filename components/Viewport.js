import { useFrame, useThree } from "@react-three/fiber"
import { useContext, useEffect, useState } from "react";
import { Color, PerspectiveCamera, Vector3 } from "three";
import { stateContext, stateDispatchContext } from "../redux/context";
import { theme } from "../assets/assets";

export default function Viewport() {
    const state = useContext(stateContext);
    
    useFrame(({scene, gl, size}, delta)=>{
        let w = size.width;
        let h = size.height;
    
        // pinch by rotating along camera.up axis
        let pinchAngle = 0;
        state.views.forEach((camera, i) =>  {
            camera.aspect = w/2/h;
    
            gl.setViewport(i*w/2, 0, w/2, h);
            gl.setScissor(i*w/2, 0, w/2, h);
            gl.setClearColor(new Color(theme.dark));
            gl.setScissorTest(true);
    
            camera.updateProjectionMatrix();
    
            gl.render(scene, camera);
        });
    }, 1); // the 1 takes over rendering to make it manual

    return <></>;
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