import Redis from 'ioredis';

const redis = new Redis({
    Port : process.env.REDIS_PORT,
    host : process.env.REDIS_HOST
})

export default redis;
