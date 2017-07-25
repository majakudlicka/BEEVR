'use strict';
const Hapi = require('hapi');
const Boom = require('boom');
const _ = require('lodash');
const pkg = require('../package.json');
const inert = require('inert');
const blipp = require('blipp');
const cookieAuth = require('hapi-auth-cookie');
const {hashPassword, comparePassword} = require('./bcrypt.js');
const fs = require('fs');
const data = require('./database/db_queries.js');
const env = require('env2');
env('./config.env');

const server = new Hapi.Server();

const PORT = process.env.PORT || 4000;

server.connection({
    port: PORT,
});

const plugins = [inert, blipp, cookieAuth];

server.register(plugins, err => {
    if (err) throw err;

    console.log('=> Registered plugins:', {
        plugins: _.keysIn(server.registrations).join(', '),
    });

    const cookieAuthOptions = {
        password: process.env.COOKIE_PASSWORD,
        cookie: 'logged-in',
        isSecure: false,
        ttl: 24 * 60 * 60 * 1000,
    };

    server.auth.strategy('session', 'cookie', 'optional', cookieAuthOptions);

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: './react-ui/build',
                listing: false,
                index: true,
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/api/jobs',
        handler: (request, reply) => {
            data.getJobs((err, res) => {
                if (err)
                    reply.status(500)(
                        'Failed to connect load data from the database'
                    );
                reply({
                    name: 'jobsList',
                    message: 'Welcome to BEEVR!',
                    jobsList: res,
                });
            }, request.url.query.term);
        },
    });

    server.route({
        method: 'POST',
        path: '/api/jobs',
        handler: (request, reply) => {
            data.postJobs(request.payload, (err, res) => {
                if (err) {
                    return reply.status(500)(
                        'Failed to connect load data from the database'
                    );
                }
                reply({
                    name: 'newJob',
                    message: 'Welcome to BEEVR!',
                    newJob: res,
                });
            });
        },
    });

    server.route({
        method: 'GET',
        path: '/api/random_jobs',
        handler: (request, reply) => {
            data.getRandomJobs((err, res) => {
                if (err)
                    return reply.status(500)(
                        'Failed to connect load data from the database'
                    );
                reply({
                    name: 'jobsList',
                    message: 'Welcome to BEEVR!',
                    jobsList: res,
                });
            });
        },
    });

    server.route({
        method: 'GET',
        path: '/api/student',
        handler: (request, reply) => {
            console.log('req',request.query);
            data.studentExists(request.query.email, (err, res) => {
                if (err) {
                    return reply(Boom.unauthorized('Please log-in to see that', data.error));
                }
                reply(res);
            });
        },
    });

    server.route({
        method: 'POST',
        path: '/api/reg-student',
        handler: (request, reply) => {
            console.log(request.payload);
            hashPassword(request.payload.password, (err, hash) => {
                if (err) {
                    return reply(Boom.badData('', 'bcrypt error'));
                }
                console.log(hash);
                data.postStudents(Object.assign({}, request.payload, {password_hash:hash}), (err, res) => {
                    console.log(request.payload);
                    if (err) {
                        return reply(Boom.serverUnavailable('unavailable', data.error));
                    }
                    reply({
                        name: 'student',
                        student: res,
                    });
                });
            });
        },
    });        

    server.route({
        method: 'GET',
        path: '/api/resident',
        handler: (request, reply) => {
            console.log('req',request.query);
            data.residentExists(request.query.email, (err, res) => {
                if (err) {
                    return reply(Boom.unauthorized('Please log-in to see that', data.error));
                }
                reply(res);
            });
        },
    });

    server.route({
        method: 'POST',
        path: '/api/reg-resident',
        handler: (request, reply) => {
            console.log(request.payload);
            hashPassword(request.payload.password, (err, hash) => {
                if (err) {
                    return reply(Boom.badData('', 'bcrypt error'));
                }
                console.log(hash);
                data.postResidents(Object.assign({}, request.payload, {password_hash:hash}), (err, res) => {
                    console.log(request.payload);
                    if (err) {
                        return reply(Boom.serverUnavailable('unavailable', data.error));
                    }
                    reply({
                        name: 'resident',
                        resident: res,
                    });
                });
            });
        },
    });

    server.route({
        method: 'GET',
        path: '/api/auth',
        handler: (request, reply) => {
            console.log(request);
            data.loginRequest(request.query.email, (err, res) => {
                if (err) {
                    return reply(Boom.unauthorized('Please log-in to see that', data.error));
                    console.log('ffff',err);
                }
                reply({
                    name: 'loginRequest',
                    status: 'success',
                    //loginRequest: res,
                });
            });
        },
    });

    server.route({
        method: 'GET',
        path: '/api',
        handler: (request, reply) => {
            reply({
                name: pkg.name,
                version: pkg.version,
                message: 'Welcome to BEEVR!',
            });
        },
    });

    server.start(err => {
        if (err) {
            throw err;
        }

        console.log(`=> BEEVR Server running at: ${server.info.uri}`);
    });
});

module.exports = server;
