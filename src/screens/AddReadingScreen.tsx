import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {Button} from '../components/Button';
import DatabaseService from '../services/DatabaseService';
import {BPUtils} from '../utils/BPUtils';
import {ArmType, PositionType} from '../types';
import {Colors, Spacing, Typography, BorderRadius, Shadows} from '../theme';

export const AddReadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [arm, setArm] = useState<ArmType>('left');
  const [position, setPosition] = useState<PositionType>('sitting');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDefaults();
  }, []);

  const loadDefaults = async () => {
    try {
      const settings = await DatabaseService.getAllSettings();
      setArm(settings.defaultArm);
      setPosition(settings.defaultPosition);
    } catch (error) {
      console.error('Failed to load defaults:', error);
    }
  };

  const handleSave = async () => {
    const systolicNum = parseInt(systolic, 10);
    const diastolicNum = parseInt(diastolic, 10);
    const pulseNum = parseInt(pulse, 10);

    if (!systolic || !diastolic || !pulse) {
      Alert.alert('Missing Data', 'Please fill in all required fields');
      return;
    }

    const validation = BPUtils.validateReading(systolicNum, diastolicNum, pulseNum);
    if (!validation.valid) {
      Alert.alert('Invalid Reading', validation.errors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      await DatabaseService.addReading({
        timestamp: selectedDate.toISOString(),
        systolic: systolicNum,
        diastolic: diastolicNum,
        pulse: pulseNum,
        notes: notes.trim() || undefined,
        arm,
        position,
        source: 'manual',
      });

      Alert.alert('Success', 'Reading saved successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save reading. Please try again.');
      console.error('Save reading error:', error);
    } finally {
      setSaving(false);
    }
  };

  const category =
    systolic && diastolic
      ? BPUtils.categorizeReading(parseInt(systolic, 10), parseInt(diastolic, 10))
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add Blood Pressure Reading</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Pressure</Text>
        <View style={styles.bpInputRow}>
          <View style={styles.bpInputContainer}>
            <Text style={styles.inputLabel}>Systolic</Text>
            <TextInput
              style={styles.bpInput}
              value={systolic}
              onChangeText={setSystolic}
              keyboardType="number-pad"
              placeholder="120"
              maxLength={3}
            />
            <Text style={styles.inputUnit}>mmHg</Text>
          </View>
          <Text style={styles.separator}>/</Text>
          <View style={styles.bpInputContainer}>
            <Text style={styles.inputLabel}>Diastolic</Text>
            <TextInput
              style={styles.bpInput}
              value={diastolic}
              onChangeText={setDiastolic}
              keyboardType="number-pad"
              placeholder="80"
              maxLength={3}
            />
            <Text style={styles.inputUnit}>mmHg</Text>
          </View>
        </View>

        {category && (
          <View
            style={[
              styles.categoryBadge,
              {backgroundColor: BPUtils.getCategoryColor(category)},
            ]}>
            <Text style={styles.categoryText}>{BPUtils.getCategoryLabel(category)}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Heart Rate</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={pulse}
            onChangeText={setPulse}
            keyboardType="number-pad"
            placeholder="72"
            maxLength={3}
          />
          <Text style={styles.inputUnit}>bpm</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <Button
          title={selectedDate.toLocaleString()}
          onPress={() => setShowDatePicker(true)}
          variant="outline"
        />
        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate}
          onConfirm={date => {
            setShowDatePicker(false);
            setSelectedDate(date);
          }}
          onCancel={() => setShowDatePicker(false)}
          maximumDate={new Date()}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Arm</Text>
          <View style={styles.segmentedControl}>
            <Button
              title="Left"
              onPress={() => setArm('left')}
              variant={arm === 'left' ? 'primary' : 'secondary'}
              size="small"
            />
            <View style={styles.segmentSpacer} />
            <Button
              title="Right"
              onPress={() => setArm('right')}
              variant={arm === 'right' ? 'primary' : 'secondary'}
              size="small"
            />
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Position</Text>
          <View style={styles.segmentedControl}>
            <Button
              title="Sitting"
              onPress={() => setPosition('sitting')}
              variant={position === 'sitting' ? 'primary' : 'secondary'}
              size="small"
            />
            <View style={styles.segmentSpacer} />
            <Button
              title="Standing"
              onPress={() => setPosition('standing')}
              variant={position === 'standing' ? 'primary' : 'secondary'}
              size="small"
            />
            <View style={styles.segmentSpacer} />
            <Button
              title="Lying"
              onPress={() => setPosition('lying')}
              variant={position === 'lying' ? 'primary' : 'secondary'}
              size="small"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes about this reading..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
          fullWidth
        />
        <View style={styles.actionSpacer} />
        <Button
          title={saving ? 'Saving...' : 'Save Reading'}
          onPress={handleSave}
          variant="primary"
          fullWidth
          disabled={saving}
        />
      </View>
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
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  bpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpInputContainer: {
    alignItems: 'center',
  },
  inputLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  bpInput: {
    ...Typography.h1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    textAlign: 'center',
    minWidth: 100,
    ...Shadows.sm,
  },
  separator: {
    ...Typography.h1,
    marginHorizontal: Spacing.md,
    color: Colors.textSecondary,
  },
  inputUnit: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  categoryBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'center',
  },
  categoryText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    ...Typography.h2,
    padding: 0,
  },
  detailRow: {
    marginBottom: Spacing.md,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  segmentedControl: {
    flexDirection: 'row',
  },
  segmentSpacer: {
    width: Spacing.sm,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    minHeight: 100,
    ...Shadows.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionSpacer: {
    width: Spacing.md,
  },
});
