import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import { redisConfig } from '../config/redis.js';

async function plugin(fastify, opts) {
    fastify.register(fastifyRedis, redisConfig);
}
export default fp(plugin, { name: 'redis' });
