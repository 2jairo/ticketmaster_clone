import type { ErrorRequestHandler, RequestHandler } from "express";

export const enum ErrKind {
    InternalServerError = 'InternalServerError',
    RouteNotFound = 'RouteNotFound',
    UserNotFound = 'UserNotFound',
    PasswordMismatch = 'PasswordMismatch',
    Unauthorized = 'Unauthorized',
    ConcertNotFound = 'ConcertNotFound',
}

export class LocalError {
    statusCode: number
    errKind: ErrKind
    msg?: string

    constructor(kind: ErrKind, code: number, msg?: string) {
        this.statusCode = code
        this.errKind = kind
        
        if(msg) {
            this.msg = msg
        }
    }
    
    toJSON() {
        return {
            error: this.errKind,
            ...(this.msg ? { message: this.msg } : {})
        }
    }
}


export const errorHandler: ErrorRequestHandler = (
    err: Error, 
    req, 
    res, 
    next
) => {
    const localErr = err instanceof LocalError
        ? err
        : new LocalError(ErrKind.InternalServerError, 500, err.message)

    res.status(localErr.statusCode).json(localErr.toJSON())
    next()
}

export const notFoundHandler: RequestHandler = (req, res, next) => {
    throw new LocalError(ErrKind.RouteNotFound, 404)
}