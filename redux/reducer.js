import { Euler, Vector3, PerspectiveCamera, Quaternion, Matrix4 } from "three";
import * as Matrix from "../assets/matrices";
import { updatePeriod_ms } from "../assets/assets";

export function initReducer() {
    return {
        views: [
            new PerspectiveCamera(67, 1.084, 0.1, 1000),
            new PerspectiveCamera(67, 1.084, 0.1, 1000)
        ]
    }
}

function rad(d) {
    return d*Math.PI/180;
}

function deg(r) {
    return r*180/Math.PI;
}

export function reducer(state, action) {
    switch(action.type) {
        /*
        * Sensors (regardless of orientation): 
        *   x runs short side of screen
        *   y runs long side of screen
        *   z perpendicular to screen
        * Sensors read degrees/s
        */
        case 'gyro': 
            // state.sensorXYZ is rad/s, accumulate until scene is updated
            // transform sensor frame 90 degrees around z-axis: x=-y, y=x, z=z
            let x = -1*rad(action.payload.y);
            let y = rad(action.payload.x);
            let z = rad(action.payload.z);
            
            state.views.forEach((camera) => {
                const cameraFrame = new Matrix4().makeRotationFromEuler(camera.rotation);
                
                const transformed_x_axis = new Vector3();
                const transformed_y_axis = new Vector3();
                const transformed_z_axis = new Vector3();
                cameraFrame.extractBasis(transformed_x_axis, transformed_y_axis, transformed_z_axis);

                const R_x = new Matrix4().makeRotationAxis(transformed_x_axis, x);
                const R_y = new Matrix4().makeRotationAxis(transformed_y_axis, y);
                const R_z = new Matrix4().makeRotationAxis(transformed_z_axis, z);
                
                camera.applyMatrix4(R_z);
                camera.applyMatrix4(R_y);
                camera.applyMatrix4(R_x);
            })
            return state;
        case 'zero':
            return initReducer();
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/