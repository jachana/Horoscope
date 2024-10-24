import { FontAwesome } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';
import { ZodiacSign } from '../types/horoscope';

type ZodiacIconProps = {
  sign: ZodiacSign;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export function ZodiacIcon({ sign, size = 24, color = '#333', style }: ZodiacIconProps) {
  const getIconName = (sign: ZodiacSign) => {
    switch (sign.toLowerCase()) {
      case 'aries':
        return 'fire' as const;
      case 'taurus':
        return 'circle' as const;
      case 'gemini':
        return 'exchange' as const;
      case 'cancer':
        return 'moon-o' as const;
      case 'leo':
        return 'sun-o' as const;
      case 'virgo':
        return 'leaf' as const;
      case 'libra':
        return 'balance-scale' as const;
      case 'scorpio':
        return 'bug' as const;
      case 'sagittarius':
        return 'arrow-right' as const;
      case 'capricorn':
        return 'angle-double-up' as const; // Changed from mountain
      case 'aquarius':
        return 'tint' as const;
      case 'pisces':
        return 'asterisk' as const; // Changed from fish
      default:
        return 'question-circle' as const;
    }
  };

  return (
    <FontAwesome
      name={getIconName(sign)}
      size={size}
      color={color}
      style={style}
    />
  );
}
