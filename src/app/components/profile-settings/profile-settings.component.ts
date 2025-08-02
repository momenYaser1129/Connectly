import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from '../../core/services/cookie.service';
import { Users } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit  {
  userData:any;
  private _AuthService = inject(AuthService);
  userDataSubscription!:Subscription;
  showChangePassword = false;
  showOldPassword = false;
  showNewPassword = false;
  saveFile!:File;
  saveFileUrl!:string;
  private _FormBuilder = inject(FormBuilder)
  private _CookieService = inject(CookieService);
  private _UsersService = inject(Users);
  private _toastService = inject(ToastService);
  private spinner = inject(NgxSpinnerService);
  formChangePassword:FormGroup = this._FormBuilder.group({
    password:['',[Validators.required]],
    newPassword:['',[Validators.required]],
  })
  ngOnInit(): void {
    this.spinner.show();
    this.userDataSubscription = this._AuthService.getLoggedUserData().subscribe({
      next:(res)=>{
        this.userData = res.user;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      }
    })
  }


  changePassword(){
    this.spinner.show();
    this._AuthService.changePassword(this.formChangePassword.value).subscribe({
      next:(res)=>{
        // console.log(res);
          this._CookieService.set("socialToken",res.token,7,"/","",false,"Strict");
          this._toastService.success("Password changed successfully", "Connectly");
          this.spinner.hide();
        // console.log(this.formChangePassword.value);

      },
      error:(err)=>{
        this.spinner.hide();
        console.log(err);
      }
    })
    // console.log(this.formChangePassword.value);
  }
  changeImage(e:Event){
    const file = (e.target as HTMLInputElement).files?.[0];
    if(file){
      this.saveFile = file;
      // console.log(this.saveFile);
      this.saveFileUrl = URL.createObjectURL(this.saveFile);
      // console.log(this.saveFileUrl);
    }
    // this.updateProfile();
  }
  updateProfile(){
    this.spinner.show();
    const formData = new FormData();
    formData.append("photo",this.saveFile)
    this._UsersService.uploadProfileImage(formData).subscribe({
      next:(res)=>{
        // console.log(res);
          this._UsersService.setImage(this.saveFileUrl)
          this._toastService.success("Image updated successfully", "Connectly");
          this.spinner.hide();
        },
      error:(err)=>{
        this.spinner.hide();
        console.log(err);
      }
    })
  }
}
