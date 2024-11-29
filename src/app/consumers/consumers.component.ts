import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consumers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './consumers.component.html',
  styleUrl: './consumers.component.scss'
})
export class ConsumersComponent {
  step: number = 1;
  mobileForm: FormGroup;
  otpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.mobileForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  onNext() {
    if (this.mobileForm.valid) {
      this.step = 2;
    }
  }

  onSubmitOTP() {
    if (this.otpForm.valid) {
      console.log('OTP submitted:', this.otpForm.value.otp);
    }
  }

  onBack() {
    this.step = 1;
  }

}
