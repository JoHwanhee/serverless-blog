export const pipe = (...fns) => (x) => fns.reduce(async (v, f) => f(await v), x);
