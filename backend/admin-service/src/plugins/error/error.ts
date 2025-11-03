import fp from 'fastify-plugin'

export const enum ErrKind {
    InternalServerError = 'InternalServerError',
    RouteNotFound = 'RouteNotFound',
    UserNotFound = 'UserNotFound',
    UniqueConstraintViolation = 'UniqueConstraintViolation',
    RequiredConstraintViolation = 'RequiredConstraintViolation',
    RegexConstraintViolation = 'RegexConstraintViolation',
    Unauthorized = 'Unauthorized',
    ExpiredAccessToken = 'ExpiredAccessToken',
    ExpiredRefreshToken = 'ExpiredRefreshToken',
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

export const errorHandler = fp((fastify) => {
    fastify.setErrorHandler((err, req, reply) => {
        if(err instanceof LocalError) {
            reply.status(err.statusCode).send(err.toJSON())
        }

        let localErr = new LocalError(ErrKind.InternalServerError, 500, err.message)
        reply.status(localErr.statusCode).send(localErr.toJSON())
    })


    fastify.setNotFoundHandler((req, reply) => {
        throw new LocalError(ErrKind.RouteNotFound, 404, `Cannot find ${req.method} ${req.url}`)
    })
})