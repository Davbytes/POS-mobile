import { View, Text, ScrollView, StyleSheet } from 'react-native';
import StatCard from '../components/Card';
import TableCard, { Row } from '../components/TableCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import {
  DAILY_SALES, WAITER_STATS, LOW_STOCK,
  TOTAL_MONTHLY_SALES, TOTAL_MONTHLY_PURCHASES, SHIFT_SALES,
} from '../data/mockData';
import { colors, spacing, font } from '../theme';

const fmt = n => `KSh ${n.toLocaleString()}`;
const paymentVariant = p => p === 'Cash' ? 'green' : p === 'Card' ? 'blue' : 'amber';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function DashboardScreen() {
  const hour    = new Date().getHours();
  const inShift = hour >= 8 && hour < 20;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── STAT CARDS ── */}
      <View style={s.cardsRow}>
        <StatCard label="Monthly Sales"     value={fmt(TOTAL_MONTHLY_SALES)}     sub="June 2024"           variant="blue"   icon="📈" />
        <StatCard label="Monthly Purchases" value={fmt(TOTAL_MONTHLY_PURCHASES)} sub="June 2024"           variant="green"  icon="🛒" />
      </View>
      <View style={s.cardsRow}>
        <StatCard label="Shift Sales"       value={inShift ? fmt(SHIFT_SALES) : 'KSh 0'} sub={inShift ? '08:00–20:00' : 'No active shift'} variant="amber"  icon="💰" />
        <StatCard label="Low Stock Alerts"  value={String(LOW_STOCK.length)}      sub="Below reorder level" variant="purple" icon="⚠️" />
      </View>

      {/* ── DAILY SALES ── */}
      <View style={s.section}>
        <SectionHeader title="Daily Sales" badge={`${DAILY_SALES.length} transactions`} />
        {DAILY_SALES.map((r, i) => (
          <TableCard key={i}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>{r.product}</Text>
              <Text style={s.cardTime}>{r.time}</Text>
            </View>
            <Row label="Qty"         value={String(r.qty)} />
            <Row label="Unit Price"  value={fmt(r.unit_price)} />
            <Row label="Total"       value={fmt(r.total)} valueColor={colors.blue} />
            <Row label="Channel"     value={r.channel} />
            <Row label="Stock After" value={String(r.stock_after)} />
            <Row label="Payment" right={<Badge label={r.payment} variant={paymentVariant(r.payment)} />} />
          </TableCard>
        ))}
      </View>

      {/* ── TOP SELLERS (WAITERS) ── */}
      <View style={s.section}>
        <SectionHeader title="Top Sellers" badge="Waiter ranking" />
        {WAITER_STATS.map((w, i) => (
          <TableCard key={w.name}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>
                {RANK_MEDALS[i] ?? `#${i + 1}`}{'  '}{w.name}
              </Text>
            </View>
            <Row label="Revenue"    value={fmt(w.revenue)}      valueColor={colors.green} />
            <Row label="Units Sold" value={String(w.units)} />
          </TableCard>
        ))}
      </View>

      {/* ── LOW STOCK ── */}
      <View style={s.section}>
        <SectionHeader title="Low Stock Items" badge={`${LOW_STOCK.length} items`} badgeVariant="red" />
        {LOW_STOCK.map(p => (
          <TableCard key={p.id}>
            <View style={s.cardTopRow}>
              <Text style={s.cardTitle}>{p.name}</Text>
              <Badge label="Reorder" variant="red" />
            </View>
            <Row label="Current Stock" value={String(p.stock)}         valueColor={colors.red} />
            <Row label="Reorder Level" value={String(p.reorder_level)} />
          </TableCard>
        ))}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: colors.gray100 },
  content:    { padding: spacing.lg, paddingBottom: 40 },
  cardsRow:   { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  section:    { backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, marginBottom: spacing.lg, overflow: 'hidden' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  cardTitle:  { fontSize: font.base, fontWeight: '700', color: colors.gray800, flex: 1, marginRight: 8 },
  cardTime:   { fontSize: font.sm, color: colors.gray400, fontFamily: 'monospace' },
});
