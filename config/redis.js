import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis("rediss://default:AeJnAAIjcDEzNTZhODZmYTI3ZTQ0Y2MyODE5YjFlYzA3NGYzYmE2MHAxMA@brief-pelican-57959.upstash.io:6379");
