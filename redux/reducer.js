import { Matrix3, Matrix4, Vector3 } from "three";

export function initReducer() {
    return {
        x: 0,
        y: 0,
        z: 0,
    }
}

function rad(deg) {
    return deg*Math.PI/180;
}

function deg(rad) {
    return rad*180/Math.PI;
}

export function reducer(state, action) {
    switch(action.type) {
        /*
        * Sensors (regardless of orientation): 
        *   x runs short side of screen
        *   y runs long side of screen
        *   z perpendicular to screen
        * In THREE:
        *   x runs left->right
        *   y runs bottom->top
        *   z perpendicular
        * Sensors read radians
        * state stores degrees
        */
        case 'gyro': 
            //let t = updateGyro({x: state.x, y: state.y, z: state.z}, action.payload);
            let view = [rad(action.payload.x), rad(action.payload.y), rad(action.payload.z)];
            let rad = 90*Math.PI/180;
            let R = [[1, 0,             0,                0],
                [0, Math.cos(rad), -1*Math.sin(rad), 0],
                [0, Math.sin(rad), Math.cos(rad),    0],
                [0, 0,             0,                1]];
            let X = matMult(R, view);
            return { ...state,
                x: state.x + deg(X[0]),
                y: state.y + deg(X[1]),
                z: state.z + deg(X[2])
            };
        case 'zero':
            return initReducer();
    }
}

// state.x/y/z: degrees
// sensor: degrees/second
// Math trig: radians
function updateGyro(state, sensor) {
    let turnScale = 10;

    // going landscape: rotates sensor around z 90 deg
    // un-turn the sensors so they're in the same world as the camera
    let dView = new Vector3(rad(sensor.x), rad(sensor.y), rad(sensor.z));
    dView.multiplyScalar(turnScale);
    let dViewLen = dView.length();
    dView = yaw(dView, rad(-90));
    /*
    * Represent sensor's turn as vector dView
    * Rotate sensor to current view's frame
    * Use dView to update rotation
    */
    //dView = rotate(dView, rad(state.x), rad(state.y), rad(state.z));
    dView.multiplyScalar(dViewLen*180/Math.PI); // convert to degrees
    return dView.toArray();
}

function matMult(mat, vec) {
    let res = [];
    let i = 0;
    let j = 0;
    mat.forEach((row) => {
        res.push(0);
        j = 0;
        vec.forEach((col) => {
            res[i] += row[j]*col;
            j++;
        });
        i++;
    });

    return res;
}

function rotate(vector, x, y, z) {
    if(!vector.isVector3) vector = new Vector3(vector.x, vector.y, vector.z);

    /*
    *   Roll: rotation around y-axis
    *   Pitch: rotation around x-axis
    *   Yaw: rotation around z-axis
    */
    // rotation matrix around x-axis
    let pitch = new Matrix4(1,              0,              0,              0,
                            0,              Math.cos(x),    -1*Math.sin(x), 0,
                            0,              Math.sin(x),    Math.cos(x),    0,
                            0,              0,              0,              1);
    // rotate around y-axis
    let roll = new Matrix4( Math.cos(y),    0,              Math.sin(y),    0,
                            0,              1,              0,              0,
                            -1*Math.sin(y), 0,              Math.cos(y),    0,
                            0,              0,              0,              1);
    vector = yaw(vector, z);
    vector.transformDirection(roll);
    vector.transformDirection(pitch);
    return vector;
}

/*
* Extracted so I can transform sensor to the right frame with only 1 matrix multiplication
*/
function yaw(vector, y) {
    // rotate around z-axis
    
    let R = new Matrix4(    Math.cos(y),    -1*Math.sin(y), 0,              0,
                            Math.sin(y),    Math.cos(y),    0,              0,
                            0,              0,              1,              0,
                            0,              0,              0,              1);     
    vector.transformDirection(R);
    return vector;     
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer