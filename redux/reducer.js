
export function initReducer() {
    return {
        x: 0,
        y: 0,
        z: 0,
    }
}

export function reducer(state, action) {
    switch(action.type) {
        case 'gyro': 
            return { ...state,
                x: state.x + action.payload.x,
                y: state.y + action.payload.y,
                z: state.z + action.payload.z,
            };
        case 'zero':
            return initReducer();
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer