import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../../common/navbar/navbar.component";

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.scss'
})
export class ComplaintComponent
{
  complaintForm: FormGroup;
  complaintHistory = [
    { date: '10/09/2024', subject: 'Battery Issue', status: 'Pending' },
    { date: '9/09/2024', subject: 'Connection Issue', status: 'Completed' },
  ];

  constructor(private fb: FormBuilder) {
    this.complaintForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
      attachments: ['']
    });
  }

  onSubmitComplaint() {
    if (this.complaintForm.valid) {
      const newComplaint = {
        date: new Date().toLocaleDateString(),
        subject: this.complaintForm.value.subject,
        status: 'Pending'
      };
      this.complaintHistory.unshift(newComplaint);
      this.complaintForm.reset();
    }
  }
}
