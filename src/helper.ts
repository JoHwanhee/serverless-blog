

type Func<T, R> = (arg?: T) => R | Promise<R>;

export function pipe<T>(): (arg?: T) => Promise<T>;

export function pipe<T, A>(fn1: Func<T, A>): (arg?: T) => Promise<A>;

export function pipe<T, A, B>(
    fn1: Func<T, A>,
    fn2: Func<A, B>
): (arg?: T) => Promise<B>;

export function pipe<T, A, B, C>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>
): (arg?: T) => Promise<C>;

export function pipe<T, A, B, C, D>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>
): (arg?: T) => Promise<D>;

export function pipe<T, A, B, C, D, E>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>
): (arg?: T) => Promise<E>;

export function pipe<T, A, B, C, D, E, F>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>,
    fn6: Func<E, F>
): (arg?: T) => Promise<F>;

export function pipe<T, A, B, C, D, E, F, G>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>,
    fn6: Func<E, F>,
    fn7: Func<F, G>
): (arg?: T) => Promise<G>;

export function pipe<T, A, B, C, D, E, F, G, H>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>,
    fn6: Func<E, F>,
    fn7: Func<F, G>,
    fn8: Func<G, H>
): (arg?: T) => Promise<H>;

export function pipe<T, A, B, C, D, E, F, G, H, I>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>,
    fn6: Func<E, F>,
    fn7: Func<F, G>,
    fn8: Func<G, H>,
    fn9: Func<H, I>
): (arg?: T) => Promise<I>;

export function pipe<T, A, B, C, D, E, F, G, H, I, J>(
    fn1: Func<T, A>,
    fn2: Func<A, B>,
    fn3: Func<B, C>,
    fn4: Func<C, D>,
    fn5: Func<D, E>,
    fn6: Func<E, F>,
    fn7: Func<F, G>,
    fn8: Func<G, H>,
    fn9: Func<H, I>,
    fn10: Func<I, J>
): (arg?: T) => Promise<J>;

export function pipe<T = any>(...fns: Function[]): (arg?: T) => Promise<any> {
    return async (x?: T) => {
        let result = x;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}
