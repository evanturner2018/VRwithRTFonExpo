import { useFrame } from "@react-three/fiber"
import { useContext } from "react";
import { stateContext } from "../redux/context";
import { Color, Vector3 } from "three";
import { theme } from "../assets/assets";

export default function Viewport() {
    const state = useContext(stateContext);

    useFrame(({scene, gl, size})=>{
        let w = size.width;
        let h = size.height;
        gl.setClearColor(new Color(theme.dark));
        
        let pinch = 0;
        state.views.forEach((camera, i) => {
            camera.aspect = w/2/h;
            camera.position.x = state.position[0];
            camera.position.y = state.position[1];
            camera.position.z = state.position[2];
            
            pinch = i*-0.5;
            camera.rotateY(pinch);
            gl.setViewport(i*w/2, 0, w/2, h);
            gl.setScissor(i*w/2, 0, w/2, h);
            gl.setScissorTest(true);

            camera.updateProjectionMatrix();
            gl.render(scene, camera);

            camera.rotateY(-1*pinch);
        })
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