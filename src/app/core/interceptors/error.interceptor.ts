import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _toastService = inject(ToastService);
  return next(req).pipe(

    catchError((error) => {
      if(error.error.error.includes('body')){
        _toastService.error("Post not allow to be empty", 'Connectly');

      }
      else {
        _toastService.error(error.error.error, 'Connectly');
      }
      return throwError(() => error);
    })
  );
};
