import { createClient } from "redis";

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || "redis"}:6379`,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
await redisClient.connect();

export default redisClient;