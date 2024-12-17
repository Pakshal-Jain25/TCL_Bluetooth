import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

import { RouterLink,Router } from '@angular/router';
import { BarcodeFormat, DecodeHintType} from '@zxing/library';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements AfterViewInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef<HTMLDivElement>;

  constructor(private _router:Router) {
    // Define the barcode formats to be supported by the reader
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.AZTEC,
      BarcodeFormat.PDF_417,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8
    ]);

    this.codeReader = new BrowserMultiFormatReader(hints); // Pass the supported formats to the reader
  }

  private codeReader = new BrowserMultiFormatReader();
  scanResult: string | null = null;
  isScanning = false;

  async ngAfterViewInit() {
    if (this.isNativePlatform()) {
      await this.startCamera();
    } else {
      this.setupWebQrCodeScanner();
    }
  }

  async startCamera() {
    try {
      // Request access to the camera
      await Camera.requestPermissions({
        permissions: ['camera']
      });
  
      const video = this.videoElement.nativeElement;
  
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
  
      const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
  
      const constraints = rearCamera
        ? { video: { deviceId: rearCamera.deviceId } }
        : { video: { facingMode: 'environment' } };
  
      video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
      video.setAttribute('playsinline', 'true');
      video.play();
  
      this.codeReader.decodeFromVideoDevice(null, video, (result: Result | null, error: any) => {
        if (result) {
          this.scanResult = result.getText();
          // console.log('QR Code scanned:', this.scanResult);
          if(this.scanResult != undefined)
          {
            this._router.navigate(['/bluetooth-device'])
          }
          this.stopCamera();
        } else if (error) {
          // console.error('QR Scanner error:', error);
        }
      });
    } catch (e) {
      console.error('Camera error:', e);
    }
  }

  setupWebQrCodeScanner() {
    if (!this.qrCodeContainer.nativeElement) {
      console.error('QR Code container not found.');
      return;
    }

    console.log('Web QR Code Scanner setup');
  }

  startScan() {
    this.isScanning = true;
    if (this.isNativePlatform()) {
      this.startCamera();
    } else {
      this.setupWebQrCodeScanner();
    }
  }

  stopScan() {
    this.stopCamera();
  }

  stopCamera() {
    if (this.videoElement.nativeElement.srcObject) {
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    this.videoElement.nativeElement.srcObject = null;
    this.isScanning = false;
  }

  isNativePlatform(): boolean {
    const platform = navigator.userAgent.toLowerCase();
    return platform.includes('ios') || platform.includes('android');
  }
}
