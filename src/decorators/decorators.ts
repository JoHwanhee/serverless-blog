import 'reflect-metadata';

export const Get = (path: string): MethodDecorator => {
    return (target?: Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(
            'route',
            { path, method: 'get' },
            target,
            propertyKey
        );
        return descriptor;
    };
};

export const Post = (path: string): MethodDecorator => {
    return (target?: Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(
            'route',
            { path, method: 'post' },
            target,
            propertyKey
        );
        return descriptor;
    };
};