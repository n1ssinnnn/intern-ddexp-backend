export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public title: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class BadRequest extends ApiError {
    constructor(message: string = 'Bad request') {
        super(message, 400, 'BadRequest');
    }
}

export class Unauthorized extends ApiError {
    constructor(message: string = 'Invalid authentication credentials') {
        super(message, 401, 'Unauthorized');
    }
}

export class Forbidden extends ApiError {
    constructor(
        message: string = 'Access denied due to insufficient permissions',
    ) {
        super(message, 403, 'Forbidden');
    }
}

export class NotFound extends ApiError {
    constructor(message: string = 'Requested resource not found') {
        super(message, 404, 'NotFound');
    }
}

export class Conflict extends ApiError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, 'Conflict');
    }
}

export class UnprocessableEntity extends ApiError {
    constructor(message: string = 'Unprocessable entity') {
        super(message, 422, 'UnprocessableEntity');
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string = 'Internal server error') {
        super(message, 500, 'InternalServerError');
    }
}