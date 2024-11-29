import { RouterLink,Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar-deliveryguy',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-deliveryguy.component.html',
  styleUrl: './navbar-deliveryguy.component.scss'
})
export class NavbarDeliveryguyComponent {
  isProfileMenuOpen = false;
  isMenuOpen = false;

  constructor(private location: Location,private _router : Router,private authService: AuthService) {}

  // Toggle profile dropdown menu
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // Close profile menu
  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  // Toggle sidebar menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  LogOut()
  {
    this.authService.logout();
    this._router.navigate(['']);
  }

  // Back button functionality for sidebar menu
  goBack() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
