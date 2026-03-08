"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const globalForRedis = global;
exports.redis = globalForRedis.redis ||
    new ioredis_1.Redis(process.env.REDIS_URL || "redis://localhost:6379");
if (process.env.NODE_ENV !== "production")
    globalForRedis.redis = exports.redis;
//# sourceMappingURL=redis.js.map