import { useReducer, useContext, createContext } from 'react';
const AppContext = createContext();
export default function createStore(params) {
    const { initialState } = {
        initialState: {},
        ...params,
    };
    // all state
    const store = {
        _state: initialState,
    };
    const Provider = (props) => {
        const [state, dispatch] = useReducer();
        if (!store.dispatch)
            store.dispatch = async (action) => {
                dispatch(action);
            };
        return (
            <AppContext.Provider {...props} value={state}>
                {props.children}
            </AppContext.Provider>
        );
    };
    return { Provider };
}
