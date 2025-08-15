import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IPost } from '../../core/interfaces/ipost';
import { DatePipe } from '@angular/common';
import { CommentsComponent } from '../../shared/ui/comments/comments.component';
import { Posts } from '../../core/services/posts.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Users } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe, CommentsComponent, FormsModule, InfiniteScrollModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit {
  //services
  private readonly _postsService = inject(Posts);
  private readonly _AuthService = inject(AuthService);
  private readonly _UsersService = inject(Users); 
  private readonly _flowbiteService = inject(FlowbiteService);
  private readonly _toastService = inject(ToastService);
  posts: IPost[] = [];
  saveFile!: File // image file Selected
  content: string = '';
  subDestroy!: Subscription;
  userData :any ;
  saveFileUrl!:string;
  loading:boolean = false;
  
  // Track which posts have comments visible
  visibleComments: { [postId: string]: boolean } = {};
  
  // Pagination params
  page: number = 3;
  limit: number = 10;
  isLoading: boolean = false;
  hasMorePosts: boolean = true;
  
  ngOnInit(): void {
    this._UsersService.userDataSubject.subscribe({
      next:(res)=>{
        this.userData = res;
   
      },
      error:(err)=>{
        console.log(err)  ;
      }
    })
    this.getAllPosts();
    this._UsersService.image$.subscribe({
      next:(res)=>{
       if(res){
        this.userData.photo = res;
       }
      }
    });
    
    // Initialize Flowbite
    this.initFlowbite();
  }
  

  // Initialize Flowbite components
  initFlowbite(): void {
    this._flowbiteService.loadFlowbite((flowbite) => {
      // Initialize all Flowbite components
      flowbite.initModals();
      flowbite.initDropdowns();
    });
  }
  
  getAllPosts() {
    if (this.isLoading || !this.hasMorePosts) return;
    
    this.isLoading = true;
    
    this.subDestroy = this._postsService.getAllPosts(this.page, this.limit).subscribe({
      next: (res) => {
        if (this.page === 3) {
          this.posts = res.posts;
          this.isLoading = false;
        } else {
          this.posts = [...this.posts, ...res.posts];
        }
        
        // Check if we have more posts to load
        this.hasMorePosts = res.posts.length === this.limit;
        
        // Initialize all posts with comments hidden
        res.posts.forEach((post: IPost) => {
          this.visibleComments[post._id] = false;
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onScroll() {
    if (!this.isLoading && this.hasMorePosts) {
      this.page++;
      this.getAllPosts();
    }
  }
  
  changeImage(e: Event) {
    const input = e.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      this.saveFile = input.files[0];
      console.log(this.saveFile);
      this.saveFileUrl = URL.createObjectURL(this.saveFile);
      console.log(this.saveFileUrl);
    }
  }

  createPost() {
    // create from Data
    this.loading = true;
    const formData = new FormData();
    formData.append('body', this.content);
    if(this.saveFile) {
      formData.append('image', this.saveFile);
    }
    
    this._postsService.createPost(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this._toastService.success("Post created successfully", "Connectly");
        this.content = '';
        this.saveFile = null as any;
        this.saveFileUrl = '';
        this.page = 3;
        this.getAllPosts();
        this.closeModal();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }
  
  closeModal() {
    const closeButton = document.querySelector('[data-modal-hide="authentication-modal"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    } else {
      const modal = document.getElementById('authentication-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }
    this.saveFileUrl = '';
    this.saveFile = null as any;
  }

  toggleComments(postId: string) {
    this.visibleComments[postId] = !this.visibleComments[postId];
  }
  
  isCommentsVisible(postId: string): boolean {
    return this.visibleComments[postId] || false;
  }

  removeImage() {
    this.saveFileUrl = '';
    this.saveFile = null as any;
  }
}
