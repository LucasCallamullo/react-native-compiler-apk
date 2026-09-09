import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, applies safe area padding top automatically
   * @default true
   */
  safeTop?: boolean;
  /**
   * If true, applies safe area padding bottom automatically
   * @default false
   */
  safeBottom?: boolean;
}

export function ScreenCustom({ 
  children, 
  className = '', 
  safeTop = true, 
  safeBottom = false,
  ...props 
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: safeTop ? insets.top : 0,
    paddingBottom: safeBottom ? insets.bottom : 0,
  };

  return (
    <View 
      className={`flex-1 bg-bg ${className}`}
      style={paddingStyle}
      {...props}
    >
      {children}
    </View>
  );
}