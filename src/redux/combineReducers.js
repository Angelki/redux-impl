export default function combineReducers(reducers) {
    const reducersKeys = Object.keys(reducers);
    return function combination(state = {}, action) {
        const nextState = {};
        for (let i = 0; i < reducersKeys.length; i++) {
            // 获取reducer的名字
            const key = reducersKeys[i];
            // 拿到reducer方法
            const reducer = reducers[key];
            // 找到对应reducer名字的前state
            const preStateForKey = state[key];
            // 调用对应的reducer 获得新的state;
            const nextStateForKey = reducer(preStateForKey, action);
            nextState[key] = nextStateForKey;
        }
        return nextState;
    };
}
