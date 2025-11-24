import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ErrKind, LocalError } from './localError';
import { Response } from 'express';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  getErrKind(exceptionName: string) {
    switch (exceptionName) {
      case 'BadRequestException': return ErrKind.BadRequest;
      case 'UnauthorizedException': return ErrKind.Unauthorized;
      case 'ForbiddenException': return ErrKind.Forbidden;
      case 'NotFoundException': return ErrKind.RouteNotFound;
      case 'MethodNotAllowedException': return ErrKind.MethodNotAllowed;
      case 'NotAcceptableException': return ErrKind.NotAcceptable;
      case 'RequestTimeoutException': return ErrKind.RequestTimeout;
      case 'ConflictException': return ErrKind.UniqueConstraintViolation;
      case 'GoneException': return ErrKind.RouteNotFound;
      case 'PayloadTooLargeException': return ErrKind.PayloadTooLarge;
      case 'UnsupportedMediaTypeException': return ErrKind.UnsupportedMediaType;
      case 'UnprocessableEntityException': return ErrKind.UnprocessableEntity;
      case 'TooManyRequestsException': return ErrKind.TooManyRequests;
      case 'InternalServerErrorException': return ErrKind.InternalServerError;
      case 'NotImplementedException': return ErrKind.NotImplemented;
      case 'BadGatewayException': return ErrKind.BadGateway;
      case 'ServiceUnavailableException': return ErrKind.ServiceUnavailable;
      case 'GatewayTimeoutException': return ErrKind.GatewayTimeout;
      default: return ErrKind.InternalServerError;
    }
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()

    if(exception instanceof LocalError) {
      response.status(exception.statusCode).json(exception.toJSON())
      return
    }

    let err = new LocalError(ErrKind.InternalServerError, 500)

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      err = new LocalError(
        this.getErrKind(exception.name),
        exception.getStatus(),
        typeof res === 'string' ? res : (res as any).message
      )
    } 

    response.status(err.statusCode).json(err.toJSON())
  }
}
