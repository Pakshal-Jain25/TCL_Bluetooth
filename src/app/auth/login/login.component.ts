import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean = true;

  private users = {
    warehouse: { username: 'warehouse', password: 'warehouse', role: 'warehouse' },
    admin: { username: 'admin', password: 'admin', role: 'admin' },
    delivery: { username: 'delivery', password: 'delivery', role: 'delivery' },
    consumer: { username: 'consumer', password: 'consumer', role: 'consumer' },
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar) 
  {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  LoginUser() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      const user = this.users[username as keyof typeof this.users];
      if (user && user.password === password) {
        this.authService.storeToken(`${user.role}-token`);
        this.authService.setCurrentUser({ username, role: user.role });
        this.router.navigate([`/${user.role}-dashboard`]);
      } else {
        this._snackBar.open('Invalid username or password', 'OK', { duration: 2000 });
      }
    } else {
      this._snackBar.open('Please fill in all required fields', 'OK', { duration: 2000 });
    }
  }}
