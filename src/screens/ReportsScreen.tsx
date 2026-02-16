import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Spacing, Typography} from '../theme';

export const ReportsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.subtitle}>
        Charts and analytics will be displayed here
      </Text>
      <Text style={styles.info}>
        This screen will show daily, weekly, and monthly graphs of your blood pressure
        readings with statistics.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  info: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
