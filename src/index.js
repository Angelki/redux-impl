import { createStore, combineReducers } from './redux/index.js';
import counter from './reducers/counter.js';
import info from './reducers/info.js';
import exceptionMiddleware from './middlewares/exceptionMiddleware.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import timeMiddleware from './middlewares/timeMiddleware.js';

// let initState = {
//     counter: {
//         count: 0,
//     },
//     info: {
//         name: '',
//         desc: '',
//     },
// };

const reducer = combineReducers({
    counter: counter,
});

let store = createStore(reducer);
const next = store.dispatch;
const time = timeMiddleware(store);
const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(time(logger(next)));
const nextReducer = combineReducers({
    counter: counter,
    info: info,
});
store.replaceReducer(nextReducer);

let state = store.getState();
console.log(state, '🍎');

store.subscribe(() => {
    let state = store.getState();
    console.log(store.getState(), '📷');
});

store.dispatch({
    type: 'INCREMENT',
});
store.dispatch({
    type: 'SET_NAME',
    payload: {
        name: 'hhhhh',
    },
});
