import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BluetoothService } from '../bluetooth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import spinner module
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bluetooth-device',
  standalone: true,
  imports: [RouterOutlet,CommonModule,MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './bluetooth-device.component.html',
  styleUrl: './bluetooth-device.component.scss'
})
export class BluetoothDeviceComponent {
  deviceId: string = ''; // Input field for deviceId
  deviceName: string = '';
  batteryLevel: number | null = null;
  manufacturer: string = '';
  isConnected: boolean = false;
  devices: any[] = [];
  deviceData: any;
  isScanning: boolean = false;
  connectingDevices: { [key: string]: boolean } = {}; // Track connecting state for each device
  private result : any;
  errorMessage: string | null = null; // Added error message property

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit() {
    // this.bluetoothService.getDeviceDataObservable().subscribe((data) => {
    //   if (data) {
    //     this.result = data; // Assign the JSON payload to a local variable
    //     console.log('Received device data:', this.result);
    //   }
    //   if (this.result !== undefined) 
    //   {
    //       this.isConnected = true;
    //       // this.deviceName = name;
    //       // this.deviceId = deviceId;
    //       this.errorMessage = this.result.error;
    //       this.manufacturer = this.result.manufacturerName;
    //       this.batteryLevel = this.result.batteryLevel;  
    //     // Store the connected device ID
    //   }
    // });

  }

  async scan() {
    this.isScanning = true; // Start spinner for scanning
    try {
      const result = await this.bluetoothService.scanForDevices();
      if (result && result.devices) {
        this.devices = result.devices; // Assign devices to a local variable
      }
    } catch (error) {
      console.error('Error scanning for devices:', error);
      this.errorMessage = 'Failed to scan for devices.';
    } finally {
      this.isScanning = false; // Stop spinner for scanning
    }
  }

  async connect(name: string,deviceId:string) {
    // var name : string = "Demo";
    this.deviceName = name;
    // var deviceId : string = "ABCDe";
    this.connectingDevices[deviceId] = true; // Start spinner for the specific device
    try {
      this.result = await this.bluetoothService.connectToDevice(deviceId);
      // await this.bluetoothService.connectToDevice(deviceId);
      // const result =           // Subscribe to the observable to get JSON data
      // this.bluetoothService.getDeviceDataObservable().subscribe((data) => {
      //   if (data) {
      //     this.result = data; // Assign the JSON payload to a local variable
      //     console.log('Received device data:', this.result);
      //   }
      // });
      console.log(this.result);
      // this.res = result;
      if (this.result !== undefined) 
      {
          this.isConnected = true;
          this.deviceName = name;
          this.deviceId = deviceId;
          this.errorMessage = this.result.error;
          this.manufacturer = this.result.manufacturerName;
          this.batteryLevel = this.result.batteryLevel;  
        // Store the connected device ID
      }
    } catch (error) {
      this.errorMessage = 'Connection failed: ' + (error || 'Unknown error');
      console.error('Connection failed:', error);
    } finally {
      this.connectingDevices[deviceId] = false;
    }
  }

  async disconnect() {
    try {
      await this.bluetoothService.disconnectDevice();
      this.isConnected = false;
      this.batteryLevel = null;
      this.deviceId = ''; // Clear the device ID on disconnect
    } catch (error) {
      this.errorMessage = 'Disconnection failed: ' + (error || 'Unknown error');
      console.error('Disconnection failed:', error);
    }
  }
}
