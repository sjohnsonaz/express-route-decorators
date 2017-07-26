import * as express from 'express';

import RouteBuilder from './RouteBuilder';

export type IRequest = express.Request;
export type IResponse = express.Response;
export type INext = express.NextFunction;

export default class Router {
    base: string;
    routeBuilder: RouteBuilder;
    expressRouter: express.IRouter<express.Router>;
    constructor(base?: string) {
        this.base = base;
        this.expressRouter = express.Router();
        this.build();
    }
    build() {
        this.routeBuilder.build(this.expressRouter, this);
    }
    getBase() {
        if (this.base) {
            return this.base;
        } else {
            var name = (this.constructor as any).name;
            if (name) {
                var results = name.match(/(.*)([sS]ervice|[rR]oute)/);
                if (results && results[1]) {
                    name = results[1].toLowerCase();
                }
            }
            return name;
        }
    }
}
