import 'react-native-url-polyfill/auto'; // 👈 EARLY injection is critical
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
