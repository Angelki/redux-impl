import { createStore } from './redux/index.js';
import reducer from './reducer.js';

let initState = {
    counter: {
        count: 0,
    },
    info: {
        name: '',
        desc: '',
    },
};

let store = createStore(reducer, initState);

store.subscribe(() => {
    let state = store.getState();
    console.log(store.getState(), '🍎');
});

store.dispatch({
    type: 'INCREMENT',
});
