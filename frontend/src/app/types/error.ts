export enum ErrKind {
  InternalServerError = 'InternalServerError',
  RouteNotFound = 'RouteNotFound',
  UserNotFound = 'UserNotFound',
  UniqueConstraintViolation = 'UniqueConstraintViolation',
  RequiredConstraintViolation = 'RequiredConstraintViolation',
  RegexConstraintViolation = 'RegexConstraintViolation',
  Unauthorized = 'Unauthorized',
  ConcertNotFound = 'ConcertNotFound',

  // only frontend
  Status0 = 'Status0' // server down | no connection
}


export interface LocalErrorResponse {
  error: ErrKind
  message?: string
}
