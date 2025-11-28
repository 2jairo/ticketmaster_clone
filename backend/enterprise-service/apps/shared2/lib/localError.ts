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
  MusicGroupNotFound = 'MusicGroupNotFound',
  PasswordMismatch = 'PasswordMismatch',
}


export class LocalError {
  statusCode: number;
  errKind: ErrKind;
  msg?: string;
  cause?: any

  constructor(kind: ErrKind, code: number, msg?: string, cause?: any) {
    this.statusCode = code;
    this.errKind = kind;

    if (msg) {
      this.msg = msg;
    }
    if(cause) {
      this.cause = cause
    }
  }

  toJSON() {
    return {
      error: this.errKind,
      ...(this.msg ? { message: this.msg } : {}),
      ...(this.cause ? { cause: this.cause } : {})
    };
  }
}
