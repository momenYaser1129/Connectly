import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Users } from '../../core/services/users.service';
import { nextTick } from 'process';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  accountMenuOpen = false;
  userData:any={};
  demo :any ;
  private _AuthService = inject(AuthService);
  private _UsersService = inject(Users);
  userDataSubscription: any;

  ngOnInit(): void {
    // this._UsersService.getLoggedUserSub()
    this._AuthService.getLoggedUserData().subscribe({
      next: (res) => {

        this._UsersService.userDataSubject.next(res.user);
        
        // Subscribe to user data changes
        this.userDataSubscription = this._UsersService.userDataSubject.subscribe({
          next: (userData) => {
            // console.log('User data updated:', userData);
            console.log(userData);
            
            this.userData = userData;
            
          }
        });
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
   
    this._UsersService.image$.subscribe({
      next:(res)=>{
       if(res){
        this.userData.photo = res;
       }
      }
    })
  }
    
  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  onSignOut() {
    this.userData = null;
    this._UsersService.userDataSubject.next(null);
    this._AuthService.signOut();
  }
}
