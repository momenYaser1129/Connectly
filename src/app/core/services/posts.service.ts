import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Posts {

  constructor(private _HttpClient : HttpClient) { }

  createPost(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}posts`,data)
  }

  getAllPosts(page: number = 1, limit: number = 10):Observable<any>{
    return this._HttpClient.get(`${environment.apiUrl}posts?page=${page}&limit=${limit}`)
  }

  getMyPosts():Observable<any>{
    // id static 
    return this._HttpClient.get(`${environment.apiUrl}users/664bcf3e33da217c4af21f00/posts`)
  }
  getSinglePost(postId:string):Observable<any>{
    return this._HttpClient.get(`${environment.apiUrl}posts/${postId}`)
  }
  updatePost(postId:string,data:object):Observable<any>{
    return this._HttpClient.put(`${environment.apiUrl}posts/${postId}`,data)
  }
  deletePost(postId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.apiUrl}posts/${postId}`)
  }
  
}
