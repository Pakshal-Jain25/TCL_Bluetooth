import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Store token in local storage
  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Set current user in local storage
  setCurrentUser(user: { username: string; role: string }) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Logout user
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
