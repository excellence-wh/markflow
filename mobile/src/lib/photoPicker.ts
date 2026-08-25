import * as ImagePicker from 'expo-image-picker';
import type { PhotoItem } from '../types';

/** 请求相册权限并选择多张图片 */
export async function pickPhotos(limit: number): Promise<PhotoItem[]> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('需要相册权限才能选择图片');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: limit,
    quality: 1,
  });
  if (result.canceled) return [];
  return result.assets.map((a) => ({
    id: '',
    uri: a.uri,
    width: a.width ?? 0,
    height: a.height ?? 0,
    size: a.fileSize,
    filename: a.fileName ?? undefined,
    status: 'idle',
  }));
}

/** 选择一张 Logo 图片（返回 uri） */
export async function pickLogo(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error('需要相册权限');
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: false,
    quality: 1,
  });
  if (result.canceled) return null;
  return result.assets[0].uri;
}
