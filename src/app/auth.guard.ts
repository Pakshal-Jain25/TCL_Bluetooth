import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Class Guard(Till Angular 14):
// Requires a class and dependency injection through the constructor. 
// Example:
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: any): boolean {
//     const currentUser = this.authService.getCurrentUser();

//     if (!currentUser) {
//       this.router.navigate(['/login']); // Redirect to login if not authenticated
//       return false;
//     }

//     const expectedRole = route.data.expectedRole;

//     if (currentUser.role !== expectedRole) {
//       this.router.navigate(['/login']); // Redirect to login if role does not match
//       return false;
//     }

//     return true;
//   }
// } 

//Functional Guard (Angular 15 Onwards): Uses a function for guard logic and directly injects 
//services with inject() for a more concise implementation.
export const AuthGuard: CanActivateFn = (route, state) => 
{
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) 
  {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }

  const expectedRole = route.data?.['expectedRole'];

  if (currentUser.role !== expectedRole) 
  {
    router.navigate(['/login']); // Redirect to login if role does not match
    return false;
  }

  return true;
};
