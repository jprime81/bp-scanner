import Share from 'react-native-share';
import {BPReading} from '../types';
import {BPUtils} from '../utils/BPUtils';
import DatabaseService from './DatabaseService';

class ShareService {
  /**
   * Share a single BP reading as text
   */
  async shareReading(reading: BPReading): Promise<void> {
    try {
      const message = BPUtils.formatForSharing(reading);

      await Share.open({
        message,
        title: 'Blood Pressure Reading',
        subject: 'My BP Reading',
      });
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        console.error('Share failed:', error);
        throw error;
      }
    }
  }

  /**
   * Share multiple readings as CSV
   */
  async shareAsCSV(startDate?: string, endDate?: string): Promise<void> {
    try {
      let readings: BPReading[];

      if (startDate && endDate) {
        readings = await DatabaseService.getReadingsByDateRange(startDate, endDate);
      } else {
        readings = await DatabaseService.getAllReadings();
      }

      if (readings.length === 0) {
        throw new Error('No readings to share');
      }

      const csv = BPUtils.exportToCSV(readings);
      const filename = `bp_readings_${new Date().toISOString().split('T')[0]}.csv`;

      await Share.open({
        message: csv,
        title: 'Blood Pressure Data',
        subject: 'My BP Readings',
        filename,
        type: 'text/csv',
      });
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        console.error('CSV share failed:', error);
        throw error;
      }
    }
  }

  /**
   * Share chart image (requires screenshot)
   */
  async shareChartImage(imageUri: string): Promise<void> {
    try {
      await Share.open({
        url: imageUri,
        title: 'Blood Pressure Chart',
        subject: 'My BP Chart',
        type: 'image/png',
      });
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        console.error('Image share failed:', error);
        throw error;
      }
    }
  }

  /**
   * Export all data as JSON (for backup/transfer)
   */
  async exportData(): Promise<void> {
    try {
      const readings = await DatabaseService.getAllReadings();
      const settings = await DatabaseService.getAllSettings();

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        readings,
        settings,
      };

      const json = JSON.stringify(exportData, null, 2);
      const filename = `bp_backup_${new Date().toISOString().split('T')[0]}.json`;

      await Share.open({
        message: json,
        title: 'BP Scanner Data Export',
        subject: 'My BP Data',
        filename,
        type: 'application/json',
      });
    } catch (error) {
      if (error instanceof Error && error.message !== 'User did not share') {
        console.error('Data export failed:', error);
        throw error;
      }
    }
  }
}

export default new ShareService();
