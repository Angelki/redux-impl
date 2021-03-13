import {
    createStore,
    combineReducers,
    applyMiddleware,
    bindActionCreators,
} from './redux/index.js';
import counter from './reducers/counter.js';
import info from './reducers/info.js';
import exceptionMiddleware from './middleware/exceptionMiddleware.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import timeMiddleware from './middleware/timeMiddleware.js';
import { increment } from './actions/counter.js';
import { setName } from './actions/info.js';

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

// const next = store.dispatch;
// const time = timeMiddleware(store);
// const logger = loggerMiddleware(store);
// const exception = exceptionMiddleware(store);
// store.dispatch = exception(time(logger(next)));
const rewriteMiddleware = applyMiddleware(
    exceptionMiddleware,
    timeMiddleware,
    loggerMiddleware,
);
let store = createStore(reducer, {}, rewriteMiddleware);
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

const actions = bindActionCreators(
    {
        increment,
        setName,
    },
    store.dispatch,
);
actions.increment();
actions.setName();
