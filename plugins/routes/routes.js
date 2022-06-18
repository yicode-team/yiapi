import fp from 'fastify-plugin';
import fastifyRoutes from '@fastify/routes';

import { appConfig } from '../../config/app.js';

async function main(fastify, opts) {
    fastify.register(fastifyRoutes);
}
export default fp(main, { name: 'routes' });
