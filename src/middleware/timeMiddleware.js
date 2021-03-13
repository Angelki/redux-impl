const timeMiddleware = (store) => (next) => (action) => {
    console.log(new Date().getTime(), action, '🍎');
    next(action);
};

export default timeMiddleware;
