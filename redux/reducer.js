import { Vector3, PerspectiveCamera, Matrix4 } from "three";

export function initReducer() {
    return {
        views: [
            new PerspectiveCamera(70, 1.084, 0.1, 1000),
            new PerspectiveCamera(70, 1.084, 0.1, 1000)
        ],
        position: [0, 2, 0],
        velocity: [0, 0, 0],
        eyeSep: 0.5, // viewOffset?
        eyePinch: 0.5, // radians, 0.5 magic number somehow
    }
}

function rad(d) {
    return d*Math.PI/180;
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
            // landscape:
            // transform sensor frame 90 degrees around z-axis: x=-y, y=x, z=z
            let x = -1*rad(action.payload.y);
            let y = rad(action.payload.x);
            let z = rad(action.payload.z);

            // scale inputs to be rad/update instead of rad/s
            // (rad/1000ms)*(period ms/1 update) = rad/update
            /*
            x *= state.updatePeriod_ms/1000;
            y *= state.updatePeriod_ms/1000;
            z *= state.updatePeriod_ms/1000;
            */
            
            state.views.forEach((camera) => {
                // transform sensor input to the camera frame
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
            });
            return state;
        /*
        *   measured in m/2^s
        *   accumulate vX/vY/vZ in m/s
        *   update position by them every second (scaled by clock delta)
        */
        case 'accelerometer':
            // transform sensor to world frame (from phone frame)
            let a = [action.payload.x, action.payload.y, action.payload.z];
            let v = state.velocity;
            for(let i = 0; i<v.length; i++) {
                v[i] += a[i]*20/1000;
            }
            return {...state,
                velocity: v
            }
        case 'zero':
            return initReducer();
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/