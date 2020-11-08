export default function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                count: state.counter.count + 1,
            };
        case 'DECREMENT':
            return {
                ...state,
                count: state.counter.count - 1,
            };
        default:
            return state;
    }
}
