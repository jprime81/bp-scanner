import {BPUtils} from '../utils/BPUtils';
import {BPParser} from '../utils/BPParser';
import {BPReading, ReadingSource} from '../types';

describe('BPUtils', () => {
  describe('categorizeReading', () => {
    it('should categorize normal BP correctly', () => {
      expect(BPUtils.categorizeReading(110, 70)).toBe('normal');
      expect(BPUtils.categorizeReading(119, 79)).toBe('normal');
    });

    it('should categorize elevated BP correctly', () => {
      expect(BPUtils.categorizeReading(120, 75)).toBe('elevated');
      expect(BPUtils.categorizeReading(129, 79)).toBe('elevated');
    });

    it('should categorize high stage 1 correctly', () => {
      expect(BPUtils.categorizeReading(130, 80)).toBe('high_stage1');
      expect(BPUtils.categorizeReading(139, 89)).toBe('high_stage1');
    });

    it('should categorize high stage 2 correctly', () => {
      expect(BPUtils.categorizeReading(140, 90)).toBe('high_stage2');
      expect(BPUtils.categorizeReading(160, 100)).toBe('high_stage2');
    });

    it('should categorize crisis correctly', () => {
      expect(BPUtils.categorizeReading(180, 120)).toBe('crisis');
      expect(BPUtils.categorizeReading(190, 125)).toBe('crisis');
    });
  });

  describe('validateReading', () => {
    it('should validate correct readings', () => {
      const result = BPUtils.validateReading(120, 80, 72);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid systolic', () => {
      const result = BPUtils.validateReading(300, 80, 72);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Systolic must be between 70 and 250 mmHg');
    });

    it('should reject invalid diastolic', () => {
      const result = BPUtils.validateReading(120, 200, 72);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Diastolic must be between 40 and 150 mmHg');
    });

    it('should reject diastolic >= systolic', () => {
      const result = BPUtils.validateReading(80, 120, 72);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Diastolic must be lower than systolic');
    });

    it('should reject invalid pulse', () => {
      const result = BPUtils.validateReading(120, 80, 300);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pulse must be between 40 and 200 bpm');
    });
  });

  describe('exportToCSV', () => {
    it('should export readings to CSV format', () => {
      const readings: BPReading[] = [
        {
          id: 1,
          timestamp: '2026-02-16T08:30:00Z',
          systolic: 120,
          diastolic: 80,
          pulse: 72,
          notes: 'Morning reading',
          arm: 'left',
          position: 'sitting',
          source: 'manual' as ReadingSource,
          createdAt: '2026-02-16T08:30:00Z',
        },
      ];

      const csv = BPUtils.exportToCSV(readings);

      expect(csv).toContain('Date,Time,Systolic,Diastolic,Pulse');
      expect(csv).toContain('120,80,72');
      expect(csv).toContain('left,sitting,manual');
      expect(csv).toContain('"Morning reading"');
    });
  });
});

describe('BPParser', () => {
  describe('parseOCRText', () => {
    it('should parse standard format: 120/80 72', () => {
      const result = BPParser.parseOCRText('120/80 72');
      expect(result.systolic).toBe(120);
      expect(result.diastolic).toBe(80);
      expect(result.pulse).toBe(72);
    });

    it('should parse format with HR label: 120/80 HR:72', () => {
      const result = BPParser.parseOCRText('120/80 HR:72');
      expect(result.systolic).toBe(120);
      expect(result.diastolic).toBe(80);
      expect(result.pulse).toBe(72);
    });

    it('should parse format with labels: SYS 120 DIA 80 PUL 72', () => {
      const result = BPParser.parseOCRText('SYS 120 DIA 80 PUL 72');
      expect(result.systolic).toBe(120);
      expect(result.diastolic).toBe(80);
      expect(result.pulse).toBe(72);
    });

    it('should handle whitespace variations', () => {
      const result = BPParser.parseOCRText('  120  /  80    72  ');
      expect(result.systolic).toBe(120);
      expect(result.diastolic).toBe(80);
      expect(result.pulse).toBe(72);
    });

    it('should reject invalid values', () => {
      const result = BPParser.parseOCRText('300/200 500');
      expect(result.systolic).toBeNull();
      expect(result.diastolic).toBeNull();
      expect(result.pulse).toBeNull();
    });

    it('should return null for unparseable text', () => {
      const result = BPParser.parseOCRText('random text with no numbers');
      expect(result.systolic).toBeNull();
      expect(result.diastolic).toBeNull();
      expect(result.pulse).toBeNull();
    });
  });

  describe('extractPulse', () => {
    it('should extract pulse with various labels', () => {
      expect(BPParser.extractPulse('Pulse: 72')).toBe(72);
      expect(BPParser.extractPulse('HR 72')).toBe(72);
      expect(BPParser.extractPulse('Heart Rate: 72')).toBe(72);
      expect(BPParser.extractPulse('72 bpm')).toBe(72);
    });

    it('should return null for invalid pulse', () => {
      expect(BPParser.extractPulse('Pulse: 500')).toBeNull();
      expect(BPParser.extractPulse('no pulse here')).toBeNull();
    });
  });
});
