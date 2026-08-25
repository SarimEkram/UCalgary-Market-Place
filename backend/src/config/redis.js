import { createClient } from "redis";

// Prefer a full connection URL (e.g. Upstash: rediss://default:password@host:6379).
// Fall back to host/port for local docker-compose.
const redisUrl =
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`;

const redisClient = createClient({
    url: redisUrl,
    socket: {
        // Give up reconnecting after a handful of tries instead of spamming logs
        // forever. Rate limiting fails open (see rateLimiter.js) when Redis is down.
        reconnectStrategy: (retries) => (retries > 10 ? false : Math.min(retries * 200, 2000)),
    },
});

redisClient.on("error", (err) => console.error("Redis error:", err.message));

// Connect in the background. Do NOT block or crash the process if Redis is
// unreachable — the app must still boot on a free host where Redis may be
// paused, missing, or slow to wake.
redisClient.connect().catch((err) => {
    console.error("Redis initial connection failed (continuing without Redis):", err.message);
});

export default redisClient;
