import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import WatermarkPreview from '../components/WatermarkPreview';
import { colors } from '../components/ui';
import { pickPhotos } from '../lib/photoPicker';
import { processAndSave } from '../lib/batchProcessor';

export default function HomeScreen({ onOpenSettings }: { onOpenSettings: () => void }) {
  const photos = useAppStore((s) => s.photos);
  const addPhotos = useAppStore((s) => s.addPhotos);
  const removePhoto = useAppStore((s) => s.removePhoto);
  const clearPhotos = useAppStore((s) => s.clearPhotos);
  const selectedId = useAppStore((s) => s.selectedId);
  const selectPhoto = useAppStore((s) => s.selectPhoto);
  const watermark = useAppStore((s) => s.watermark);
  const processing = useAppStore((s) => s.processing);
  const setProcessing = useAppStore((s) => s.setProcessing);

  const [progress, setProgress] = useState<string | null>(null);
  const selected = photos.find((p) => p.id === selectedId) ?? null;

  const maxRemain = 200 - photos.length;

  const onPick = async () => {
    if (maxRemain <= 0) {
      Alert.alert('已达上限', '单次最多 200 张');
      return;
    }
    try {
      const picked = await pickPhotos(maxRemain);
      if (picked.length) addPhotos(picked);
    } catch (e) {
      Alert.alert('无法选择图片', String((e as Error)?.message ?? e));
    }
  };

  const onExport = async () => {
    if (photos.length === 0) return;
    if (watermark.type === 'none' && watermark.text.trim() === '') {
      Alert.alert('提示', '请先设置水印内容');
      return;
    }
    setProcessing(true);
    setProgress('准备处理…');
    try {
      const res = await processAndSave(photos, watermark, (done, total) => {
        setProgress(`处理中 ${done}/${total}`);
      });
      const msg = `已保存 ${res.saved} 张到相册` + (res.failed.length ? `，失败 ${res.failed.length} 张` : '');
      Alert.alert('处理完成', msg);
    } catch (e) {
      Alert.alert('处理失败', String((e as Error)?.message ?? e));
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* 预览 */}
      <View style={styles.previewArea}>
        {selected ? (
          <WatermarkPreview
            photoUri={selected.uri}
            photoWidth={selected.width}
            photoHeight={selected.height}
            settings={watermark}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={styles.emptyText}>尚未选择图片</Text>
            <TouchableOpacity style={styles.pickBtn} onPress={onPick}>
              <Text style={styles.pickBtnText}>选择图片（可多选）</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 缩略图横条 */}
      {photos.length > 0 && (
        <View style={styles.thumbArea}>
          <FlatList
            horizontal
            data={photos}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectPhoto(item.id)}
                style={[styles.thumbWrap, selectedId === item.id && styles.thumbActive]}
              >
                <Image source={{ uri: item.uri }} style={styles.thumb} />
                <TouchableOpacity
                  style={styles.thumbDel}
                  onPress={() => removePhoto(item.id)}
                >
                  <Text style={styles.thumbDelText}>×</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.thumbAdd} onPress={onPick}>
                <Text style={styles.thumbAddText}>+</Text>
              </TouchableOpacity>
            }
          />
        </View>
      )}

      {/* 底部操作 */}
      <View style={styles.footer}>
        {photos.length > 0 && (
          <View style={styles.footerTop}>
            <Text style={styles.count}>{photos.length} 张</Text>
            <TouchableOpacity onPress={clearPhotos}>
              <Text style={styles.clearText}>清空</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[styles.exportBtn, (processing || photos.length === 0) && styles.btnDisabled]}
          onPress={onExport}
          disabled={processing || photos.length === 0}
        >
          <Text style={styles.exportBtnText}>
            {progress ?? (photos.length ? `批量加水印（${photos.length}）` : '请先选择图片')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  previewArea: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: colors.muted, fontSize: 14 },
  pickBtn: { backgroundColor: colors.brand, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  pickBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  thumbArea: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 8 },
  thumbWrap: { position: 'relative', marginRight: 8, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  thumbActive: { borderColor: colors.brand },
  thumb: { height: 64, width: 64, borderRadius: 8 },
  thumbDel: {
    position: 'absolute',
    top: -6,
    right: -6,
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbDelText: { color: '#fff', fontSize: 12, lineHeight: 16 },
  thumbAdd: {
    height: 64, width: 64, borderRadius: 8,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  thumbAddText: { fontSize: 24, color: colors.muted },
  footer: { padding: 12, paddingBottom: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  count: { fontSize: 13, color: colors.muted },
  clearText: { fontSize: 13, color: colors.danger },
  exportBtn: { backgroundColor: colors.brand, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  exportBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
