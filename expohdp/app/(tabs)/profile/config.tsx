import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
import { ArrowLeft } from 'lucide-react-native';

export default function ConfigScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  const fgColor = getColor('text-fg');

  return (
    <ScreenCustom safeTop>
      <View className="flex-1 px-4">
        {/* Header with back button */}
        <View className="flex-row items-center gap-4 py-2 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={fgColor} size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold" style={{ color: fgColor }}>
            Configuración
          </Text>
        </View>

        {/* Content placeholder */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-fg-muted">Configuración - Próximamente</Text>
        </View>
      </View>
    </ScreenCustom>
  );
}