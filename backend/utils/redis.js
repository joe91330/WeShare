const Redis = require("ioredis");
const redis = new Redis({
    host: 'redis',
    port: 6379
})

module.exports = {
    rateLimiter: async (req, res, next) => {
        const period = 1;
        const times = 30;
        const block = 60;
        var ip = req.headers['x-forwarded-for'];
        try {
            const requestCount = await redis.get(ip);
            if(requestCount == null){
                await redis.set(ip, 1, 'EX', period);
            }
            else if(requestCount === false){
                return res.status(429).json({ error: 'Too frequent operations, please wait a moment!' });
            }
            else if(requestCount > times){
                await redis.set(ip, false, 'EX', block);
            }
            else{
                await redis.incr(ip);
            }
            next();
        } catch (err) {
            return res.status(500).json({ error: 'Redis Error' });
        }
    },
    get_cache: async (key) => {
        try {
            const result = await redis.get(key);
            return JSON.parse(result);
        } catch (err) {
            return false;
        }
    },
    set_cache: async (key, payload, expire_time) => {
        try {
            if(expire_time){
                await redis.SETEX(key, expire_time, JSON.stringify(payload)); // s
            }
            else{
                await redis.SETEX(key, 3600,  JSON.stringify(payload));
            }
          } catch (err) {
            return false;
          }
    },
    del_cache: async (key) => {
        try {
            await redis.del(key);
          } catch (err) {
            return false;
          }
    }
}