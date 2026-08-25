import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/components/ui';

type Tab = 'home' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {/* 顶栏 */}
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>印</Text>
        </View>
        <Text style={styles.title}>印流 MarkFlow</Text>
        <Text style={styles.subtitle}>批量水印</Text>
      </View>

      {/* 内容 */}
      <View style={styles.body}>
        {tab === 'home' ? (
          <HomeScreen onOpenSettings={() => setTab('settings')} />
        ) : (
          <SettingsScreen />
        )}
      </View>

      {/* 底部 Tab */}
      <View style={styles.tabbar}>
        <TabButton label="图片" icon="🖼️" active={tab === 'home'} onPress={() => setTab('home')} />
        <TabButton label="水印设置" icon="⚙️" active={tab === 'settings'} onPress={() => setTab('settings')} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress}>
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: '#0f172a',
    gap: 10,
  },
  logoMark: {
    height: 30,
    width: 30,
    borderRadius: 8,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  subtitle: { marginLeft: 'auto', color: '#94a3b8', fontSize: 12 },
  body: { flex: 1, backgroundColor: '#f8fafc' },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 11, color: colors.muted },
  tabLabelActive: { color: colors.brand, fontWeight: '700' },
});
