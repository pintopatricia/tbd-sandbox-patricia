import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import BootSplash from 'react-native-bootsplash';

export const hideSplash = (): void => { 
  if (Platform.OS === 'android') {
    SplashScreen.hide();
  } else {
    BootSplash.hide();
  }
}
