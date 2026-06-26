import { View, Text, FlatList, StyleSheet } from 'react-native';
import TableCard, { Row } from '../components/TableCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { PURCHASES } from '../data/mockData';
import { colors, spacing, font } from '../theme';

export default function PurchasesScreen() {
  return (
    <View style={s.screen}>
      <FlatList
        data={PURCHASES}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionHeader title="Purchase Records" badge={`${PURCHASES.length} invoices`} />
        }
        renderItem={({ item: p }) => (
          <TableCard>
            <View style={s.topRow}>
              <Text style={s.invoice}>{p.invoice}</Text>
              <Badge label={p.vat_type} variant={p.vat_type === 'Inclusive' ? 'green' : 'amber'} />
            </View>
            <Row label="Supplier"      value={p.supplier} />
            <Row label="Received By"   value={p.received_by} />
            <Row label="Invoice Total" value={`KSh ${p.invoice_total.toLocaleString()}`} />
            <Row label="Total VAT"     value={`KSh ${p.total_vat.toLocaleString()}`} />
            <Row label="Grand Total"   value={`KSh ${p.grand_total.toLocaleString()}`} valueColor={colors.blue} />
            <Row label="Date"          value={p.created_at} />
          </TableCard>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.gray100 },
  list:    { paddingBottom: 40, backgroundColor: colors.white, marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden' },
  topRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  invoice: { fontSize: font.base, fontWeight: '700', color: colors.gray800, fontFamily: 'monospace' },
});
