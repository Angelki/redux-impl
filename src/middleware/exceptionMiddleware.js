const exceptionMiddleware = (store) => (next) => (action) => {
    try {
        console.log('出错啦');
        next(action);
    } catch (e) {
        console.log('❌', e);
    }
};

export default exceptionMiddleware;
