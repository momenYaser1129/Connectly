import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private imageSubject = new BehaviorSubject<string>("")
    
  image$ = this.imageSubject.asObservable();

  setImage(image:string){
    this.imageSubject.next(image)
  }
  getImage(){
    return this.imageSubject.getValue()
  }

  constructor(private _HttpClient : HttpClient) { }

  signUp(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}users/signup`,data)
  }
  signIn(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}users/signin`,data)
  }
  changePassword(data:object):Observable<any>{
    return this._HttpClient.patch(`${environment.apiUrl}users/change-password`,data)
  }
  uploadProfileImage(data:object):Observable<any>{
    return this._HttpClient.put(`${environment.apiUrl}users/upload-photo`,data)
  }
  getLoggedUserData():Observable<any>{
    return this._HttpClient.get(`${environment.apiUrl}users/profile-data`)
  }

   
}
