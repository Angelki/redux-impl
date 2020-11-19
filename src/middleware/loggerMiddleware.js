const loggerMiddleware = (store) => (next) => (action) => {
    console.log('logger', '🌲');
    next(action);
    console.log('logger222', '🌲');
};

export default loggerMiddleware;
