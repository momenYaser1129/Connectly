import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _HttpClient : HttpClient) { }


 createComment(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}comments`,data)
  }
  getPostComments(postId:string):Observable<any>{
    return this._HttpClient.get(`${environment.apiUrl}posts/${postId}/comments`)
  }
  updatePostComment(commentId:string,data:object):Observable<any>{
    // id for Comment 
    return this._HttpClient.put(`${environment.apiUrl}comments/${commentId}`,data)
  }
  deleteComment(commentId:string):Observable<any>{
    // id for Comment 
    return this._HttpClient.delete(`${environment.apiUrl}comments/${commentId}`)
  }
}
