import compose from './compose.js';

export default function applyMiddleware(...middleware) {
    return function (oldCreateStore) {
        return function newCreateStore(reducer, initState) {
            const store = oldCreateStore(reducer, initState);
            const chain = middleware.map((mw) => mw(store));
            // 将middleware和初始的dispatch合成一个新的dispatch
            const dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch,
            };
        };
    };
}
