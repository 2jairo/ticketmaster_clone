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
  MusicGroupNotFound = 'MusicGroupNotFound',
  PasswordMismatch = 'PasswordMismatch',
}


export class LocalError {
  statusCode: number;
  errKind: ErrKind;
  msg?: string;

  constructor(kind: ErrKind, code: number, msg?: string) {
    this.statusCode = code;
    this.errKind = kind;

    if (msg) {
      this.msg = msg;
    }
  }

  toJSON() {
    return {
      error: this.errKind,
      ...(this.msg ? { message: this.msg } : {})
    };
  }
}
