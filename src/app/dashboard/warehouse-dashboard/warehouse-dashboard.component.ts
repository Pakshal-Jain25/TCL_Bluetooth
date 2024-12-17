
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavbarWarehouseComponent } from "../../common/navbar-warehouse/navbar-warehouse.component";

@Component({
  selector: 'app-warehouse-dashboard',
  standalone: true,
  imports: [RouterLink, NavbarWarehouseComponent],
  templateUrl: './warehouse-dashboard.component.html',
  styleUrl: './warehouse-dashboard.component.scss'
})
export class WarehouseDashboardComponent implements OnInit {
  selectedTab = 'all';

  deliveries = [
    { name: 'DVC-LORA', id: 'DVC01234', date: '18 Sep 2024', time: '10:30 am', status: 'working' },
    { name: 'DVC-LORA', id: 'DVC01235', date: '18 Sep 2024', time: '10:30 am', status: 'faulty' },
    { name: 'DVC-LORA', id: 'DVC01236', date: '18 Sep 2024', time: '10:30 am', status: 'pending' },
    { name: 'DVC-LORA', id: 'DVC01237', date: '18 Sep 2024', time: '10:30 am', status: 'working' },
    
  ];

  filteredDeliveries = this.deliveries;

  constructor() {}

  ngOnInit(): void {}

  filterDeliveries(status: string): void {
    this.selectedTab = status;

    if (status === 'all') {
      this.filteredDeliveries = this.deliveries;
    } else {
      this.filteredDeliveries = this.deliveries.filter(
        (delivery) => delivery.status === status
      );
    }
  }
}