import { Elysia, Context } from "elysia";
import cors from '@elysia/cors'
import openapi from "@elysia/openapi";
import { auth } from "./lib/auth";
import { authRoute } from "./routers/auth-route";

const app = new Elysia()

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