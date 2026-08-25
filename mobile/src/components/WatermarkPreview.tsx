import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import {
  Canvas,
  Group,
  Image as SkiaImage,
  Text as SkiaText,
  matchFont,
  useImage,
} from '@shopify/react-native-skia';
import type { WatermarkSettings } from '../types';
import { watermarkSlots, scaleFor } from '../watermark/geometry';

interface Props {
  photoUri: string | null;
  photoWidth: number;
  photoHeight: number;
  settings: WatermarkSettings;
}

/** 声明式实时预览：base 图 + 水印（九宫格/平铺/旋转/透明度） */
export default function WatermarkPreview({
  photoUri,
  photoWidth,
  photoHeight,
  settings,
}: Props) {
  const base = useImage(photoUri ?? undefined);
  const logo = useImage(settings.logoUri ?? undefined);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  };

  // 计算画布像素（保持原始纵横比，铺满容器）
  const scale = useMemo(() => {
    if (box.w === 0 || box.h === 0 || photoWidth === 0) return 1;
    const fit = Math.min(box.w / photoWidth, box.h / photoHeight);
    return fit > 0 ? fit : 1;
  }, [box, photoWidth, photoHeight]);

  const viewW = photoWidth * scale;
  const viewH = photoHeight * scale;

  // 水印几何基于显示像素（与导出按 min(w,h)/800 等比缩放一致）
  const sc = scaleFor(viewW, viewH);

  const textMarks = useMemo(() => {
    if (!settings.text.trim()) return [];
    const fontPx = settings.fontSize * sc;
    const measureW = textWidth(settings.text, fontPx);
    const boxW = measureW + settings.padding * sc * 2;
    const boxH = fontPx * 1.2 + settings.padding * sc * 2;
    return watermarkSlots(viewW, viewH, settings, { w: boxW, h: boxH }).map((s) => ({
      cx: s.center.x,
      cy: s.center.y,
      rotation: s.rotation,
      fontPx,
      textW: measureW,
    }));
  }, [settings, sc, viewW, viewH]);

  const logoMarks = useMemo(() => {
    if (!settings.logoUri || !logo) return [];
    const dw = logo.width() * settings.logoScale * sc;
    const dh = logo.height() * settings.logoScale * sc;
    return watermarkSlots(viewW, viewH, settings, { w: dw, h: dh }).map((s) => ({
      cx: s.center.x,
      cy: s.center.y,
      rotation: s.rotation,
      dw,
      dh,
    }));
  }, [settings, sc, viewW, viewH, logo]);

  if (!base) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={{ width: viewW, height: viewH }}>
        <Canvas style={{ width: viewW, height: viewH }}>
          <SkiaImage image={base} x={0} y={0} width={viewW} height={viewH} fit="fill" />
          {settings.type === 'text' &&
            textMarks.map((m, i) => (
              <Group
                key={i}
                opacity={settings.opacity}
                color={settings.textColor}
                transform={[
                  { translateX: m.cx },
                  { translateY: m.cy },
                  { rotate: (m.rotation * Math.PI) / 180 },
                ]}
              >
                <SkiaText
                  text={settings.text}
                  x={-m.textW / 2}
                  y={m.fontPx * 0.35}
                  font={matchFont({ fontFamily: 'sans-serif', fontSize: m.fontPx, fontWeight: 'bold' })}
                />
              </Group>
            ))}
          {settings.type === 'image' &&
            logoMarks.map((m, i) => (
              <Group
                key={i}
                opacity={settings.opacity}
                transform={[
                  { translateX: m.cx },
                  { translateY: m.cy },
                  { rotate: (m.rotation * Math.PI) / 180 },
                ]}
              >
                <SkiaImage
                  image={logo}
                  x={-m.dw / 2}
                  y={-m.dh / 2}
                  width={m.dw}
                  height={m.dh}
                  fit="fill"
                />
              </Group>
            ))}
        </Canvas>
      </View>
    </View>
  );
}

function textWidth(text: string, fontPx: number): number {
  let w = 0;
  for (const ch of text) {
    w += ch.charCodeAt(0) > 0xff ? fontPx : fontPx * 0.62;
  }
  return w;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', margin: 16 },
  placeholder: { flex: 1, backgroundColor: '#e2e8f0' },
});
