import redisClient from "../config/redis.js";

function tokenBucket({ maxTokens, refillRate, refillInterval }) {
    return async (req, res, next) => {
        const key = `ratelimit:${req.ip}`;

        try {
            const raw = await redisClient.get(key);
            const now = Date.now();
            let bucket = raw
                ? JSON.parse(raw)
                : { tokens: maxTokens, lastRefill: now };

            const elapsed = now - bucket.lastRefill;
            const tokensToAdd = Math.floor(elapsed / refillInterval) * refillRate;
            bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
            bucket.lastRefill = now;

            if (bucket.tokens <= 0) {
                await redisClient.set(key, JSON.stringify(bucket), { EX: 900 });
                return res.status(429).json({ error: "Too many attempts. Please try again later." });
            }

            bucket.tokens -= 1;
            await redisClient.set(key, JSON.stringify(bucket), { EX: 900 });
            next();
        } catch (err) {
            console.error("Rate limiter error:", err);
            next();
        }
    };
}

export const authLimiter = tokenBucket({
    maxTokens: 10,
    refillRate: 1,
    refillInterval: 90 * 1000,
});

export const emailLimiter = tokenBucket({
    maxTokens: 5,
    refillRate: 1,
    refillInterval: 3 * 60 * 1000,
});