import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";

export const enum ErrKind {
    InternalServerError = 'InternalServerError',
    RouteNotFound = 'RouteNotFound',
    UserNotFound = 'UserNotFound',
    UniqueConstraintViolation = 'UniqueConstraintViolation',
    RequiredConstraintViolation = 'RequiredConstraintViolation',
    RegexConstraintViolation = 'RegexConstraintViolation',
    Unauthorized = 'Unauthorized',
    ConcertNotFound = 'ConcertNotFound',
    CommentNotFound = 'CommentNotFound',
    MusicGroupNotFound = 'MusicGroupNotFound',
    PasswordMismatch = 'PasswordMismatch'
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
    err: any, 
    req, 
    res, 
    next
) => {
    if(err instanceof LocalError) {
        res.status(err.statusCode).json(err.toJSON())
        return next()
    }

    // console.log(JSON.stringify(err))

    let localErr = new LocalError(ErrKind.InternalServerError, 500, err.message)

    if(err instanceof mongoose.Error.ValidationError) {
        for (const [name, e] of Object.entries(err.errors)) {
            if(e.kind === 'unique') {
                localErr = new LocalError(ErrKind.UniqueConstraintViolation, 409, name)
                break
            } else if(e.kind === 'required') {
                localErr = new LocalError(ErrKind.RequiredConstraintViolation, 400, name)
                break
            } else if(e.kind === 'regexp') {
                localErr = new LocalError(ErrKind.RegexConstraintViolation, 400, name)
                break
            }
        }
    }

    res.status(localErr.statusCode).json(localErr.toJSON())
    next()
}

export const notFoundHandler: RequestHandler = (req, res, next) => {
    throw new LocalError(ErrKind.RouteNotFound, 404)
}