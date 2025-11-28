export enum ErrKind {
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

  // only frontend
  Status0 = 'Status0' // server down | no connection
}


export interface LocalErrorResponse {
  error: ErrKind
  message?: string
}
