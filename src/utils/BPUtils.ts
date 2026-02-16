import {BPReading, BPCategory} from '../types';

export class BPUtils {
  /**
   * Categorize blood pressure reading according to AHA guidelines
   */
  static categorizeReading(systolic: number, diastolic: number): BPCategory {
    if (systolic >= 180 || diastolic >= 120) {
      return 'crisis';
    } else if (systolic >= 140 || diastolic >= 90) {
      return 'high_stage2';
    } else if (systolic >= 130 || diastolic >= 80) {
      return 'high_stage1';
    } else if (systolic >= 120 && diastolic < 80) {
      return 'elevated';
    } else {
      return 'normal';
    }
  }

  /**
   * Get color for BP category
   */
  static getCategoryColor(category: BPCategory): string {
    const colors = {
      normal: '#22C55E', // green
      elevated: '#EAB308', // yellow
      high_stage1: '#F97316', // orange
      high_stage2: '#EF4444', // red
      crisis: '#DC2626', // dark red
    };
    return colors[category];
  }

  /**
   * Get label for BP category
   */
  static getCategoryLabel(category: BPCategory): string {
    const labels = {
      normal: 'Normal',
      elevated: 'Elevated',
      high_stage1: 'High (Stage 1)',
      high_stage2: 'High (Stage 2)',
      crisis: 'Crisis',
    };
    return labels[category];
  }

  /**
   * Validate BP reading values
   */
  static validateReading(systolic: number, diastolic: number, pulse: number): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (systolic < 70 || systolic > 250) {
      errors.push('Systolic must be between 70 and 250 mmHg');
    }

    if (diastolic < 40 || diastolic > 150) {
      errors.push('Diastolic must be between 40 and 150 mmHg');
    }

    if (pulse < 40 || pulse > 200) {
      errors.push('Pulse must be between 40 and 200 bpm');
    }

    if (diastolic >= systolic) {
      errors.push('Diastolic must be lower than systolic');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format BP reading for display
   */
  static formatReading(reading: BPReading): string {
    return `${reading.systolic}/${reading.diastolic} mmHg, Pulse: ${reading.pulse} bpm`;
  }

  /**
   * Format BP reading for sharing
   */
  static formatForSharing(reading: BPReading): string {
    const category = this.categorizeReading(reading.systolic, reading.diastolic);
    const date = new Date(reading.timestamp).toLocaleString();
    return `Blood Pressure Reading\n\nSystolic: ${reading.systolic} mmHg\nDiastolic: ${reading.diastolic} mmHg\nPulse: ${reading.pulse} bpm\nCategory: ${this.getCategoryLabel(category)}\nDate: ${date}\n${reading.notes ? `Notes: ${reading.notes}` : ''}`;
  }

  /**
   * Convert readings to CSV format
   */
  static exportToCSV(readings: BPReading[]): string {
    const header =
      'Date,Time,Systolic,Diastolic,Pulse,Category,Arm,Position,Source,Notes\n';
    const rows = readings.map(r => {
      const date = new Date(r.timestamp);
      const category = this.categorizeReading(r.systolic, r.diastolic);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        r.systolic,
        r.diastolic,
        r.pulse,
        this.getCategoryLabel(category),
        r.arm,
        r.position,
        r.source,
        `"${r.notes?.replace(/"/g, '""') || ''}"`,
      ].join(',');
    });
    return header + rows.join('\n');
  }
}
