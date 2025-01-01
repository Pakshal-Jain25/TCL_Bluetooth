import { inject, Injectable } from '@angular/core';
// import {Bluetooth} from 'capacitor-plugin-bluetoothconnection'
import {Bluetooth} from 'capacitor-plugin-bluetoothbleconnection'

import mqtt from 'mqtt';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothConnectionService {
  // private client: mqtt.MqttClient;
  // private readonly brokerUrl: string = 'wss://192.168.29.253:9001'; // WebSocket connection to broker
  // private deviceDataSubject = new BehaviorSubject<any>(null); // Initialize the BehaviorSubject

  constructor() {
    // const options = {
    //   rejectUnauthorized: false, // This bypasses SSL verification (unsafe for production)
    //   // If you have a CA file, you can provide it here like:
    //   // ca: fs.readFileSync('/path/to/mqtt.crt')
    // };
  
    // this.client = mqtt.connect(this.brokerUrl,options);

    // this.client.on('connect', () => {
    //   console.log('Connected to MQTT broker');
    //   this.client.subscribe('home/device/data', (err) => {
    //     if (err) {
    //       console.log('Failed to subscribe: ', err);
    //     } else {
    //       console.log('Subscribed to topic');
    //     }
    //   });
    // });

    // this.client.on('message', (topic: string, message: Buffer) => {
    //   const payload = JSON.parse(message.toString()); // Parse the JSON data
    //   console.log("Payload:",payload);
    //   if (topic === 'home/device/data') {
    //     this.deviceDataSubject.next(payload); // Push the JSON data to BehaviorSubject
    //   }
    // });
  }

  async scanForDevices(): Promise<any> {
    try {
      const result = await Bluetooth.scanForDevices();
      return result;
    } catch (error) {
      console.error('Error scanning for devices', error);
    }
  }

  async connectToDevice(deviceAddress: string): Promise<any>{
    try {
      const result = await Bluetooth.connectToDevice({ deviceAddress });
      return result;
    } catch (error) {
      console.error('Error connecting to device', error);
    }
  }

  // getDeviceDataObservable(): Observable<any> {
  //   console.log('deviceDataSubject:', this.deviceDataSubject.asObservable());
  //   return this.deviceDataSubject.asObservable(); // Expose the observable to the component
  // }

  // publishData(topic: string, message: string) {
  //   this.client.publish(topic, message);
  // }

  async disconnectDevice(): Promise<void> {
    try {
      await Bluetooth.disconnectDevice();
    } catch (error) {
      console.error('Error disconnecting device', error);
    }
  }
}
