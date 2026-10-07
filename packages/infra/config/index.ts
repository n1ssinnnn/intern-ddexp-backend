function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const config = {
    BETTER_AUTH_URL: requireEnv('BETTER_AUTH_URL'),
    DATABASE_URL: requireEnv('DATABASE_URL'),
} as const;