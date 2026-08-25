import * as MediaLibrary from 'expo-media-library';
import { writeAsStringAsync, cacheDirectory, EncodingType } from 'expo-file-system/legacy';

/**
 * 将 base64 PNG 保存到相册。
 * 思路：Skia 输出 base64 → 用 expo-file-system 写临时文件 → createAssetAsync 存入相册。
 */
export async function saveBase64PngToGallery(
  base64: string,
  filename = 'markflow.png'
): Promise<string> {
  const perm = await MediaLibrary.requestPermissionsAsync(true);
  if (!perm.granted) {
    throw new Error('需要相册写入权限才能保存结果');
  }

  const tmpPath = (cacheDirectory ?? '') + filename;
  await writeAsStringAsync(tmpPath, base64, { encoding: EncodingType.Base64 });

  const asset = await MediaLibrary.createAssetAsync(tmpPath);
  return asset.uri;
}
