import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Router } from '@angular/router';
import { NavbarAdminComponent } from "../../common/navbar-admin/navbar-admin.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule,  NavbarAdminComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  // navigateTo(route: string) {
  //   this.router.navigate([`/${route}`]);
  // }
}
