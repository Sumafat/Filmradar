import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter yalnızca env değişkenleri ayarlandığında aktif olur
let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "1 m"), // Dakikada 60 istek
    analytics: true,
    prefix: "filmradar",
  });
}

/**
 * Belirtilen identifier için rate limit kontrolü yapar.
 * Upstash yapılandırılmamışsa her zaman başarılı döner.
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (!ratelimit) {
    return { success: true, limit: 60, remaining: 60, reset: 0 };
  }

  return ratelimit.limit(identifier);
}
