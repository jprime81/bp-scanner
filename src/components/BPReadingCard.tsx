import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BPReading} from '../types';
import {BPUtils} from '../utils/BPUtils';
import {Colors, Spacing, BorderRadius, Typography, Shadows} from '../theme';

interface BPReadingCardProps {
  reading: BPReading;
  onPress?: () => void;
}

export const BPReadingCard: React.FC<BPReadingCardProps> = ({reading}) => {
  const category = BPUtils.categorizeReading(reading.systolic, reading.diastolic);
  const categoryColor = BPUtils.getCategoryColor(category);
  const categoryLabel = BPUtils.getCategoryLabel(category);
  const date = new Date(reading.timestamp);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{date.toLocaleDateString()}</Text>
          <Text style={styles.time}>{date.toLocaleTimeString()}</Text>
        </View>
        <View style={[styles.badge, {backgroundColor: categoryColor}]}>
          <Text style={styles.badgeText}>{categoryLabel}</Text>
        </View>
      </View>

      <View style={styles.readings}>
        <View style={styles.readingItem}>
          <Text style={styles.readingValue}>
            {reading.systolic}/{reading.diastolic}
          </Text>
          <Text style={styles.readingLabel}>mmHg</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.readingItem}>
          <Text style={styles.readingValue}>{reading.pulse}</Text>
          <Text style={styles.readingLabel}>bpm</Text>
        </View>
      </View>

      {reading.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes} numberOfLines={2}>
            {reading.notes}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.metadata}>
          {reading.arm} arm • {reading.position} • {reading.source}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  date: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  time: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  readings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: Spacing.md,
  },
  readingItem: {
    alignItems: 'center',
  },
  readingValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  readingLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray200,
  },
  notesContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  notes: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: Spacing.sm,
  },
  metadata: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
