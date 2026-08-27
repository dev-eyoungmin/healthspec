import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HealthStore, isHealthError } from '@healthspec/expo';
import { loadSummary, screenPermissions, type Summary } from './src/summary';

const store = HealthStore.default();

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const availability = await store.availability();
      if (availability !== 'available') {
        // not_installed and update_required are recoverable — send the user to the installer.
        setError(`Health data is ${availability.replace('_', ' ')}.`);
        return;
      }
      await store.requestSupportedPermissions(screenPermissions);
      setSummary(await loadSummary(store));
    } catch (e) {
      setError(isHealthError(e) ? `${e.code}: ${e.message}` : String(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
        <Text style={styles.title}>Last 7 days</Text>
        <Text style={styles.subtitle}>
          Provider: {store.id} · {store.capabilities().types.length} types supported
        </Text>

        {error && (
          <View style={[styles.card, styles.errorCard]}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={refresh} style={styles.button}>
              <Text style={styles.buttonText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {!summary && !error && <ActivityIndicator style={styles.loading} />}

        {summary && (
          <>
            <View style={styles.row}>
              <Stat label="Heart rate" value={summary.latestHeartRateBpm} unit="bpm" />
              <Stat label="Weight" value={summary.latestWeightKg} unit="kg" />
              <Stat label="Last night" value={summary.lastNight?.hours ?? null} unit="h" />
            </View>

            <Section title="Daily activity">
              {summary.days.map((day) => (
                <View key={day.date} style={styles.dayRow}>
                  <Text style={styles.dayLabel}>{day.date.slice(5)}</Text>
                  <Text style={styles.dayValue}>{day.steps?.toLocaleString() ?? '—'} steps</Text>
                  <Text style={styles.dayMuted}>{day.distanceKm !== null ? `${day.distanceKm} km` : '—'}</Text>
                  <Text style={styles.dayMuted}>{day.activeKilocalories !== null ? `${day.activeKilocalories} kcal` : '—'}</Text>
                </View>
              ))}
            </Section>

            {summary.lastNight && (
              <Section title="Sleep stages">
                {summary.lastNight.stages.map((s) => (
                  <View key={s.stage} style={styles.dayRow}>
                    <Text style={styles.dayLabel}>{s.stage}</Text>
                    <Text style={styles.dayValue}>{s.minutes} min</Text>
                  </View>
                ))}
              </Section>
            )}

            {summary.workouts.length > 0 && (
              <Section title="Workouts">
                {summary.workouts.map((w) => (
                  <View key={w.start} style={styles.dayRow}>
                    <Text style={styles.dayLabel}>{w.activity.replace(/_/g, ' ')}</Text>
                    <Text style={styles.dayValue}>{w.minutes} min</Text>
                  </View>
                ))}
              </Section>
            )}

            {summary.unavailable.length > 0 && (
              <Section title="Not available on this platform">
                {summary.unavailable.map((s) => (
                  <View key={s.type} style={styles.dayRow}>
                    <Text style={styles.dayLabel}>{s.type}</Text>
                    <Text style={styles.dayMuted}>
                      {s.counterparts.length > 0 ? `try ${s.counterparts[0]!.type}` : 'not supported here'}
                    </Text>
                  </View>
                ))}
              </Section>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value ?? '—'}
        {value !== null && <Text style={styles.statUnit}> {unit}</Text>}
      </Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F8F7' },
  content: { padding: 20, paddingTop: 72, gap: 14 },
  title: { fontSize: 28, fontWeight: '700', color: '#152120' },
  subtitle: { fontSize: 13, color: '#6B7B79', marginBottom: 6 },
  loading: { marginTop: 40 },
  row: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#D5DEDC' },
  statLabel: { fontSize: 12, color: '#6B7B79', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '600', color: '#152120' },
  statUnit: { fontSize: 13, fontWeight: '400', color: '#6B7B79' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#D5DEDC', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#152120', marginBottom: 2 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayLabel: { width: 92, fontSize: 13, color: '#3E4E4C' },
  dayValue: { flex: 1, fontSize: 14, fontWeight: '500', color: '#152120' },
  dayMuted: { fontSize: 13, color: '#6B7B79' },
  errorCard: { borderColor: '#8F5E00', backgroundColor: '#FBF1DC' },
  errorText: { color: '#8F5E00', fontSize: 14 },
  button: { alignSelf: 'flex-start', backgroundColor: '#0E6F6A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
