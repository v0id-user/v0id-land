import Redis from "ioredis"

const redisClientSingleton = () => {
    if (!process.env.REDIS_URL) {
        throw new Error("Environment variable REDIS_URL is not set. Please configure it.");
    }
    return new Redis(process.env.REDIS_URL);
}

type CustomGlobal = typeof globalThis & {
  redisClient?: ReturnType<typeof redisClientSingleton>
}

const globalWithRedis = globalThis as CustomGlobal
const redis = globalWithRedis.redisClient ?? redisClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalWithRedis.redisClient = redis
}

export default redis