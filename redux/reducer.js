
export function initReducer() {
    return {
        x: 0,
        y: 0,
        z: 0,
    }
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
        */
        case 'gyro': 
            for(let key in action.payload) {
                action.payload[key] = action.payload[key]*10
            }
            return { ...state,
                x: state.x + -1*action.payload.y,
                y: state.y + action.payload.x,
                z: state.z + action.payload.z,
            };
        case 'zero':
            return initReducer();
        case 'alert':
            alert(action.payload);
            return state;
    }
}

// legacy: https://legacy.reactjs.org/docs/hooks-reference.html#usereducer
// docs: https://react.dev/reference/react/useReducer