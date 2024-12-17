import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../../common/navbar/navbar.component";

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './consumer-dashboard.component.html',
  styleUrls: ['./consumer-dashboard.component.scss']
})
export class ConsumerDashboardComponent {
  isProfileMenuOpen = false;
  isMenuOpen = false;

  constructor(private location: Location) {}

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

  // Back button functionality for sidebar menu
  goBack() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
