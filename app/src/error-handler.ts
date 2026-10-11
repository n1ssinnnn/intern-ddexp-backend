import { Elysia } from 'elysia';
import { Errors } from '../../packages/domains/errors';

const internalServerError = {
  title: 'InternalServerError',
  message: 'An unexpected error occurred',
};

export const errorHandler = new Elysia({ name: 'error-handler' }).onError(
  ({ code, error, set }) => {
    if (error instanceof Errors.ApiError) {
      set.status = error.status;

      // Do not send internal exception details to API clients.
      if (error.status >= 500) {
        return { error: internalServerError };
      }

      return {
        error: {
          title: error.title,
          message: error.message,
        },
      };
    }

    switch (code) {
      case 'VALIDATION':
        set.status = 422;
        return {
          error: {
            title: 'ValidationError',
            message: 'Request validation failed',
          },
        };

      case 'PARSE':
        set.status = 400;
        return {
          error: {
            title: 'BadRequest',
            message: 'Request body could not be parsed',
          },
        };

      case 'NOT_FOUND':
        set.status = 404;
        return {
          error: {
            title: 'NotFound',
            message: 'Route not found',
          },
        };

      case 'INTERNAL_SERVER_ERROR':
      case 'UNKNOWN':
      case 'INVALID_COOKIE_SIGNATURE':
        console.error(error);
        set.status = 500;
        return { error: internalServerError };
    }

    // Handle numeric HTTP error codes and any future Elysia error codes.
    console.error(error);
    set.status = typeof code === 'number' && code >= 400 ? code : 500;
    return { error: internalServerError };
  },
);
