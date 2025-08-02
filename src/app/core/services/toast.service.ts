import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      timeOut: 3500,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }
} 