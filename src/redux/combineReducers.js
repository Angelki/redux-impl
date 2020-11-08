export default function combineReducers(reducers) {
    const reducersKeys = Object.keys(reducers);
    return function combination(state, action) {
        const nextState = {};
        for (let i = 0; i < reducersKeys.length; i++) {
            const key = reducersKeys[i];
            const reducer = reducers[key];
            const preStateForKey = state[key];
            const nextStateForKey = reducer(preStateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    };
}
