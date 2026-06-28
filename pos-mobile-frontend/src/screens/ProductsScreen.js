import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import TableCard, { Row } from '../components/TableCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { PRODUCTS } from '../data/mockData';
import { colors, spacing, font, radius } from '../theme';

const CATEGORIES   = ['All', 'Food', 'Beverages', 'Alcohol'];
const DEPARTMENTS  = ['All', 'Kitchen', 'Bar'];

export default function ProductsScreen() {
  const [q,       setQ]       = useState('');
  const [cat,     setCat]     = useState('All');
  const [dept,    setDept]    = useState('All');

  const filtered = PRODUCTS.filter(p => {
    const matchQ    = p.name.toLowerCase().includes(q.toLowerCase());
    const matchCat  = cat  === 'All' || p.category   === cat;
    const matchDept = dept === 'All' || p.department  === dept;
    return matchQ && matchCat && matchDept;
  });

  return (
    <View style={s.screen}>

      {/* ── SEARCH ── */}
      <View style={s.searchWrap}>
        <TextInput
          style={s.search}
          placeholder="Search products…"
          placeholderTextColor={colors.gray400}
          value={q}
          onChangeText={setQ}
        />
      </View>

      {/* ── CATEGORY FILTER ── */}
      <View style={s.filterBlock}>
        <Text style={s.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.chip, cat === c && s.chipActive]}
              onPress={() => setCat(c)}
              activeOpacity={0.7}
            >
              <Text style={[s.chipText, cat === c && s.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── DEPARTMENT FILTER ── */}
      <View style={s.filterBlock}>
        <Text style={s.filterLabel}>Department</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {DEPARTMENTS.map(d => (
            <TouchableOpacity
              key={d}
              style={[s.chip, dept === d && s.chipActive]}
              onPress={() => setDept(d)}
              activeOpacity={0.7}
            >
              <Text style={[s.chipText, dept === d && s.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SectionHeader title="Products" badge={`${filtered.length} items`} />
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No products match your filters.</Text>
          </View>
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
          </TableCard>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: colors.gray100 },

  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  search:     { backgroundColor: colors.white, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.gray200, padding: spacing.md, fontSize: font.base, color: colors.gray800 },

  filterBlock: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  filterLabel: { fontSize: font.sm, fontWeight: '600', color: colors.gray400, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  chips:       { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  chip:        { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.white },
  chipActive:  { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText:    { fontSize: font.sm, fontWeight: '600', color: colors.gray400 },
  chipTextActive: { color: colors.white },

  list:       { paddingBottom: 40, backgroundColor: colors.white, marginHorizontal: spacing.lg, borderRadius: 14, borderWidth: 1, borderColor: colors.gray200, overflow: 'hidden' },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  name:       { fontSize: font.base, fontWeight: '700', color: colors.gray800, flex: 1, marginRight: 8 },

  empty:      { padding: spacing.xxl, alignItems: 'center' },
  emptyText:  { color: colors.gray400, fontSize: font.base },
});
