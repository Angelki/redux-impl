export default function compose(...fns) {
    if (fns.length === 0) {
        return (arg) => arg;
    }
    if (fns.length === 1) {
        return fns[0]();
    }
    return fns.reduce((acc, cur) => (...args) => acc(cur(...args)));
}
