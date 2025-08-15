import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private _FormBuilder = inject(FormBuilder)
  private _AuthService = inject(AuthService)
  private _Router = inject(Router)
  private _toastService = inject(ToastService);
  isLoading = false;
  


  registerForm :FormGroup = this._FormBuilder.group({
    name:[null,[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
    email:[null,[Validators.required,Validators.email]],
    password:[null,[Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*\-]).{8,}$/)]],
    rePassword:[null],
    dateOfBirth:[null,[Validators.required]],
    gender:[null,[Validators.required]]
  },
  {validators:this.confirmPassword});

  // methods 
  confirmPassword(g:AbstractControl){
   if(g.get("password")?.value === g.get("rePassword")?.value){
    return null;
   }
   return {mismatch:true}
  }


  registerSubmit(){
    // console.log(this.registerForm.value);
    // console.log(this.registerForm.valid);
    if(this.registerForm.valid){
      
      const birthDate = new Date(this.registerForm.get('dateOfBirth')?.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if(age < 16) {
        this._toastService.error("You must be at least 16 years old to create an account", "Connectly");
        return;
      }
      
      this.isLoading = true;
   this._AuthService.register(this.registerForm.value).subscribe({
    next:(res)=>{
      // console.log(res);
      if(res.message === "success"){
        this._toastService.success("Account created successfully", "Connectly");
        this._Router.navigate(['/login']);
      }
      this.isLoading = false;
    },
    error:(err)=>{
      this.isLoading = false;
      this._toastService.error("Account creation failed", "Connectly");
    }
   })
    }
    else {
      this.registerForm.markAllAsTouched();
      this.registerForm.setErrors({mismatch:true});
    }
  }

   // Val Class 
   getValidationClass(controlName: string): string {
  const control = this.registerForm.get(controlName);

  if (!control) return '';

  const passwordControl = this.registerForm.get('password');

  if (controlName === 'rePassword') {
    const passwordsMatch = control.value === passwordControl?.value;
    const passwordValid = passwordControl?.valid;

    if ((control.dirty || control.touched) && passwordsMatch && passwordValid) {
      return 'border-blue-500 focus:ring-blue-500';
    } else if ((control.dirty || control.touched)) {
      return 'border-red-500 focus:ring-red-500';
    }

    return '';
  }

  if ((control.dirty || control.touched) && control.invalid) {
    return 'border-red-500 focus:ring-red-500';
  }

  if ((control.dirty || control.touched) && control.valid) {
    return 'border-blue-500 focus:ring-blue-500';
  }

  return '';
}

  
}
