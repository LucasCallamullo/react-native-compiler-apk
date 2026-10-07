// src/components/QuickLoginButtons.tsx
import { Pressable, Text, View } from 'react-native';

export const TEST_USERS = [
  {
    id: 'user',
    label: 'Usuario',
    email: 'test@gmail.com',
    password: '123456',
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@gmail.com',
    password: '123456',
  },
] as const;

export type TestUser = (typeof TEST_USERS)[number];

type Props = {
  onSelect: (user: TestUser) => void;
};

export function QuickLoginButtons({ onSelect }: Props) {
  return (
    <View className="gap-2 mt-5">
      <Text className="text-content-muted text-xs mb-1">
        Acceso rápido (dev)
      </Text>

      <View className="flex-row gap-2">
        {TEST_USERS.map((user) => (
          <Pressable
            key={user.id}
            onPress={() => onSelect(user)}
            className="flex-1 active:opacity-70 bg-surface-2 border border-border rounded-lg px-3 py-2"
          >
            <Text className="text-content text-sm font-medium text-center">
              {user.label}
            </Text>
            <Text className="text-content-muted text-[10px] text-center">
              {user.email}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}