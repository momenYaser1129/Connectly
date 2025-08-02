import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router  } from '@angular/router';
import { CookieService } from '../core/services/cookie.service';
import { isPlatformBrowser } from '@angular/common';


export const loggedGuard: CanActivateFn = (route, state) => {
  // Global Object Browser window - document - localStorage location navigation 
  //=>>> Error: ReferenceError --- Guard - LifeCycle component - (SSR)
  // Sol => Check type GLobal Object !== undefiend 
    const _Router = inject(Router);
    const _CookieService = inject(CookieService);
    
    const _PlatformID = inject(PLATFORM_ID) ;
    if(isPlatformBrowser(_PlatformID)){

      if(_CookieService.check("socialToken")){
        _Router.navigate(['/timeline']);
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  
};
