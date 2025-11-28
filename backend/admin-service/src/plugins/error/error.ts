import fp from 'fastify-plugin'

export const enum ErrKind {
  InternalServerError = 'InternalServerError',
  RouteNotFound = 'RouteNotFound',

  // Auth
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  ExpiredAccessToken = 'ExpiredAccessToken',
  ExpiredRefreshToken = 'ExpiredRefreshToken',

  // Validation / constraints
  BadRequest = 'BadRequest',
  UniqueConstraintViolation = 'UniqueConstraintViolation',
  RequiredConstraintViolation = 'RequiredConstraintViolation',
  RegexConstraintViolation = 'RegexConstraintViolation',

  // Request-specific
  MethodNotAllowed = 'MethodNotAllowed',
  NotAcceptable = 'NotAcceptable',
  RequestTimeout = 'RequestTimeout',
  PayloadTooLarge = 'PayloadTooLarge',
  UnsupportedMediaType = 'UnsupportedMediaType',
  UnprocessableEntity = 'UnprocessableEntity',
  TooManyRequests = 'TooManyRequests',

  // Network / gateway
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  NotImplemented = 'NotImplemented',

  // Domain
  UserNotFound = 'UserNotFound',
  ConcertNotFound = 'ConcertNotFound',
  CommentNotFound = 'CommentNotFound',
  CartNotFound = 'CartNotFound',
  OrderNotFound = 'OrderNotFound',
  NotEnoughStock = 'NotEnoughStock',
  MusicGroupNotFound = 'MusicGroupNotFound',
  PasswordMismatch = 'PasswordMismatch',
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
        console.log({err})

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