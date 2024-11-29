import { Component } from '@angular/core';
import { NavbarComponent } from "../../../common/navbar/navbar.component";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alerts = [
    { message: 'Low Battery: Meter #1234', time: '2 hours ago' },
    { message: 'High Gas Consumption: Meter #1234', time: '1 day ago' },
    { message: 'Communication Fault: Meter #1234', time: '2 days ago' }
  ];

  description = "Battery level dropped below 20%. Please schedule maintenance.";
}
