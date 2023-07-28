import { Euler, Vector3, PerspectiveCamera } from "three";
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
            state.views.forEach((camera) => {
                camera.rotation.x += -1*rad(action.payload.y);
                camera.rotation.y += rad(action.payload.x);
                camera.rotation.z += rad(action.payload.z);
            })
            return state;
        case 'zero':
            return initReducer();
    }
}

function updateViews(state) {
    state.views.forEach((camera) => {
        camera.rotation.x += state.sensorX;
        camera.rotation.y += state.sensorY;
        camera.rotation.z += state.sensorZ;
    });
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer

// Euler to Axis-Angle:
// https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/