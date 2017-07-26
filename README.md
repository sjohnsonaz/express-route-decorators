# Express Route Decorators

This package provides TypeScript decorators to simplify your route definitions

```` TypeScript

import Router, { middleware, route, IRequest, IResponse, INext } from '../scripts/main';

class TestRouter extends Router {
    @route('get', '')
    get(req: IRequest, res: IResponse, next: INext) {
    }
}
````