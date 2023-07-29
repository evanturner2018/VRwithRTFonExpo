import { useFrame } from "@react-three/fiber"
import { useContext, useState } from "react";
import { stateContext } from "../redux/context";
import { PerspectiveCamera, Color } from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect";
import { theme } from "../assets/assets";

export default function Viewport() {
    const state = useContext(stateContext);

    useFrame(({scene, gl, size})=>{
        let w = size.width;
        let h = size.height;
        gl.setClearColor(new Color(theme.dark));
        
        let camera = state.views[0];
        camera.aspect = w/h;
        camera.fov = 70;
        const stereo = new StereoEffect(gl);
        stereo.setEyeSeparation(1)

        camera.updateProjectionMatrix();
        stereo.render(scene, camera);
        
    }, 1); // the 1 takes over rendering to make it manual

    return <></>;
}

/*
* FOV
* near: phone screen z - eye z ~= 2"
* at z=0, ~1.5" from middle to edge
* arctan(1.5/2)
* arctan(3/2)*2 = 67.4 deg
* trial-and-error until looking straight up and down works
*/