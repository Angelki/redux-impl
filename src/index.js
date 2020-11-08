import { createStore, combineReducers } from './redux/index.js';
import counter from './reducers/counter.js';
import info from './reducers/info.js';

let initState = {
    counter: {
        count: 0,
    },
    info: {
        name: '',
        desc: '',
    },
};

const reducer = combineReducers({
    counter: counter,
    info: info,
});
let store = createStore(reducer, initState);

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
