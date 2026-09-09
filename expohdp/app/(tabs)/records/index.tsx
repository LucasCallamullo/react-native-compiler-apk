import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenCustom } from '@shared/components/ScreenCustom';
import { useAppTheme } from '@shared/context/ThemeProvider';
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

const RECORD_TYPES = [
  { id: 'PHOTO', label: 'Foto', icon: Camera },
  { id: 'VIDEO', label: 'Video', icon: Video },
  { id: 'AUDIO', label: 'Audio', icon: Mic },
  { id: 'NOTE', label: 'Nota', icon: FileText },
  { id: 'SCREENSHOT', label: 'Captura', icon: Smartphone },
];

export default function CreateRecordScreen() {
  const router = useRouter();
  const { getColor } = useAppTheme();

  // Dynamic colors from theme
  const fgColor = getColor('text-fg');
  const fgMutedColor = getColor('text-fg-muted');
  const cardBgColor = getColor('bg-card');
  const borderColor = getColor('border-border');
  const primaryColor = getColor('text-primary');
  const primaryFgColor = getColor('text-primary-fg');
  const purpleLightColor = getColor('bg-purple-light');
  const purpleBgColor = getColor('bg-purple-bg');
  const purpleBorderColor = getColor('border-purple');

  // Status colors
  const successColor = getColor('text-success');
  const successBgColor = getColor('bg-success');
  const successBorderColor = getColor('border-success');
  const errorColor = getColor('text-error');
  const errorBgColor = getColor('bg-error');
  const errorBorderColor = getColor('border-error');
  const warningColor = getColor('text-warning');
  const warningBgColor = getColor('bg-warning');
  const warningBorderColor = getColor('border-warning');
  const infoColor = getColor('text-info');
  const infoBgColor = getColor('bg-info');
  const infoBorderColor = getColor('border-info');

  const [selectedType, setSelectedType] = useState('PHOTO');
  const [description, setDescription] = useState('');

  const activeRecord = RECORD_TYPES.find((r) => r.id === selectedType);
  const ActiveIcon = activeRecord?.icon || Camera;

  // Color mapping for record types
  const typeColors: Record<string, string> = {
    PHOTO: primaryColor,
    VIDEO: errorColor,
    AUDIO: warningColor,
    NOTE: successColor,
    SCREENSHOT: infoColor,
  };

  const activeColor = typeColors[selectedType] || primaryColor;

  return (
    <ScreenCustom safeTop>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2 mb-1">
          <PlusCircle color={primaryColor} size={24} />
          <Text className="text-xl font-bold" style={{ color: fgColor }}>
            Nuevo Registro
          </Text>
        </View>
        <Text className="text-sm mb-4" style={{ color: fgMutedColor }}>
          Seleccioná el tipo de evidencia que querés guardar
        </Text>

        {/* Type Selectors */}
        <View className="flex-row justify-between mb-4">
          {RECORD_TYPES.map((type) => {
            const IconComponent = type.icon;
            const isSelected = selectedType === type.id;
            const color = typeColors[type.id] || primaryColor;

            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className="w-[18%] rounded-2xl py-3 px-1 items-center border active:opacity-70"
                style={{
                  backgroundColor: isSelected ? purpleBgColor : cardBgColor,
                  borderColor: isSelected ? purpleBorderColor : borderColor,
                }}
              >
                <IconComponent
                  color={isSelected ? purpleLightColor : fgMutedColor}
                  size={22}
                />
                <Text
                  className="text-[10px] font-medium mt-1.5"
                  style={{
                    color: isSelected ? purpleLightColor : fgMutedColor,
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Preview */}
        <TouchableOpacity
          className="rounded-2xl h-36 items-center justify-center border border-dashed mb-4 px-4 active:opacity-70"
          style={{
            backgroundColor: cardBgColor,
            borderColor: borderColor,
          }}
        >
          <View
            className="p-3 rounded-full border mb-2"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <ActiveIcon color={activeColor} size={28} />
          </View>
          <Text className="text-xs text-center font-medium" style={{ color: fgColor }}>
            {selectedType === 'PHOTO' && 'Foto seleccionada · Tocá para capturar'}
            {selectedType === 'VIDEO' && 'Video seleccionado · Tocá para grabar'}
            {selectedType === 'AUDIO' && 'Audio seleccionado · Tocá para grabar'}
            {selectedType === 'NOTE' && 'Nota seleccionada · Escribí tu texto'}
            {selectedType === 'SCREENSHOT' && 'Captura seleccionada · Subí tu imagen'}
          </Text>
        </TouchableOpacity>

        {/* Form */}
        <View className="mb-4">
          <Text
            className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
            style={{ color: fgMutedColor }}
          >
            Descripción (opcional)
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            placeholder="Agregá una descripción..."
            placeholderTextColor={fgMutedColor}
            className="w-full p-3.5 border rounded-2xl text-sm"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
              color: fgColor,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Location Indicator */}
        <View
          className="rounded-2xl p-3 flex-row items-center justify-between mb-6 border"
          style={{
            backgroundColor: successBgColor,
            borderColor: successBorderColor,
          }}
        >
          <View className="flex-row items-center gap-2">
            <MapPin color={successColor} size={18} />
            <View>
              <Text className="font-semibold text-xs" style={{ color: successColor }}>
                Ubicación actual
              </Text>
              <Text className="text-[11px]" style={{ color: fgMutedColor }}>
                -34.6037, -58.3816 · CABA
              </Text>
            </View>
          </View>
          <View
            className="px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: successBgColor,
              borderColor: successBorderColor,
            }}
          >
            <Text className="text-[10px] font-semibold" style={{ color: successColor }}>
              Activo
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-80"
            style={{ backgroundColor: primaryColor }}
          >
            <Save color={primaryFgColor} size={18} />
            <Text className="text-primary-fg font-semibold">Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-28 py-3 rounded-full flex-row items-center justify-center gap-1.5 border active:opacity-70"
            style={{
              backgroundColor: cardBgColor,
              borderColor: borderColor,
            }}
          >
            <XCircle color={fgMutedColor} size={18} />
            <Text className="font-semibold" style={{ color: fgMutedColor }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenCustom>
  );
}