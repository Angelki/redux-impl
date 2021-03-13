const loggerMiddleware = (store) => (next) => (action) => {
    next(action);
};

export default loggerMiddleware;
