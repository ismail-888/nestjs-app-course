import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { JWTPayloadType } from 'src/utils/types';

// CurrentUser parameter Decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const payload: JWTPayloadType = request[CURRENT_USER_KEY];
    return payload;
  },
);
