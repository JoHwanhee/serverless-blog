import 'reflect-metadata';

export const Controller = (): ClassDecorator => {
    return target => {
        Reflect.defineMetadata("isController", true, target);
    };
};

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