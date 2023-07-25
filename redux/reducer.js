import { Matrix3, Matrix4, Vector3 } from "three";

const cos = Math.cos;
const sin = Math.sin;
const pi = Math.PI;

export function initReducer() {
    return {
        x: 0,
        y: 0,
        z: 0
    }
}

function rad(d) {
    return d*pi/180;
}

function deg(r) {
    return r*180/pi;
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
        * Sensors read degrees
        * state stores degrees
        */
        case 'gyro': 
            let dView = [0, 0, 0.1]; //[rad(action.payload.x), rad(action.payload.y), rad(action.payload.z)];
            let view = [rad(state.x), rad(state.y), rad(state.z)];
            dView = matMult(getR([0, 0, rad(90)]), dView); // landscape
            dView = matMult(getR(view), dView); // rotate sensors to be on THREE.camera's frame
            let scale = 10;
            return { ...state,
                x: state.x + deg(dView[0])*scale,
                y: state.y + deg(dView[1])*scale,
                z: state.z + deg(dView[2])*scale
            };
        case 'zero':
            return initReducer();
    }
}

function getR(xyz) {
    // input can be [3] or Vector3 or gyroData
    let x, y, z;
    if(Array.isArray(xyz)) {
        x = xyz[0];
        y = xyz[1];
        z = xyz[2];
    } else {
        x = xyz.x ? xyz.x : 0;
        y = xyz.y ? xyz.y : 0;
        z = xyz.z ? xyz.z : 0;
    }
    return [[cos(z)*cos(y),     -1*sin(z)*sin(x)+cos(z)*sin(y)*sin(x),      cos(z)*sin(y)*cos(x)+sin(z)*sin(x)],
            [sin(z)*cos(y),     cos(z)*sin(y)*sin(x)+cos(z)*sin(x),         -1*cos(z)*sin(x)+sin(z)*sin(y)*cos(x)],
            [-1*sin(y),         cos(y)*sin(x),                              cos(y)*cos(x)]];
}

function transpose(mat) {
    let mat_t = [];
    for(let i = mat.length-1; i>=0; i--) {
        mat_t.push([]);
        for(let j = mat[i].length-1; j>=0; j--) {
            mat_t.push(mat[i][j]);
        }
    }
    return mat_t;
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

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer