import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DatabaseService from './DatabaseService';
import {BackupData} from '../types';

class CloudBackupService {
  private userId: string | null = null;

  /**
   * Initialize Firebase Auth and get user ID
   */
  async init(): Promise<void> {
    const user = auth().currentUser;
    if (user) {
      this.userId = user.uid;
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<void> {
    try {
      // Google Sign-In implementation will go here
      // Requires @react-native-google-signin/google-signin setup
      console.log('Google Sign-In placeholder');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  }

  /**
   * Sign in with email/password
   */
  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      this.userId = userCredential.user.uid;
    } catch (error) {
      console.error('Email sign-in failed:', error);
      throw error;
    }
  }

  /**
   * Sign up with email/password
   */
  async signUpWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      this.userId = userCredential.user.uid;
    } catch (error) {
      console.error('Email sign-up failed:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await auth().signOut();
    this.userId = null;
  }

  /**
   * Create backup data object
   */
  private async createBackupData(): Promise<BackupData> {
    const readings = await DatabaseService.getAllReadings();
    const settings = await DatabaseService.getAllSettings();

    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      readings,
      settings,
    };
  }

  /**
   * Upload backup to Firebase Storage
   */
  async createBackup(): Promise<void> {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      const backupData = await this.createBackupData();
      const backupJson = JSON.stringify(backupData);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `bp_data_${timestamp}.json`;
      const path = `users/${this.userId}/backups/${filename}`;

      // Upload to Firebase Storage
      const reference = storage().ref(path);
      await reference.putString(backupJson, 'raw', {
        contentType: 'application/json',
      });

      // Log successful backup
      await DatabaseService.addSyncLog({
        timestamp: new Date().toISOString(),
        status: 'success',
        recordCount: backupData.readings.length,
      });

      console.log('Backup created successfully:', filename);
    } catch (error) {
      // Log failed backup
      await DatabaseService.addSyncLog({
        timestamp: new Date().toISOString(),
        status: 'failed',
        recordCount: 0,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      console.error('Backup failed:', error);
      throw error;
    }
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<
    Array<{name: string; created: Date; size: number; url: string}>
  > {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      const path = `users/${this.userId}/backups/`;
      const reference = storage().ref(path);
      const result = await reference.listAll();

      const backups = await Promise.all(
        result.items.map(async item => {
          const metadata = await item.getMetadata();
          const url = await item.getDownloadURL();
          return {
            name: item.name,
            created: new Date(metadata.timeCreated),
            size: metadata.size,
            url,
          };
        }),
      );

      // Sort by creation date (newest first)
      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  }

  /**
   * Download and restore backup
   */
  async restoreBackup(backupUrl: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      // Download backup file
      const response = await fetch(backupUrl);
      const backupData: BackupData = await response.json();

      // Validate backup format
      if (!backupData.version || !backupData.readings) {
        throw new Error('Invalid backup format');
      }

      // Clear existing data (optional - could merge instead)
      // await DatabaseService.deleteAllReadings();

      // Restore readings (avoid duplicates by timestamp)
      for (const reading of backupData.readings) {
        try {
          // Check if reading already exists
          const existing = await DatabaseService.getReadingsByDateRange(
            reading.timestamp,
            reading.timestamp,
          );

          if (existing.length === 0) {
            await DatabaseService.addReading({
              timestamp: reading.timestamp,
              systolic: reading.systolic,
              diastolic: reading.diastolic,
              pulse: reading.pulse,
              notes: reading.notes,
              arm: reading.arm,
              position: reading.position,
              source: reading.source,
            });
          }
        } catch (error) {
          console.error('Failed to restore reading:', error);
        }
      }

      // Restore settings
      if (backupData.settings) {
        await DatabaseService.saveAllSettings(backupData.settings);
      }

      console.log('Backup restored successfully');
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupName: string): Promise<void> {
    if (!this.userId) {
      throw new Error('User not authenticated');
    }

    try {
      const path = `users/${this.userId}/backups/${backupName}`;
      const reference = storage().ref(path);
      await reference.delete();
      console.log('Backup deleted:', backupName);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.userId !== null;
  }
}

export default new CloudBackupService();
