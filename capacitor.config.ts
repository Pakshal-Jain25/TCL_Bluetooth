import { CameraResultType } from '@capacitor/camera';
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tatacommunication.fe_regulator',
  appName: 'Fe-Regulator',
  webDir: 'dist/tata/browser', // Update this if your build output directory differs
  bundledWebRuntime: false, // Set to true if you want to bundle the Capacitor web runtime
  plugins: {
    Camera: {
      // Add any necessary configuration for the Camera plugin
      // For example:
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    },
    // Add other plugin configurations here if needed
  },
  android: {
    // Android-specific settings can be added here
    // For example:
    // allowMixedContent: true,
  },
  ios: {
    // iOS-specific settings can be added here
    // For example:
    // contentInset: 'always',
  }
};

export default config;
