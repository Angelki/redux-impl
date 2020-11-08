let initState = {
    name: 'Edward',
    desc: 'FE',
};

export default function reducer(state, action) {
    if (!state) {
        state = initState;
    }
    switch (action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name: action.payload.name,
            };
        case 'SET_DESC':
            return {
                ...state,
                desc: action.payload.desc,
            };
        default:
            return state;
    }
}
