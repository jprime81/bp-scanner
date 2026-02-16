import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../components/Button';
import {Colors, Spacing, Typography} from '../theme';

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleScanSimulation = () => {
    // Simulate OCR detection
    Alert.alert(
      'Scanned Values',
      'This is a placeholder for the camera/OCR functionality.\n\nDetected: 120/80 mmHg, Pulse: 72 bpm',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm & Save',
          onPress: () => {
            // Navigate to AddReading with pre-filled values
            navigation.navigate('AddReading' as never);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan BP Device</Text>
        <Text style={styles.subtitle}>
          This screen will display the camera preview for scanning blood pressure device
          displays
        </Text>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to scan:</Text>
          <Text style={styles.instructionText}>
            1. Position your BP device display within the frame
          </Text>
          <Text style={styles.instructionText}>
            2. Ensure good lighting and clear visibility
          </Text>
          <Text style={styles.instructionText}>
            3. Capture the image when ready
          </Text>
          <Text style={styles.instructionText}>
            4. Confirm the detected values before saving
          </Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📷 Camera Preview</Text>
          <Text style={styles.placeholderSubtext}>
            Camera integration requires react-native-vision-camera setup
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Simulate Scan"
            onPress={handleScanSimulation}
            variant="primary"
            fullWidth
          />
          <View style={styles.actionSpacer} />
          <Button
            title="Manual Entry Instead"
            onPress={() => navigation.navigate('AddReading' as never)}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  instructions: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  instructionTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  placeholder: {
    flex: 1,
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    minHeight: 300,
  },
  placeholderText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  placeholderSubtext: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  actions: {
    marginBottom: Spacing.lg,
  },
  actionSpacer: {
    height: Spacing.sm,
  },
});
