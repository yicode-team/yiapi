import fp from 'fastify-plugin';
import fastifyMultipart from '@fastify/multipart';
import { appConfig } from '../config/app.js';

async function plugin(fastify, options) {
    fastify.register(fastifyMultipart, { attachFieldsToBody: true });
}

export default fp(plugin, {
    name: 'upload'
});
