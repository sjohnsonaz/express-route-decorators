import * as express from 'express';

import RouteBuilder, { RouteVerb, Middleware } from './RouteBuilder';
import Router from './Router';

function getRouteBuilder(target: Router) {
    if (target.routeBuilder) {
        if (!target.hasOwnProperty('routeBuilder')) {
            target.routeBuilder = new RouteBuilder(target.routeBuilder);
        }
    } else {
        target.routeBuilder = new RouteBuilder();
    }
    return target.routeBuilder;
}

export function route(verb?: RouteVerb, name?: string | RegExp, pipeArgs: boolean = true) {
    return function (target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb, name, pipeArgs);
    }
}

export function middleware(middleware: Middleware) {
    return function (target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}