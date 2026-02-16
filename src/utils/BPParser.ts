export class BPParser {
  /**
   * Parse OCR text to extract BP readings
   */
  static parseOCRText(text: string): {
    systolic: number | null;
    diastolic: number | null;
    pulse: number | null;
  } {
    // Remove whitespace and normalize
    const normalized = text.replace(/\s+/g, ' ').trim();

    // Try various patterns
    const patterns = [
      // Pattern: 120/80 72
      /(\d{2,3})\s*\/\s*(\d{2,3})\s+(\d{2,3})/,
      // Pattern: 120/80 HR:72 or 120/80 HR 72
      /(\d{2,3})\s*\/\s*(\d{2,3})\s+(?:HR|hr|Hr|Pulse|pulse)[\s:]*(\d{2,3})/,
      // Pattern: SYS 120 DIA 80 PUL 72
      /(?:SYS|sys|Sys)[\s:]*(\d{2,3})\s+(?:DIA|dia|Dia)[\s:]*(\d{2,3})\s+(?:PUL|pul|Pul|HR|hr)[\s:]*(\d{2,3})/,
      // Pattern: 120 / 80 (pulse separate)
      /(\d{2,3})\s*\/\s*(\d{2,3})/,
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match) {
        const systolic = parseInt(match[1], 10);
        const diastolic = parseInt(match[2], 10);
        const pulse = match[3] ? parseInt(match[3], 10) : null;

        // Validate ranges
        if (
          systolic >= 70 &&
          systolic <= 250 &&
          diastolic >= 40 &&
          diastolic <= 150 &&
          diastolic < systolic
        ) {
          return {systolic, diastolic, pulse};
        }
      }
    }

    // Try to find numbers individually if patterns fail
    const numbers = normalized.match(/\d{2,3}/g);
    if (numbers && numbers.length >= 2) {
      const nums = numbers.map(n => parseInt(n, 10));
      // Look for valid systolic/diastolic pairs
      for (let i = 0; i < nums.length - 1; i++) {
        if (
          nums[i] >= 70 &&
          nums[i] <= 250 &&
          nums[i + 1] >= 40 &&
          nums[i + 1] <= 150 &&
          nums[i + 1] < nums[i]
        ) {
          return {
            systolic: nums[i],
            diastolic: nums[i + 1],
            pulse: nums[i + 2] || null,
          };
        }
      }
    }

    return {systolic: null, diastolic: null, pulse: null};
  }

  /**
   * Extract pulse separately from text (if not found in main parsing)
   */
  static extractPulse(text: string): number | null {
    const pulsePatterns = [
      /(?:pulse|hr|heart rate)[\s:]*(\d{2,3})/i,
      /(\d{2,3})\s*(?:bpm|beats)/i,
    ];

    for (const pattern of pulsePatterns) {
      const match = text.match(pattern);
      if (match) {
        const pulse = parseInt(match[1], 10);
        if (pulse >= 40 && pulse <= 200) {
          return pulse;
        }
      }
    }

    return null;
  }
}
