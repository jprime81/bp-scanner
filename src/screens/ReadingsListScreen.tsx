import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BPReading} from '../types';
import {BPReadingCard} from '../components/BPReadingCard';
import DatabaseService from '../services/DatabaseService';
import {Colors, Spacing, Typography} from '../theme';

export const ReadingsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadings();
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadReadings);
    return unsubscribe;
  }, [navigation]);

  const loadReadings = async () => {
    try {
      setLoading(true);
      const data = await DatabaseService.getAllReadings();
      setReadings(data);
    } catch (error) {
      console.error('Failed to load readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: BPReading}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ReadingDetail' as never, {id: item.id} as never)
      }>
      <BPReadingCard reading={item} />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Readings Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your blood pressure by adding your first reading
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={readings}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || ''}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxl,
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
});
