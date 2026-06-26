import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme';

const variants = {
  blue:   { bg: colors.blueLight,   text: colors.blue    },
  green:  { bg: colors.greenLight,  text: colors.green   },
  red:    { bg: colors.redLight,    text: colors.red     },
  amber:  { bg: colors.amberLight,  text: colors.amber   },
  purple: { bg: colors.purpleLight, text: colors.purple  },
};

export default function Badge({ label, variant = 'blue' }) {
  const v = variants[variant] || variants.blue;
  return (
    <View style={[s.badge, { backgroundColor: v.bg }]}>
      <Text style={[s.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  text:  { fontSize: font.sm, fontWeight: '600' },
});
