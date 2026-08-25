import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const colors = {
  brand: '#2547eb',
  brandDark: '#1d35d8',
  bg: '#f1f5f9',
  card: '#ffffff',
  ink: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  danger: '#ef4444',
};

export const PALETTE = [
  '#ffffff',
  '#000000',
  '#ef4444',
  '#f97316',
  '#facc15',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.sectionTitle}>{children}</Text>
  );
}

export function Row({ children, between = false }: { children: React.ReactNode; between?: boolean }) {
  return (
    <View style={[styles.row, between && styles.rowBetween]}>{children}</View>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderLabelRow}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>
          {value}
          {suffix}
        </Text>
      </View>
      {/* RN 用自身 Slider/TextInput 控制；这里用 + / - 步进按钮，避免原生滑条兼容问题 */}
      <View style={styles.stepRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.stepTrack} />
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
        >
          <Text style={styles.stepBtnText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <View style={styles.colorRow}>
      {PALETTE.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => onChange(c)}
          style={[
            styles.swatch,
            { backgroundColor: c },
            value.toLowerCase() === c.toLowerCase() && styles.swatchActive,
          ]}
        />
      ))}
    </View>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      style={styles.input}
    />
  );
}

export function PillButton({
  children,
  onPress,
  active = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { justifyContent: 'space-between' },
  sliderWrap: { marginBottom: 14 },
  sliderLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sliderLabel: { fontSize: 14, color: colors.muted },
  sliderValue: { fontSize: 14, fontWeight: '600', color: colors.ink },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    height: 32,
    width: 44,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 18, fontWeight: '700', color: colors.brand },
  stepTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatch: { height: 30, width: 30, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  swatchActive: { borderWidth: 2, borderColor: colors.brand },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pillActive: { borderColor: colors.brand, backgroundColor: '#eef2ff' },
  pillText: { fontSize: 13, color: colors.muted },
  pillTextActive: { color: colors.brand, fontWeight: '600' },
});
