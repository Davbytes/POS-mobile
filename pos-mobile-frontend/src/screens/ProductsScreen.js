import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import TableCard, { Row } from '../components/TableCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { PRODUCTS } from '../data/mockData';
import { colors, spacing, font, radius } from '../theme';

export default function ProductsScreen() {
  const [q, setQ] = useState('');
  const filtered  = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <View style={s.screen}>
      <View style={s.searchWrap}>
        <TextInput
          style={s.search}
          placeholder="Search products…"
          placeholderTextColor={colors.gray400}
          value={q}
          onChangeText={setQ}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionHeader title="All Products" badge={`${filtered.length} items`} />
        }
        renderItem={({ item: p }) => (
          <TableCard>
            <View style={s.topRow}>
              <Text style={s.name}>{p.name}</Text>
              {p.stock <= p.reorder_level && <Badge label="Low Stock" variant="red" />}
            </View>
            <Row label="Category"   value={p.category} />
            <Row label="Department" value={p.department} />
            <Row label="Price"      value={`KSh ${p.price.toLocaleString()}`} />
            <Row label="Stock"      value={String(p.stock)} valueColor={p.stock <= p.reorder_level ? colors.red : colors.gray800} />
            <Row label="Sales"      value={String(p.current_sales)} />
            <Row label="Reorder At" value={String(p.reorder_level)} />
          </TableCard>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: colors.gray100 },
  searchWrap: { padding: spacing.lg, paddingBottom: spacing.sm },
  search:     { backgroundColor: colors.white, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.gray200, padding: spacing.md, fontSize: font.base, color: colors.gray800 },
  list:       { paddingBottom: 40, backgroundColor: colors.white, marginHorizontal: spacing.lg, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden' },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  name:       { fontSize: font.base, fontWeight: '700', color: colors.gray800, flex: 1, marginRight: 8 },
});
