import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Users } from '../../core/services/users.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent {
  mobileMenuOpen = false;
  accountMenuOpen = false;
  userData:any={};
  private _AuthService = inject(AuthService);
  private _UsersService = inject(Users);
  ngOnInit(): void {
    this._AuthService.getLoggedUserData().subscribe({
      next:(res)=>{
        this.userData = res.user;
      },
      error:(err)=>{
        console.log(err)  ;
      }
    })
    this._UsersService.image$.subscribe({
      next:(res)=>{
       if(res){
        this.userData.photo = res;
       }
      }
    })
  }
    
  

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  onSignOut() {
    this.userData = null;
    this._AuthService.signOut();
  }
}
