// src/shared/components/DraggableLockButton.tsx
import React, { useCallback } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
// Importá scheduleOnRN según tu versión:
// - react-native-reanimated >= 3.16: import { scheduleOnRN } from 'react-native-reanimated';
// - react-native-worklets (nuevo): import { scheduleOnRN } from 'react-native-worklets';
import { scheduleOnRN } from 'react-native-worklets';
import { Calculator } from 'lucide-react-native';
import Storage from 'expo-sqlite/kv-store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 64;
const STORAGE_KEY = 'ui.lock-button.position';

interface DraggableLockButtonProps {
  onPress: () => void;
  iconColor: string;
  initialBottom: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function readStoredPosition(initialBottom: number) {
  try {
    const raw = Storage.getItemSync(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.x === 'number' &&
        typeof parsed.y === 'number' &&
        Number.isFinite(parsed.x) &&
        Number.isFinite(parsed.y)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[lock-button] failed to read position', e);
  }
  return {
    x: SCREEN_WIDTH - BUTTON_SIZE - 24,
    y: SCREEN_HEIGHT - initialBottom - BUTTON_SIZE,
  };
}

export function DraggableLockButton({
  onPress,
  iconColor,
  initialBottom,
}: DraggableLockButtonProps) {
  const initial = readStoredPosition(initialBottom);

  const translateX = useSharedValue(initial.x);
  const translateY = useSharedValue(initial.y);
  const context = useSharedValue({ x: 0, y: 0 });

  // Esta función vive en el thread de JS.
  // La llamaremos DESDE el worklet vía scheduleOnRN.
  const persist = useCallback((x: number, y: number) => {
    try {
      Storage.setItemSync(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch (e) {
      console.warn('[lock-button] failed to persist position', e);
    }
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      const nextX = context.value.x + event.translationX;
      const nextY = context.value.y + event.translationY;

      translateX.value = Math.min(Math.max(16, nextX), SCREEN_WIDTH - BUTTON_SIZE - 16);
      translateY.value = Math.min(Math.max(48, nextY), SCREEN_HEIGHT - BUTTON_SIZE - 48);
    })
    .onEnd(() => {
      const middle = SCREEN_WIDTH / 2;
      const snappedX =
        translateX.value + BUTTON_SIZE / 2 < middle
          ? 16
          : SCREEN_WIDTH - BUTTON_SIZE - 16;

      translateX.value = withSpring(snappedX);

      // Ejecutamos `persist` en el thread de JS con los valores finales
      scheduleOnRN(persist, snappedX, translateY.value);
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
        className="w-17 h-17 bg-surface-2 border border-border 
          rounded-full items-center justify-center shadow-lg active:bg-popover z-50"
      >
        <Calculator color={iconColor} size={29} />
      </AnimatedPressable>
    </GestureDetector>
  );
}