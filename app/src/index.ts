import { Elysia } from "elysia";
import cors from '@elysia/cors'
import openapi from "@elysia/openapi";
import { auth } from "../../packages/auth";
import { errorHandler } from './error-handler';
import { authRoute } from "./routers/auth-route";
import { userRoute } from "./routers/user-route";

const app = new Elysia()

  // Normalize errors from routes, validation, and mounted handlers.
  .use(errorHandler)

  // CORS
  .use(
    cors({
      origin: "http://localhost:3000",
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
          { name: 'User', description: 'User management' },
        ],
      },
    }),
  )

  // Mount
  .mount(auth.handler)

  // API routes 
  .group('/api/v1', (app) => app.use(authRoute).use(userRoute))

  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}/openapi`,
);