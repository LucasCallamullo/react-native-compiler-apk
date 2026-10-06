import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme, type ThemeVarName } from '@shared/context/ThemeProvider';
import {
  Camera,
  Video,
  Mic,
  FileText,
  Smartphone,
  MapPin,
  Save,
  XCircle,
  PlusCircle,
} from 'lucide-react-native';

type RecordTypeId = 'PHOTO' | 'VIDEO' | 'AUDIO' | 'NOTE' | 'SCREENSHOT';

interface RecordTypeDef {
  id: RecordTypeId;
  label: string;
  icon: React.ComponentType<{ color: string; size: number }>;
}

const RECORD_TYPES: RecordTypeDef[] = [
  { id: 'PHOTO', label: 'Foto', icon: Camera },
  { id: 'VIDEO', label: 'Video', icon: Video },
  { id: 'AUDIO', label: 'Audio', icon: Mic },
  { id: 'NOTE', label: 'Nota', icon: FileText },
  { id: 'SCREENSHOT', label: 'Captura', icon: Smartphone },
];

// Mapeo tipo → variable CSS (para el ícono del preview)
const typeVarMap: Record<RecordTypeId, ThemeVarName> = {
  PHOTO: '--color-main-500',
  VIDEO: '--color-error',
  AUDIO: '--color-warning',
  NOTE: '--color-success',
  SCREENSHOT: '--color-info',
};

export default function CreateRecordScreen() {
  const router = useRouter();
  const { getVar } = useAppTheme();

  // Colores para props nativas (íconos, TextInput)
  const primaryColor = getVar('--color-main-500');
  const mainFgColor = getVar('--color-main-700');
  const mutedColor = getVar('--color-content-muted');
  const contentColor = getVar('--color-content');
  const successColor = getVar('--color-success');

  const [selectedType, setSelectedType] = useState<RecordTypeId>('PHOTO');
  const [description, setDescription] = useState('');

  const activeRecord = RECORD_TYPES.find((r) => r.id === selectedType);
  const ActiveIcon = activeRecord?.icon ?? Camera;
  const activeColor = getVar(typeVarMap[selectedType]);

  const previewText: Record<RecordTypeId, string> = {
    PHOTO: 'Foto seleccionada · Tocá para capturar',
    VIDEO: 'Video seleccionado · Tocá para grabar',
    AUDIO: 'Audio seleccionado · Tocá para grabar',
    NOTE: 'Nota seleccionada · Escribí tu texto',
    SCREENSHOT: 'Captura seleccionada · Subí tu imagen',
  };

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-1">
          <PlusCircle color={primaryColor} size={24} />
          <Text className="text-xl font-bold text-content">Nuevo Registro</Text>
        </View>
        <Text className="text-sm mb-4 text-content-muted">
          Seleccioná el tipo de evidencia que querés guardar
        </Text>

        {/* Type Selectors */}
        <View className="flex-row justify-between mb-4">
          {RECORD_TYPES.map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className={`w-[18%] rounded-2xl py-3 px-1 items-center border active:opacity-70 ${
                  isSelected
                    ? 'bg-main-700 border-main-500'
                    : 'bg-surface-1 border-border'
                }`}
              >
                <IconComponent
                  color={isSelected ? primaryColor : mutedColor}
                  size={22}
                />
                <Text
                  className={`text-[10px] font-medium mt-1.5 ${
                    isSelected ? 'text-main-500' : 'text-content-muted'
                  }`}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preview */}
        <TouchableOpacity className="rounded-2xl h-36 items-center justify-center border border-dashed mb-4 px-4 active:opacity-70 bg-surface-1 border-border">
          <View className="p-3 rounded-full border mb-2 bg-surface-1 border-border">
            <ActiveIcon color={activeColor} size={28} />
          </View>
          <Text className="text-xs text-center font-medium text-content">
            {previewText[selectedType]}
          </Text>
        </TouchableOpacity>

        {/* Form */}
        <View className="mb-4">
          <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-content-muted">
            Descripción (opcional)
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            placeholder="Agregá una descripción..."
            placeholderTextColor={mutedColor}
            className="w-full p-3.5 border rounded-2xl text-sm bg-surface-1 border-border text-content"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Location Indicator */}
        <View className="rounded-2xl p-3 flex-row items-center justify-between mb-6 border bg-success-bg border-success-border">
          <View className="flex-row items-center gap-2">
            <MapPin color={successColor} size={18} />
            <View>
              <Text className="font-semibold text-xs text-success-fg">
                Ubicación actual
              </Text>
              <Text className="text-[11px] text-content-muted">
                -34.6037, -58.3816 · CABA
              </Text>
            </View>
          </View>
          <View className="px-2.5 py-1 rounded-full border bg-success-bg border-success-border">
            <Text className="text-[10px] font-semibold text-success-fg">Activo</Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity className="flex-1 py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-80 bg-main-500">
            <Save color={mainFgColor} size={18} />
            <Text className="text-main-fg font-semibold">Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-28 py-3 rounded-full flex-row items-center justify-center gap-1.5 border active:opacity-70 bg-surface-1 border-border"
          >
            <XCircle color={mutedColor} size={18} />
            <Text className="font-semibold text-content-muted">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}