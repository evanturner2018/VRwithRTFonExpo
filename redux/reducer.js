import { Vector3, PerspectiveCamera, Matrix4 } from "three";
import { params } from "../assets/assets";

export function initReducer() {
    return {
        views: [
            new PerspectiveCamera(70, 1.084, 0.1, 1000),
            new PerspectiveCamera(70, 1.084, 0.1, 1000)
        ],
        position: flatCopy(params.cameraStartPosition),
        velocity: [0, 0, 0],
        sensorUpdatePeriod: 1000, // milliseconds
        zeroSensors: true,
        gravity_raw: [-1, 0, 0] // g's, -1 for default landscape
    }
}

function rad(d) {
    return d*Math.PI/180;
}

function flatCopy(x) {
    let res = [];
    x.forEach((item) => {
        res.push(item);
    })
    return res;
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
            x *= state.sensorUpdatePeriod/1000;
            y *= state.sensorUpdatePeriod/1000;
            z *= state.sensorUpdatePeriod/1000;
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
        *   measured in g's (9.81 m/s^2)
        *   accumulate vX/vY/vZ in m/s
        *   update position by them every second (scaled by clock delta)
        */
        case 'accelerometer':
            // zeroing in Sensors.js slowed it down a lot
            const g = state.zeroSensors ? 
                [action.payload.x, action.payload.y, action.payload.z] :
                state.gravity_raw;

            // transform sensor to world frame (from phone frame)
            // landscape
            const a_p = [action.payload.y-g[1], -1*(action.payload.x-g[0]), action.payload.z-g[2]];
            // rotate to world basis
            const R = new Matrix4().makeRotationFromEuler(state.views[0].rotation);
            const a_w = new Vector3().fromArray(a_p).applyMatrix4(R);

            // scale and translate units to m/s
            let v = flatCopy(state.velocity);
            let scale = state.sensorUpdatePeriod/1000/9.81;
            v[0] += (a_w.x)*scale;
            v[1] += (a_w.y)*scale;
            v[2] += (a_w.z)*scale;
            return {...state,
                velocity: v,
                gravity_raw: g,
                zeroSensors: false
            }
        case 'updatePeriod':
            return {...state,
                sensorUpdatePeriod: action.payload
            }
        case 'frame':
            let p = flatCopy(state.position);
            for(let i = 0; i<p.length; i++) {
                p[i] += state.velocity[i];
            }
            return {...state,
                position: p,
                velocity: [0, 0, 0]
            }
        case 'zero':
            return initReducer();
        case 'sensorsZeroed':
            return {...state,
                zeroSensors: false
            }
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/