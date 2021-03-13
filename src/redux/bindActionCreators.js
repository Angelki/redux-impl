function boundActionCreator(actionCreator, dispatch) {
    return function () {
        return dispatch(actionCreator.apply(this, arguments));
    };
}

export default function bindActionCreators(actionCreators, dispatch) {
    const boundActionCreators = {};
    // 遍历actionCreators对象 key就是对应action的名字
    for (const key in actionCreators) {
        // actionCreator是对应的action函数 返回一个action
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = boundActionCreator(
                actionCreator,
                dispatch,
            );
        }
    }
    return boundActionCreators;
}
