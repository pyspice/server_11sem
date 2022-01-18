import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

export const container = new Container();

export function lazyInject(identifier: symbol) {
  return getDecorators(container).lazyInject(identifier);
}
