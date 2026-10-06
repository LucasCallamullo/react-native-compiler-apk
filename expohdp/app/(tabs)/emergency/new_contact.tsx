import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Camera, Siren, Folder, Share2, Mic, ClipboardList, Rabbit, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { ScreenCustom } from '@shared/components/ScreenCustom';

export default function ContactNewScreen() {
  return (
    <ScreenCustom safeTop>
      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
      >

          <View className="flex-1 bg-surface-0 p-4 justify-center items-center">
            <Text className="text-content text-lg font-bold">Agregar Nuevo Contacto</Text>
          </View>

      </ScrollView>
    </ScreenCustom>
  );
}