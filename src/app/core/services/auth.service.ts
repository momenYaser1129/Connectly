import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:any;

  constructor(private _http:HttpClient, private _Router:Router, private _CookieService:CookieService) { }
  
  register(data:any):Observable<any>{
    return this._http.post(`${environment.apiUrl}users/signup`,data)
  }
  login(data:any):Observable<any>{
    return this._http.post(`${environment.apiUrl}users/signin`,data)
  }
  saveUserData():void {
    const token = this._CookieService.get("socialToken");
    if(token){
      this.userData = jwtDecode(token);
      // console.log(this.userData);
    }
  }

  getLoggedUserData():Observable<any>{
    return this._http.get(`${environment.apiUrl}users/profile-data`)
  }

  signOut():void {
    this._CookieService.delete("socialToken");
    this.userData = null;
    this._Router.navigate(['/login']);
  }
  changePassword(data:any):Observable<any>{
    return this._http.patch(`${environment.apiUrl}users/change-password`,data)
  }
}
