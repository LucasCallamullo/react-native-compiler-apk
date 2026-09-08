import { registerRootComponent } from 'expo';

// Entry point for NativeWind v4 global stylesheet.
// Must be imported before App component initialization to inject Tailwind utilities.
import "@/global.css";

import App from '@/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately.
registerRootComponent(App);