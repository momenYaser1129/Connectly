import { FormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommentsComponent } from '../../shared/ui/comments/comments.component';
import { DatePipe } from '@angular/common';
import { IPost } from '../../core/interfaces/ipost';
import { Posts } from '../../core/services/posts.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';  
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-myposts',
  standalone: true,
  imports: [CommentsComponent, DatePipe, FormsModule],
  templateUrl: './myposts.component.html',
  styleUrl: './myposts.component.css',
})
export class MypostsComponent implements OnInit{
  myPosts: IPost[] = [];
  SubDestroy!: Subscription;
  openDropdownId: string | null = null;
  dropDownPostUpdate: string | null = null;
  isCreateModalOpen: boolean = false;
  postIdData: string = '';
  postBodyDataUpdate: string = '';
  isLoading = true;
  isEmptyLoading = false;
  visibleComments: Set<string> = new Set<string>();
  
  private _PostsService = inject(Posts);
  private spinner = inject(NgxSpinnerService);
  private _toastService = inject(ToastService);
  ngOnInit(): void {
    this.fetchMyPosts()
  }

  fetchMyPosts(){
    this.isEmptyLoading = true;
    this.spinner.show();
    this.SubDestroy = this._PostsService.getMyPosts().subscribe({
      next: (res) => {
        this.spinner.hide();
        this.myPosts = res.posts.reverse();
        this.isEmptyLoading = false;
      },
      error: (err) => {
        this.spinner.hide();
        this.isEmptyLoading = false;
        console.log(err);
      },
    });
  }
  toggleDropdown(postId: string): void {
    this.openDropdownId = this.openDropdownId === postId ? null : postId;
  }
  toggleDropdownUpdate(postId: string): void {
    this.dropDownPostUpdate =
      this.dropDownPostUpdate === postId ? null : postId;
  }
  
  // Toggle comments visibility
  toggleComments(postId: string): void {
    if (this.visibleComments.has(postId)) {
      this.visibleComments.delete(postId);
    } else {
      this.visibleComments.add(postId);
    }
  }
  
  // Check if comments are visible for a post
  isCommentsVisible(postId: string): boolean {
    return this.visibleComments.has(postId);
  }
  
  deletePost(id: string) {
    this._PostsService.deletePost(id).subscribe({
      next: (res) => {
        // console.log(res);
        this._toastService.success("Post deleted successfully", "Connectly");
        this.myPosts = this.myPosts.filter((post) => post._id !== id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updatePostOne(postBody: string, postId: string) {
    this.postBodyDataUpdate = postBody;
    this.postIdData = postId;
    // console.log(this.postBodyData);
    // console.log(this.postIdData);
  }
  updatePostTwo() {
    const formData = new FormData();
    formData.append('body', this.postBodyDataUpdate);

    this._PostsService.updatePost(this.postIdData, formData).subscribe({
      next: (res) => {
        // console.log(res);
        this._toastService.success("Post updated successfully", "Connectly");
        this.fetchMyPosts()
        this.isCreateModalOpen=false
        this.postBodyDataUpdate = ''
      },
      error:(err)=>{
        console.log(err);
        
      }
    });
  }
}
