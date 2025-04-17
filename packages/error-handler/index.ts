export class AppError extends Error{
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?:any;

    constructor(
        message:string,
        statusCodde:number,
        isOperational=true,
        details?:any
    ){
        super(message);
        this.statusCode=statusCodde;
        this.isOperational=isOperational;
        this.details=details;
        Error.captureStackTrace(this);
    }
}

//Not found error
export class NotFoundError extends AppError{
    constructor(
        message="Resource not found", 
    ){
        super(message, 404);
    }
}

// validation error (zod/Joi/react-hook-form errors)
export class ValidationError extends AppError{
    constructor(
        message="Invlid request data",
        details?:any
    ){
        super(message, 400, true, details);
    }
}   

// Authentication error
export class AuthError extends AppError{
    constructor(
        message="Unathorized",
    ){
        super(message, 401);
    }
}

// Forbidden error (Insufficient permissions)
export class ForbiddenError extends AppError{
    constructor(
        message="Forbidden access",
    ){
        super(message, 403);
    }
}

// Database error (MongoDB, Postgres.)
export class DatabaseError extends AppError{
    constructor(
        message="Database error",
        details?:any
    ){
        super(message, 500, true, details);
    }
}

