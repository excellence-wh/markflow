import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import type { PositionAnchor, WatermarkType } from '../types';
import { ColorPicker, PillButton, Row, SectionTitle, Slider, TextField, colors } from '../components/ui';
import { pickLogo } from '../lib/photoPicker';

const POSITIONS: { key: PositionAnchor; label: string }[] = [
  { key: 'top-left', label: '左上' },
  { key: 'top-center', label: '中上' },
  { key: 'top-right', label: '右上' },
  { key: 'middle-left', label: '左中' },
  { key: 'center', label: '居中' },
  { key: 'middle-right', label: '右中' },
  { key: 'bottom-left', label: '左下' },
  { key: 'bottom-center', label: '中下' },
  { key: 'bottom-right', label: '右下' },
];

const FONT_SIZES = [24, 36, 48, 64, 80, 100];

export default function SettingsScreen() {
  const wm = useAppStore((s) => s.watermark);
  const update = useAppStore((s) => s.updateWatermark);
  const setLogo = useAppStore((s) => s.setLogo);
  const reset = useAppStore((s) => s.resetWatermark);

  const pick = (t: WatermarkType) => {
    if (t === 'image') {
      pickLogo()
        .then((uri) => {
          if (uri) {
            setLogo(uri);
            update({ type: 'image' });
          }
        })
        .catch((e) => Alert.alert('无法选择 Logo', String(e?.message ?? e)));
      return;
    }
    update({ type: t });
  };

  const isText = wm.type === 'text';
  const isImage = wm.type === 'image';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Row between>
        <SectionTitle>水印类型</SectionTitle>
        <TouchableOpacity onPress={reset}>
          <Text style={styles.reset}>重置</Text>
        </TouchableOpacity>
      </Row>
      <Row>
        <PillButton active={wm.type === 'text'} onPress={() => pick('text')}>
          文字
        </PillButton>
        <PillButton active={wm.type === 'image'} onPress={() => pick('image')}>
          图片
        </PillButton>
        <PillButton active={wm.type === 'none'} onPress={() => pick('none')}>
          无水印
        </PillButton>
      </Row>

      {isText && (
        <>
          <View style={styles.block}>
            <SectionTitle>水印文字</SectionTitle>
            <TextField
              value={wm.text}
              onChange={(t) => update({ text: t })}
              placeholder="输入水印文字…"
            />
          </View>
          <View style={styles.block}>
            <SectionTitle>字号</SectionTitle>
            <Row>
              {FONT_SIZES.map((s) => (
                <PillButton key={s} active={wm.fontSize === s} onPress={() => update({ fontSize: s })}>
                  {s}
                </PillButton>
              ))}
            </Row>
          </View>
          <View style={styles.block}>
            <SectionTitle>文字颜色</SectionTitle>
            <ColorPicker value={wm.textColor} onChange={(c) => update({ textColor: c })} />
          </View>
          <Slider label="透明度" value={Math.round(wm.opacity * 100)} min={0} max={100} onChange={(v) => update({ opacity: v / 100 })} suffix="%" />
          <Slider label="旋转" value={wm.rotation} min={-90} max={90} onChange={(v) => update({ rotation: v })} suffix="°" />
          <Slider label="描边" value={wm.strokeWidth} min={0} max={20} onChange={(v) => update({ strokeWidth: v })} suffix="px" />
          {wm.strokeWidth > 0 && (
            <View style={styles.block}>
              <SectionTitle>描边颜色</SectionTitle>
              <ColorPicker value={wm.strokeColor} onChange={(c) => update({ strokeColor: c })} />
            </View>
          )}
        </>
      )}

      {isImage && (
        <>
          <View style={styles.block}>
            <SectionTitle>Logo 图片</SectionTitle>
            {wm.logoUri ? (
              <Row>
                <Image source={{ uri: wm.logoUri }} style={styles.logoPreview} />
                <TouchableOpacity style={styles.ghostBtn} onPress={() => pick('image')}>
                  <Text style={styles.ghostText}>更换 Logo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ghostBtn} onPress={() => setLogo(null)}>
                  <Text style={[styles.ghostText, { color: colors.danger }]}>移除</Text>
                </TouchableOpacity>
              </Row>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={() => pick('image')}>
                <Text style={styles.uploadText}>＋ 上传 Logo（PNG 透明底最佳）</Text>
              </TouchableOpacity>
            )}
          </View>
          <Slider label="大小" value={Math.round(wm.logoScale * 100)} min={10} max={200} onChange={(v) => update({ logoScale: v / 100 })} suffix="%" />
          <Slider label="透明度" value={Math.round(wm.opacity * 100)} min={0} max={100} onChange={(v) => update({ opacity: v / 100 })} suffix="%" />
          <Slider label="旋转" value={wm.rotation} min={-90} max={90} onChange={(v) => update({ rotation: v })} suffix="°" />
        </>
      )}

      {wm.type !== 'none' && (
        <>
          <TouchableOpacity style={styles.toggleRow} onPress={() => update({ tile: !wm.tile })}>
            <Text style={styles.toggleLabel}>平铺模式（防盗图）</Text>
            <View style={[styles.toggleTrack, wm.tile && styles.toggleOn]}>
              <View style={[styles.toggleDot, wm.tile && { transform: [{ translateX: 20 }] }]} />
            </View>
          </TouchableOpacity>
          {!wm.tile ? (
            <>
              <View style={styles.block}>
                <SectionTitle>位置（九宫格）</SectionTitle>
                <View style={styles.grid}>
                  {POSITIONS.map((p) => (
                    <TouchableOpacity
                      key={p.key}
                      onPress={() => update({ position: p.key })}
                      style={[styles.gridCell, wm.position === p.key && styles.gridCellActive]}
                    >
                      <Text style={[styles.gridText, wm.position === p.key && styles.gridTextActive]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Slider label="水平边距" value={wm.marginX} min={0} max={200} onChange={(v) => update({ marginX: v })} suffix="px" />
              <Slider label="垂直边距" value={wm.marginY} min={0} max={200} onChange={(v) => update({ marginY: v })} suffix="px" />
            </>
          ) : (
            <Slider label="平铺间距" value={wm.tileGap} min={40} max={400} onChange={(v) => update({ tileGap: v })} suffix="px" />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  reset: { fontSize: 13, color: '#94a3b8' },
  block: { marginBottom: 14 },
  logoPreview: { height: 56, width: 56, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  ghostBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  ghostText: { fontSize: 13, color: colors.muted },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  uploadText: { fontSize: 14, color: colors.muted },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  toggleLabel: { fontSize: 14, color: colors.muted },
  toggleTrack: { height: 28, width: 48, borderRadius: 14, backgroundColor: '#cbd5e1', padding: 2 },
  toggleOn: { backgroundColor: colors.brand },
  toggleDot: { height: 24, width: 24, borderRadius: 12, backgroundColor: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridCell: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gridCellActive: { borderColor: colors.brand, backgroundColor: '#eef2ff' },
  gridText: { fontSize: 13, color: colors.muted },
  gridTextActive: { color: colors.brand, fontWeight: '600' },
});
