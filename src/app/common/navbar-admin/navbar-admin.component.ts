import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss'
})
export class NavbarAdminComponent {
  isProfileMenuOpen = false;
  isMenuOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  LogOut() {
    this.authService.logout();
  }

  goBack() {
    this.isMenuOpen = false;  // Close the menu
  }
}

