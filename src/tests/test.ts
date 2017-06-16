import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

import * as http from 'http';
import * as express from 'express';

import Router, { middleware, route } from '../scripts/main';

describe('route decorator`', () => {
    it('should generate get routes', () => {
        class TestRouter extends Router {
            @route('get', '')
            get(req, res, next) {
            }
        }

        let port = 3003;
        let app = express();
        app.use('/test', new TestRouter().expressRouter);
        app.set('port', port);
        let server = http.createServer(app);
        server.listen(port);
        server.on('listening', () => {
            chai.request('localhost:' + port)
                .get('/test')
                .end((err, res) => {
                    res.should.have.status(200);
                    server.close();
                });
        });
    });
});
