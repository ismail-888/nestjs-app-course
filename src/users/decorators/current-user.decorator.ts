import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { JWTPayloadType } from 'src/utils/types';

// CurrentUser parameter Decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    // 1. Grab the standard Express request object
    const request: Request = context.switchToHttp().getRequest();
    // 2. Extract the user payload that was previously attached to the request
    const payload = request[CURRENT_USER_KEY] as JWTPayloadType;
    // 3. Return it so the controller can use it
    return payload;
  },
);
