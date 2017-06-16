import * as express from 'express';

import Router from './Router';

import { getArgumentNames, wrapMethod } from './FunctionUtil';

export type RouteVerb = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Middleware = express.RequestHandler | express.RequestHandler[];

export class RouteDefinition {
    verb: RouteVerb;
    name: string | RegExp;
    middleware: Middleware[] = [];
    pipeArgs: boolean = false;
}

export interface RouteNames {
    [index: string]: RouteDefinition;
}

export default class RouteBuilder {
    routeNames: RouteNames = {};
    parent: RouteBuilder;
    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: Middleware) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].middleware.push(middleware);
    }

    addDefinition(methodName: string, verb: RouteVerb, name: string | RegExp, pipeArgs: boolean = true) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].verb = verb;
        this.routeNames[methodName].name = name;
        this.routeNames[methodName].pipeArgs = pipeArgs;
    }

    baseRoutes: RouteVerb[] = ['all', 'get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

    build(router: express.IRouter<express.Router>, controller: Router) {
        if (this.parent) {
            this.parent.build(router, controller);
        }
        for (var index in this.routeNames) {
            if (this.routeNames.hasOwnProperty(index)) {
                var routeName = this.routeNames[index];
                var middleware = routeName.middleware;
                var name = routeName.name;
                var verb = routeName.verb;
                if (this.baseRoutes.indexOf(index as any) >= 0) {
                    if (!verb) {
                        verb = index as any;
                    }
                    if (!name) {
                        name = '/' + controller.getBase() + '/';
                    }
                }
                if (!name) {
                    name = '/' + controller.getBase() + '/' + index + '/';
                }
                var method = controller[index];
                if (method) {
                    if (routeName.pipeArgs) {
                        name = name + getArgumentNames(method).map(function (value) {
                            return ':' + value;
                        }).join('/');
                        console.log(name);
                        method = wrapMethod(method, controller);
                    } else {
                        method = method.bind(controller);
                    }
                }
                switch (verb) {
                    case 'all':
                        router.all(name, ...middleware, method);
                        break;
                    case 'get':
                        router.get(name, ...middleware, method);
                        break;
                    case 'post':
                        router.post(name, ...middleware, method);
                        break;
                    case 'put':
                        router.put(name, ...middleware, method);
                        break;
                    case 'delete':
                        router.delete(name, ...middleware, method);
                        break;
                    case 'patch':
                        router.patch(name, ...middleware, method);
                        break;
                    case 'options':
                        router.options(name, ...middleware, method);
                        break;
                    case 'head':
                        router.head(name, ...middleware, method);
                        break;
                }
            }
        }
    }
}