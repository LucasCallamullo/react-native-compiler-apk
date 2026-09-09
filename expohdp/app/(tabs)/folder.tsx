import { View, Text } from 'react-native';


import { ScreenCustom } from '@shared/components/ScreenCustom';

export default function FolderScreen() {
  return (
    <ScreenCustom safeTop className='flex-1 items-center justify-center'>
      <Text className="text-2xl font-bold text-fg">Carpetas</Text>
    </ScreenCustom>
  );
}
