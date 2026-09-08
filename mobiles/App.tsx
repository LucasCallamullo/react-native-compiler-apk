import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-zinc-900">

        <View className="flex-1 items-center justify-center bg-slate-900">
          <Text className="text-xl font-bold text-emerald-400">
            ¡NativeWind v4 funcionando en SDK 57! asd
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
