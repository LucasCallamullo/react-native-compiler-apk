import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Calculator } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 64; // w-16 h-16 equivalente

interface DraggableLockButtonProps {
  onPress: () => void;
  iconColor: string;
  initialBottom: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DraggableLockButton({
  onPress,
  iconColor,
  initialBottom,
}: DraggableLockButtonProps) {
  // Posición inicial en X (Alineado a la derecha con margen de 24px)
  const translateX = useSharedValue(SCREEN_WIDTH - BUTTON_SIZE - 24);
  // Posición inicial en Y respecto al top
  const translateY = useSharedValue(SCREEN_HEIGHT - initialBottom - BUTTON_SIZE);

  const context = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Guarda la posición previa antes de iniciar el arrastre
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      // Limita el movimiento dentro de los márgenes visibles de la pantalla
      const nextX = context.value.x + event.translationX;
      const nextY = context.value.y + event.translationY;

      translateX.value = Math.min(Math.max(16, nextX), SCREEN_WIDTH - BUTTON_SIZE - 16);
      translateY.value = Math.min(Math.max(48, nextY), SCREEN_HEIGHT - BUTTON_SIZE - 48);
    })
    .onEnd(() => {
      // Opcional: Snap automático al borde más cercano (Izquierda o Derecha)
      const middle = SCREEN_WIDTH / 2;
      if (translateX.value + BUTTON_SIZE / 2 < middle) {
        translateX.value = withSpring(16); // Snap a la izquierda
      } else {
        translateX.value = withSpring(SCREEN_WIDTH - BUTTON_SIZE - 16); // Snap a la derecha
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedPressable
        onPress={onPress}
        style={[animatedStyle, { position: 'absolute', top: 0, left: 0 }]}
        className="w-16 h-16 bg-card border border-border rounded-full items-center justify-center shadow-lg active:bg-popover z-50"
      >
        <Calculator color={iconColor} size={28} />
      </AnimatedPressable>
    </GestureDetector>
  );
}