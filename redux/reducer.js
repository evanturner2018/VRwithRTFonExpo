import { Vector3, PerspectiveCamera, Matrix4, Euler, Quaternion } from "three";
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
        case 'data': 
            // Rotation ////////////////////////////////////////////////
            // DeviceMotion might recognize the landscape orientation
            // but the negative rotation on the x axis doesn't make sense
            let x = -1*rad(action.payload.rotationRate.beta)/(state.sensorUpdatePeriod/1000);
            let y = rad(action.payload.rotationRate.gamma)/(state.sensorUpdatePeriod/1000);
            let z = rad(action.payload.rotationRate.alpha)/(state.sensorUpdatePeriod/1000);
            
            const transformed_x_axis = new Vector3();
            const transformed_y_axis = new Vector3();
            const transformed_z_axis = new Vector3();
            let rotation = new Euler();
            let oldUp = new Vector3();
            let newUp = new Vector3();
            state.views.forEach((camera) => {
                oldUp = camera.up;
                // transform sensor input to the camera frame
                const cameraFrame = new Matrix4().makeRotationFromEuler(camera.rotation);
                
                cameraFrame.extractBasis(transformed_x_axis, transformed_y_axis, transformed_z_axis);

                const R_x = new Matrix4().makeRotationAxis(transformed_x_axis, x);
                const R_y = new Matrix4().makeRotationAxis(transformed_y_axis, y);
                const R_z = new Matrix4().makeRotationAxis(transformed_z_axis, z);
                
                camera.applyMatrix4(R_z);
                camera.applyMatrix4(R_y);
                camera.applyMatrix4(R_x);
                cameraFrame.makeRotationFromEuler(camera.rotation);
                rotation = camera.rotation;
                newUp = camera.up;
            });


            // Acceleration /////////////////////////////////////////////
            // calculate centripetal acceleration
            const r = 0.1; // guess
            const a_c_direction = [-r/2, -r/2, 0]; // guess
            const omega = oldUp.angleTo(newUp) / (state.sensorUpdatePeriod/1000);
            const a_c_magnitude = Math.pow(omega, 2) * r;
            let dirVec = new Vector3().fromArray(a_c_direction).normalize();
            dirVec.multiplyScalar(a_c_magnitude);
            
            // transform to three world frame
            const a = [
                action.payload.acceleration.x - dirVec.x, 
                action.payload.acceleration.y - dirVec.y, 
                action.payload.acceleration.z - dirVec.z
            ];

            const R = new Matrix4().makeRotationFromEuler(rotation);
            const transformed_a = new Vector3().fromArray(a).applyMatrix4(R);
            
            // scale by sensor period
            transformed_a.divideScalar(state.sensorUpdatePeriod/1000);
        return {...state,
            velocity: [
                state.velocity[0] + transformed_a.x,
                state.velocity[1] + transformed_a.y,
                state.velocity[2] + transformed_a.z
            ]
        };
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
                velocity: [0, 0, 0],
            }
        case 'zero':
            return initReducer();
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/