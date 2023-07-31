import { useFrame } from "@react-three/fiber"
import { useContext } from "react";
import { stateContext, stateDispatchContext } from "../redux/context";
import { Color } from "three";
import { theme, params } from "../assets/assets";

export default function Viewport() {
    const state = useContext(stateContext);
    const dispatch = useContext(stateDispatchContext);

    useFrame(({scene, gl, size})=>{
        let w = size.width;
        let h = size.height;
        gl.setClearColor(new Color(theme.dark));
        
        state.views.forEach((camera, i) => {
            camera.aspect = w/2/h;
            
            // left needs positive rotation, right needs negative
            // y-axis goes up, counter-clockwise is positive
            pinch = (params.eyePinch/2) - (params.eyePinch)*i;
            camera.rotateY(pinch);
            gl.setViewport(i*w/2, 0, w/2, h);
            gl.setScissor(i*w/2, 0, w/2, h);
            gl.setScissorTest(true);

            camera.updateProjectionMatrix();
            gl.render(scene, camera);

            camera.rotateY(-1*pinch);
        });
        dispatch({type: 'frame'});
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