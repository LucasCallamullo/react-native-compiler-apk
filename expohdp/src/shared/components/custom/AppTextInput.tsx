import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useAppTheme } from '@shared/context/ThemeProvider';

/**
 * AppTextInput
 *
 * Shared TextInput wrapper that works around a NativeWind v5 (preview) bug:
 * passing `className` to `TextInput` crashes at runtime with
 * "[TypeError: undefined is not a function]". Until NativeWind stabilizes
 * and `className` is supported on `TextInput`, all styling must go through
 * the `style` prop.
 *
 * Responsibilities:
 *  - Inject themed defaults (background, border, text color, radius, padding).
 *  - Accept and merge a `style` override from the caller (caller wins).
 *  - Forward every other native `TextInputProps` untouched via `...rest`.
 *
 * Not supported on purpose:
 *  - `className` on the inner `TextInput`. It triggers the v5 crash.
 *    If you need layout around the input (width, margins), wrap it in a
 *    `<View>` and use `className` on the View instead.
 *
 * Migration note:
 *  - When NativeWind v5 is stable and supports `className` on `TextInput`,
 *    this wrapper can be extended to accept `className` and translate it
 *    to `style`, or removed entirely. Keep this comment updated.
 */

export interface AppTextInputProps extends TextInputProps {
  /**
   * Style override applied on top of the themed defaults.
   * The caller's `style` always wins over the wrapper defaults.
   */
  style?: TextInputProps['style'];
}

export function AppTextInput({ style, ...rest }: AppTextInputProps) {
  const { getVar } = useAppTheme();

  const defaults = StyleSheet.create({
    input: {
      backgroundColor: getVar('--color-surface-1'),
      borderColor: getVar('--color-border'),
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: getVar('--color-main-300'),
      fontSize: 14,
    },
  });

  return (
    <TextInput
      placeholderTextColor={getVar('--color-content-muted')}
      {...rest}
      style={[defaults.input, style]}
    />
  );
}

export default AppTextInput;