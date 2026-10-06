import { Elysia } from "elysia";
import cors from '@elysia/cors'
import openapi from "@elysia/openapi";
import { auth } from "./lib/auth";
import { authRoute } from "./routers/auth-route";

const app = new Elysia()
  .onError(({ code, error, set }) => {
    const caught = error as Error & { status?: unknown; statusCode?: unknown };
    const candidateStatus = Number(caught.statusCode ?? caught.status);
    const status = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
      ? candidateStatus
      : code === 'VALIDATION'
        ? 422
        : code === 'NOT_FOUND'
          ? 404
          : code === 'PARSE'
            ? 400
            : 500;
    let message = caught.message || 'Internal server error';
    let details: { path: string; message: string }[] | undefined;

    if (code === 'VALIDATION') {
      try {
        const validation = JSON.parse(message) as {
          summary?: string;
          message?: string;
          errors?: { path?: string; message?: string; summary?: string }[];
        };
        message = validation.summary || validation.message || 'Request validation failed';
        details = validation.errors?.map((item) => ({
          path: item.path || '/',
          message: item.message || item.summary || 'Invalid value',
        }));
      } catch {
        message = 'Request validation failed';
      }
    }

    set.status = status;
    return {
      error: code,
      message,
      ...(details ? { details } : {}),
    };
  })

  // CORS
  .use(
    cors({
      origin: "http://localhost:3001",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )

  // OpenAPI docs
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Intern backend API',
          version: '1.0.0',
          description: 'Elysia + Bun + Better Auth + Drizzle ORM',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
        ],
      },
    }),
  )

  // Mount
  .mount(auth.handler)

  // API routes 
  .group('/api/v1', (app) => app.use(authRoute))

  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}/openapi`,
);