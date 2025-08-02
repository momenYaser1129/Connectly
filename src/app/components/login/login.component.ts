import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CookieService } from '../../core/services/cookie.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private _FormBuilder = inject(FormBuilder);
  private _AuthService = inject(AuthService);
  private _Router = inject(Router);
  private _CookieService = inject(CookieService);
  private _toastService = inject(ToastService);
  isLoading = false;
  showPassword = false; // Add this property to track password visibility

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required]],
    password: [
      null,
      [
        Validators.required,
      ],
    ],
  });

  // Add method to toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginSubmit(){
    // console.log(this.loginForm.value);
    // console.log(this.loginForm.valid);
    if(this.loginForm.valid){
      this.isLoading = true;
      this._AuthService.login(this.loginForm.value).subscribe({
        next:(res)=>{
          // console.log(res);
          if(res.message === "success"){

            // save token in secure cookie
            this._CookieService.set("socialToken", res.token, 7, "/", "", false, "Strict");
            this._toastService.success("Login successful", "Connectly");
            // Decode Token and save user data
            this._AuthService.saveUserData();

            // get user data
          

            this._Router.navigate(['/timeline']);
          }
          this.isLoading = false;
        },
        error:(err)=>{
          this._toastService.error("Invalid email or password", "Connectly");
          this.isLoading = false;
        }
      })
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }
}
