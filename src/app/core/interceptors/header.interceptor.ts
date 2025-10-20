import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from '../services/cookie.service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // handle Req --- send Header Req (SSR)

  const _PLATFORM_ID = inject(PLATFORM_ID); // check if the code is running on the browser
  const _CookieService = inject(CookieService);

  // check if token is not null and if it is not null then add it to the header

  if(isPlatformBrowser(_PLATFORM_ID)){
    const token1 = _CookieService.get('socialToken');
    if (token1 !== null && token1 !== '') {
      req = req.clone({
        setHeaders: {
          token: token1,
          Authorization: `Bearer ${token1}`
        },
      });
    }
  }

  return next(req); // handle res
};
