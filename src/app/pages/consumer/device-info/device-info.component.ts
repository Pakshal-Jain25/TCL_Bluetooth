import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../common/navbar/navbar.component";


@Component({
  selector: 'app-device-info',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './device-info.component.html',
  styleUrl: './device-info.component.scss'
})

export class DeviceInfoComponent implements OnInit {
  // Variables to hold device info values, initialized as empty or with placeholder values
  lastUpdate: string = '';
  currentConsumption: string = '';
  cumulativeConsumption: string = '';
  flowRate: string = '';
  temperature: string = '';
  pressure: string = '';
  battery: string = '';
  status: string = '';

  constructor() {}

  ngOnInit(): void {
    // Leave fields empty for now; you can populate this method with actual fetching logic later
    this.resetDeviceInfo();
  }

  resetDeviceInfo(): void {
    this.lastUpdate = '';
    this.currentConsumption = '';
    this.cumulativeConsumption = '';
    this.flowRate = '';
    this.temperature = '';
    this.pressure = '';
    this.battery = '';
    this.status = '';
  }
}
