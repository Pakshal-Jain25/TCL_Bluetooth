import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarDeliveryguyComponent } from "../../common/navbar-deliveryguy/navbar-deliveryguy.component";

@Component({
  selector: 'app-deliveryguy-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarDeliveryguyComponent, RouterLink, RouterOutlet],
  templateUrl: './deliveryguy-dashboard.component.html',
  styleUrls: ['./deliveryguy-dashboard.component.scss']
})
export class DeliveryguyDashboardComponent implements OnInit {
  selectedStatus: string = 'pending';
  deliveries = [
    { name: 'Priya Verma', id: 'CN01234', address: 'Flat 12, Tower B, Shanti Apartments, MG Road, Bengaluru, Karnataka - 560001', status: 'pending' },
    { name: 'Rajesh Kumar', id: 'CN01235', address: 'Flat 15, Tower B, Shanti Apartments, MG Road, Bengaluru, Karnataka - 560001', status: 'completed' },
    // Add more delivery items here
  ];

  filteredDeliveries = this.deliveries;

  constructor() { }

  ngOnInit(): void {}

  // Filter deliveries based on status (pending or completed)
  filterDeliveries(status: string): void {
    this.selectedStatus = status;
    this.filteredDeliveries = this.deliveries.filter(delivery => delivery.status === status);
  }
}
