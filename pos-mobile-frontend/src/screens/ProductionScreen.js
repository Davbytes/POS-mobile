import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TableCard, { Row } from '../components/TableCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { PRODUCTIONS } from '../data/mockData';
import { colors, spacing, font, radius } from '../theme';

export default function ProductionScreen() {
  const navigation = useNavigation();

  return (
    <View style={s.screen}>
      <TouchableOpacity
        style={s.purchasesBtn}
        onPress={() => navigation.navigate('Purchases')}
        activeOpacity={0.8}
      >
        <Text style={s.purchasesBtnText}>🛒  Go to Purchases</Text>
      </TouchableOpacity>

      <FlatList
        data={PRODUCTIONS}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionHeader title="Production Records" badge={`${PRODUCTIONS.length} records`} />
        }
        renderItem={({ item: p }) => (
          <TableCard>
            <View style={s.topRow}>
              <Text style={s.name}>{p.product}</Text>
            </View>
            <Row label="Input Material"    value={p.stock_product} />
            <Row label="Conversion Factor" right={<Badge label={String(p.conversion_factor)} variant="blue" />} />
            <Row label="Used Stock"        value={String(p.used_stock)}    valueColor={colors.red}      />
            <Row label="Current Stock"     value={String(p.current_stock)} valueColor={colors.gray800}  />
          </TableCard>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: colors.gray100 },
  purchasesBtn:    { margin: spacing.lg, marginBottom: spacing.sm, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.blue, borderRadius: radius.sm, padding: spacing.md, alignItems: 'center' },
  purchasesBtnText:{ fontSize: font.base, fontWeight: '600', color: colors.blue },
  list:            { paddingBottom: 40, backgroundColor: colors.white, marginHorizontal: spacing.lg, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden' },
  topRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  name:            { fontSize: font.base, fontWeight: '700', color: colors.gray800 },
});
