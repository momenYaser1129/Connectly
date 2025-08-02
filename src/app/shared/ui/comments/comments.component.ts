import { AuthService } from './../../../core/services/auth.service';
import { Users } from './../../../core/services/users.service';
import { CommentCreator } from './../../../core/interfaces/icomment';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentService } from '../../../core/services/comments.service';
import { IComment } from '../../../core/interfaces/icomment';
import { DatePipe, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgClass],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly _AuthService = inject(AuthService);
  private readonly _commentsService = inject(CommentService);
  private readonly _usersService = inject(Users);
  private readonly _fb = inject(FormBuilder);
  private readonly _toastService = inject(ToastService);
  @Input({ required: true }) postId!: string;
 
  //services
  comments: IComment[] = [];
  userData:any;
  commentForm!: FormGroup;
  openCommentDropdownId: string | null = null;
  editingComment: IComment | null = null;
isLoading = true;
  ngOnInit(): void {
    this.commentForm = this._fb.group({
      content: ['', [Validators.required]],
      post: [this.postId],
    });

    this._commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.comments = res.comments.reverse();
        // console.log(res);
        
        
      },
      error:(err)=>{
        console.log(err);
        this.isLoading = false;
      }
    });
    this._AuthService.getLoggedUserData().subscribe({
      next:(res)=>{
        // console.log(res);
        this.userData = res.user;
        // this._AuthService.userData = res.user;
        // console.log(this.userData);
      },
      error:(err)=>{
        console.log(err)  ;
      }
    })
    this._usersService.image$.subscribe({
      next:(res)=>{
       if(res){
        this.userData.photo = res;
        console.log(this.userData);
       }
      }
    })
  }

  toggleCommentDropdown(commentId: string): void {
    if (this.openCommentDropdownId === commentId) {
      this.openCommentDropdownId = null; // Close dropdown if already open
    } else {
      this.openCommentDropdownId = commentId; // Open the clicked dropdown
    }
  }

  editComment(comment: IComment): void {
    this.editingComment = comment;
    this.commentForm.get('content')?.setValue(comment.content);
    this.openCommentDropdownId = null;
    // Scroll to comment form and focus on it
    document.getElementById('chat')?.focus();
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.commentForm.get('content')?.reset();
  }

  deleteComment(commentId: string): void {
    this._commentsService.deleteComment(commentId).subscribe({
      next: (res) => {
        // Remove the deleted comment from the comments array
        this.comments = this.comments.filter(comment => comment._id !== commentId);
        this.openCommentDropdownId = null;
        this._toastService.success("Comment deleted successfully", "Connectly");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addComment() {
    if (this.editingComment) {
      // Update existing comment
      this._commentsService.updatePostComment(this.editingComment._id, {
        content: this.commentForm.get('content')?.value
      }).subscribe({
        next: (res) => {
          // Update the comment in the comments array
          const index = this.comments.findIndex(c => c._id === this.editingComment?._id);
          if (index !== -1) {
            this.comments[index] = res.comment;
          }
          this.commentForm.get('content')?.reset();
          this.editingComment = null;
          this._toastService.success("Comment updated successfully", "Connectly");
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      // Add new comment
      this._commentsService.createComment(this.commentForm.value).subscribe({
        next: (res) => {
          this.comments = res.comments.reverse();
          this.commentForm.get('content')?.reset();
          this._toastService.success("Comment added successfully", "Connectly");
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}

