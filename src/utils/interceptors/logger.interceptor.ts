import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  map,
  Observable,
  //  tap
} from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before Route Handler');

    return next.handle().pipe(
      // tap(() => console.log('After route handler'))
      map((dataFromRouteHandler) => {
        const { password, ...otherData } = dataFromRouteHandler;
        return { ...otherData }; // ne7na 3mlna hayda l interceptor kerml ma neb3at l password ma3 l data. bas already fi build in interceptor kerml hal shi la7 nesta3mla badel hayda
      }),
    );
  }
}
