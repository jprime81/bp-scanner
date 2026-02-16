import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BPReading, BPStatistics} from '../types';
import {BPReadingCard} from '../components/BPReadingCard';
import {Button} from '../components/Button';
import DatabaseService from '../services/DatabaseService';
import {BPUtils} from '../utils/BPUtils';
import {Colors, Spacing, Typography, BorderRadius, Shadows} from '../theme';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [latestReading, setLatestReading] = useState<BPReading | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<BPStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      const readings = await DatabaseService.getAllReadings();

      if (readings.length > 0) {
        setLatestReading(readings[0]);

        // Calculate weekly statistics
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyReadings = readings.filter(
          r => new Date(r.timestamp) >= weekAgo,
        );

        if (weeklyReadings.length > 0) {
          const stats = calculateStatistics(weeklyReadings);
          setWeeklyStats(stats);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (readings: BPReading[]): BPStatistics => {
    const systolicValues = readings.map(r => r.systolic);
    const diastolicValues = readings.map(r => r.diastolic);

    return {
      min: {
        systolic: Math.min(...systolicValues),
        diastolic: Math.min(...diastolicValues),
      },
      max: {
        systolic: Math.max(...systolicValues),
        diastolic: Math.max(...diastolicValues),
      },
      average: {
        systolic: Math.round(
          systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length,
        ),
        diastolic: Math.round(
          diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length,
        ),
      },
      count: readings.length,
    };
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Blood Pressure Monitor</Text>
        <Text style={styles.subtitle}>Track your health daily</Text>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Add Reading"
          onPress={() => navigation.navigate('AddReading' as never)}
          variant="primary"
          fullWidth
          size="large"
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Scan BP Device"
          onPress={() => navigation.navigate('CameraScreen' as never)}
          variant="outline"
          fullWidth
        />
      </View>

      {latestReading ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Reading</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ReadingDetail' as never, {id: latestReading.id} as never)
            }>
            <BPReadingCard reading={latestReading} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No readings yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your blood pressure by adding your first reading
          </Text>
        </View>
      )}

      {weeklyStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average</Text>
                <Text style={styles.statValue}>
                  {weeklyStats.average.systolic}/{weeklyStats.average.diastolic}
                </Text>
                <Text style={styles.statUnit}>mmHg</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Readings</Text>
                <Text style={styles.statValue}>{weeklyStats.count}</Text>
                <Text style={styles.statUnit}>total</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewReportsButton}
            onPress={() => navigation.navigate('Reports' as never)}>
            <Text style={styles.viewReportsText}>View Detailed Reports →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  actionButtons: {
    marginBottom: Spacing.lg,
  },
  buttonSpacer: {
    height: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  statUnit: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray200,
  },
  viewReportsButton: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  viewReportsText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
});
