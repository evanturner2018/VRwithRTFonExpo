import { Euler, Vector3, PerspectiveCamera } from "three";
import * as Matrix from "../assets/matrices";
import { updatePeriod_ms } from "../assets/assets";

export function initReducer() {
    return {
        sensorX: 0,
        sensorY: 0,
        sensorZ: 0,
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
            // angles of rotation around each axis (THREE world frame)
            // state.sensorXYZ is rad/s, accumulate until scene is updated
            // TODO: transform sensor frame 90 degrees around z-axis
            return { ...state,
                sensorX: state.sensorX + -1*rad(action.payload.y),
                sensorY: state.sensorY + rad(action.payload.x),
                sensorZ: state.sensorZ + rad(action.payload.z)
            };
        case 'cameraUpdate':
            return {...state,
                sensorX: 0,
                sensorY: 0,
                sensorZ: 0
            };
        case 'zero':
            return initReducer();
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/