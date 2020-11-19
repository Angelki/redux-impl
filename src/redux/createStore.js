export default function createStore(reducer, initState, rewriteMiddleware) {
    if (rewriteMiddleware) {
        return rewriteMiddleware(createStore)(reducer, initState);
    }
    let state = initState;
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    }

    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }

    function replaceReducer(nextReducer) {
        reducer = nextReducer;
        dispatch({ type: Symbol('replace') });
    }

    function getState() {
        return state;
    }

    dispatch({ type: Symbol('init') });
    return {
        subscribe,
        getState,
        dispatch,
        replaceReducer,
    };
}
