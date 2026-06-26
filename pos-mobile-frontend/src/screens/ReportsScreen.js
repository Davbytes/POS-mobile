import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import TableCard, { Row } from '../components/TableCard';
import Badge from '../components/Badge';
import { DAILY_SALES, PURCHASES, PRODUCTIONS, PRODUCTS } from '../data/mockData';
import { colors, spacing, font, radius } from '../theme';

const TABS = [
  { key: 'sales',      label: 'Sales'      },
  { key: 'purchases',  label: 'Purchases'  },
  { key: 'production', label: 'Production' },
  { key: 'products',   label: 'Products'   },
];

const paymentVariant = p => p === 'Cash' ? 'green' : p === 'Card' ? 'blue' : 'amber';

export default function ReportsScreen() {
  const [tab,    setTab]    = useState('sales');
  const [filter, setFilter] = useState('today');

  const FILTERS = ['today', 'month', 'custom'];
  const filterLabel = { today: 'Today', month: 'This Month', custom: 'Custom' };

  return (
    <View style={s.screen}>

      {/* Filter pills */}
      <View style={s.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterPill, filter === f && s.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>
              {filterLabel[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report type tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, tab === t.key && s.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Report data */}
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.section}>
          {tab === 'sales' && DAILY_SALES.map((r, i) => (
            <TableCard key={i}>
              <View style={s.topRow}>
                <Text style={s.itemTitle}>{r.product}</Text>
                <Text style={s.time}>{r.time}</Text>
              </View>
              <Row label="Qty"        value={String(r.qty)} />
              <Row label="Unit Price" value={`KSh ${r.unit_price.toLocaleString()}`} />
              <Row label="Total"      value={`KSh ${r.total.toLocaleString()}`} valueColor={colors.blue} />
              <Row label="Channel"    value={r.channel} />
              <Row label="Payment"    right={<Badge label={r.payment} variant={paymentVariant(r.payment)} />} />
            </TableCard>
          ))}

          {tab === 'purchases' && PURCHASES.map(p => (
            <TableCard key={p.id}>
              <View style={s.topRow}>
                <Text style={s.itemTitle}>{p.invoice}</Text>
                <Badge label={p.vat_type} variant={p.vat_type === 'Inclusive' ? 'green' : 'amber'} />
              </View>
              <Row label="Supplier"    value={p.supplier} />
              <Row label="Grand Total" value={`KSh ${p.grand_total.toLocaleString()}`} valueColor={colors.blue} />
              <Row label="Date"        value={p.created_at} />
            </TableCard>
          ))}

          {tab === 'production' && PRODUCTIONS.map(p => (
            <TableCard key={p.id}>
              <Text style={[s.itemTitle, { marginBottom: spacing.xs }]}>{p.product}</Text>
              <Row label="Input"       value={p.stock_product} />
              <Row label="Used Stock"  value={String(p.used_stock)}    valueColor={colors.red} />
              <Row label="Out Stock"   value={String(p.current_stock)} />
            </TableCard>
          ))}

          {tab === 'products' && PRODUCTS.map(p => (
            <TableCard key={p.id}>
              <View style={s.topRow}>
                <Text style={s.itemTitle}>{p.name}</Text>
                <Badge label={p.stock <= p.reorder_level ? 'Low' : 'OK'} variant={p.stock <= p.reorder_level ? 'red' : 'green'} />
              </View>
              <Row label="Price" value={`KSh ${p.price.toLocaleString()}`} />
              <Row label="Stock" value={String(p.stock)} valueColor={p.stock <= p.reorder_level ? colors.red : colors.gray800} />
              <Row label="Sales" value={String(p.current_sales)} />
            </TableCard>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: colors.gray100 },
  filterRow:       { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, paddingBottom: spacing.sm },
  filterPill:      { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.gray200 },
  filterPillActive:{ backgroundColor: colors.blue, borderColor: colors.blue },
  filterText:      { fontSize: font.sm, fontWeight: '600', color: colors.gray600 },
  filterTextActive:{ color: colors.white },
  tabsScroll:      { flexGrow: 0 },
  tabs:            { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  tab:             { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.sm, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.gray200 },
  tabActive:       { backgroundColor: colors.blueLight, borderColor: colors.blue },
  tabText:         { fontSize: font.sm, fontWeight: '600', color: colors.gray600 },
  tabTextActive:   { color: colors.blue },
  content:         { paddingBottom: 40 },
  section:         { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, marginHorizontal: spacing.lg, overflow: 'hidden' },
  topRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  itemTitle:       { fontSize: font.base, fontWeight: '700', color: colors.gray800, flex: 1, marginRight: 8 },
  time:            { fontSize: font.sm, color: colors.gray400 },
});
