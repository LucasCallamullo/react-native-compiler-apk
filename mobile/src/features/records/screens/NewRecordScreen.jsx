import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { 
  Camera, 
  Video, 
  Mic, 
  FileText, 
  Smartphone, 
  MapPin, 
  Save, 
  XCircle, 
  PlusCircle 
} from 'lucide-react-native';

const RECORD_TYPES = [
  { id: 'PHOTO', label: 'Foto', icon: Camera, color: '#a855f7', text: 'Foto seleccionada · Tocá para capturar' },
  { id: 'VIDEO', label: 'Video', icon: Video, color: '#ef4444', text: 'Video seleccionado · Tocá para grabar' },
  { id: 'AUDIO', label: 'Audio', icon: Mic, color: '#f97316', text: 'Audio seleccionado · Tocá para grabar' },
  { id: 'NOTE', label: 'Nota', icon: FileText, color: '#22c55e', text: 'Nota seleccionada · Escribí tu texto' },
  { id: 'SCREENSHOT', label: 'Captura', icon: Smartphone, color: '#38bdf8', text: 'Captura seleccionada · Subí tu imagen' },
];

export default function NewRecordScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState('PHOTO');
  const [description, setDescription] = useState('');

  const activeRecord = RECORD_TYPES.find((r) => r.id === selectedType);
  const ActiveIcon = activeRecord?.icon || Camera;

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-2 mb-1">
        <PlusCircle color="#a855f7" size={24} />
        <Text className="text-xl font-bold text-zinc-100">Nuevo Registro</Text>
      </View>
      <Text className="text-sm text-zinc-400 mb-4">
        Seleccioná el tipo de evidencia que querés guardar
      </Text>

      {/* Selectores de Tipo */}
      <View className="flex-row justify-between mb-4">
        {RECORD_TYPES.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`w-[18%] rounded-2xl py-3 px-1 items-center border ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <IconComponent color={isSelected ? '#c084fc' : '#71717a'} size={22} />
              <Text
                className={`text-[10px] font-medium mt-1.5 ${
                  isSelected ? 'text-purple-300' : 'text-zinc-400'
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Previsualizador */}
      <TouchableOpacity className="bg-zinc-900 rounded-2xl h-36 items-center justify-center border border-dashed border-zinc-700 mb-4 px-4 active:bg-zinc-800/80">
        <View className="p-3 rounded-full bg-zinc-950 border border-zinc-800 mb-2">
          <ActiveIcon color={activeRecord?.color} size={28} />
        </View>
        <Text className="text-zinc-300 text-xs text-center font-medium">
          {activeRecord?.text}
        </Text>
      </TouchableOpacity>

      {/* Formulario */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
          Descripción (opcional)
        </Text>
        <TextInput
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
          placeholder="Agregá una descripción..."
          placeholderTextColor="#71717a"
          className="w-full p-3.5 border border-zinc-800 rounded-2xl text-sm bg-zinc-900 text-zinc-100"
          style={{ textAlignVertical: 'top' }}
        />
      </View>

      {/* Indicador de Ubicación */}
      <View className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-3 flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-2">
          <MapPin color="#34d399" size={18} />
          <View>
            <Text className="font-semibold text-emerald-400 text-xs">Ubicación actual</Text>
            <Text className="text-[11px] text-emerald-200/80">-34.6037, -58.3816 · CABA</Text>
          </View>
        </View>
        <View className="px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-700">
          <Text className="text-[10px] text-emerald-300 font-semibold">Activo</Text>
        </View>
      </View>

      {/* Botones */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity className="flex-1 bg-purple-600 py-3 rounded-full flex-row items-center justify-center gap-2 active:bg-purple-700">
          <Save color="#ffffff" size={18} />
          <Text className="text-white font-semibold">Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Inicio')}
          className="w-28 border border-zinc-700 bg-zinc-900 py-3 rounded-full flex-row items-center justify-center gap-1.5 active:bg-zinc-800"
        >
          <XCircle color="#a1a1aa" size={18} />
          <Text className="text-zinc-300 font-semibold">Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}