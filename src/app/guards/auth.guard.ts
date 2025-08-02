import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '../core/services/cookie.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _PlatformID = inject(PLATFORM_ID);
  const _CookieService = inject(CookieService);
  
  // platform ID ---> isplatformborwser(id)    - isplatformserver(id) 
  if(isPlatformBrowser(_PlatformID)){
    if(_CookieService.check("socialToken")){
      return true;
    }
    else{
      _Router.navigate(['/login']);
      return false;
    }
  }
  else {
    return false;
  }
};
