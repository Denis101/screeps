import "reflect-metadata";
import { Container, interfaces, injectable } from "inversify";

const container: Container = new Container();

/**
 * One-to-one mapping of an interface
 * @param type Interface type
 */
export function service<I>(type: symbol) {
    return (target: any) => {
        container.bind<I>(type).to(target);
        injectable()(target);
    };
}

/**
 * One-to-many mapping of an interface
 * @param type Interface type
 * @param named Interface sub-type
 */
export function component<I>(type: symbol, named: symbol) {
    return (target: any) => {
        container.bind<I>(type).to(target).whenTargetNamed(named);
        injectable()(target);
    }
}

/**
 * Binds a factory to an interface,
 * this allows one-to-many mappings of components
 * @param type Interface type
 */
export function bindFactory<I>(type: symbol) {
    container.bind<interfaces.Factory<I>>(type)
        .toFactory<I>((context: interfaces.Context): interfaces.Factory<I> => {
            return (named: string) => context.container.getNamed<I>(type, named);
        });
}

/**
 * Gets the factory symbol of a given interface type
 * @param type Interface type
 */
export function factoryType(type: symbol) {
    return Symbol(`Factory<${String(type)}>`);
}

export default container;
