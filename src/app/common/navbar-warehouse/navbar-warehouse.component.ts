import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar-warehouse',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-warehouse.component.html',
  styleUrl: './navbar-warehouse.component.scss'
})
export class NavbarWarehouseComponent {
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

