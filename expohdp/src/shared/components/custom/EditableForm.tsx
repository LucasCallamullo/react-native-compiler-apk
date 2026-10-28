import { TextInput, View, Text } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function EditableForm({ value, onChangeText }: Props) {
  return (
    <View>
      <Text className="text-lg font-bold mb-2 text-content">Mensaje:</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        className="border border-surface-2 rounded-lg p-3 text-content text-base bg-surface-1 focus:border-blue-500"
        multiline
        numberOfLines={4}
      />

      <Text className="mt-2 text-sm text-content-muted">
        Mensaje a compartir junto a la ubicación vía WhatsApp
      </Text>
    </View>
  );
}