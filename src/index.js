import { createStore } from "./redux/index.js";

let initState = {
    counter: {
        count: 0,
    },
    info: {
        name: "",
        desc: "",
    },
};

let store = createStore(initState);

store.subscribe(() => {
    let state = store.getState();
    console.log(`${state.info.name}: ${state.info.desc}`);
});
store.subscribe(() => {
    let state = store.getState();
    console.log(`${state.counter.count} 🍎`);
});

store.changeState({
    ...store.getState(),
    info: {
        name: "Edward",
        desc: "Awesome",
    },
});
