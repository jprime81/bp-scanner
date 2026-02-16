import SQLite from 'react-native-sqlite-storage';
import {BPReading, SyncLog, UserSettings} from '../types';

// Enable promise API
SQLite.enablePromise(true);

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database connection
   */
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'bp_scanner.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createReadingsTable = `
      CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        pulse INTEGER NOT NULL,
        notes TEXT,
        arm TEXT NOT NULL,
        position TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `;

    const createSyncLogTable = `
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        record_count INTEGER NOT NULL,
        error_message TEXT
      );
    `;

    const createSettingsTable = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    await this.db.executeSql(createReadingsTable);
    await this.db.executeSql(createSyncLogTable);
    await this.db.executeSql(createSettingsTable);

    // Create index on timestamp for faster queries
    await this.db.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp DESC);',
    );
  }

  /**
   * Add a new BP reading
   */
  async addReading(reading: Omit<BPReading, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const createdAt = new Date().toISOString();
    const result = await this.db.executeSql(
      `INSERT INTO readings (timestamp, systolic, diastolic, pulse, notes, arm, position, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reading.timestamp,
        reading.systolic,
        reading.diastolic,
        reading.pulse,
        reading.notes || null,
        reading.arm,
        reading.position,
        reading.source,
        createdAt,
      ],
    );

    return result[0].insertId;
  }

  /**
   * Get all readings
   */
  async getAllReadings(): Promise<BPReading[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.executeSql(
      'SELECT * FROM readings ORDER BY timestamp DESC',
    );

    const readings: BPReading[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      readings.push(this.mapRowToReading(results[0].rows.item(i)));
    }

    return readings;
  }

  /**
   * Get readings within date range
   */
  async getReadingsByDateRange(startDate: string, endDate: string): Promise<BPReading[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.executeSql(
      'SELECT * FROM readings WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
      [startDate, endDate],
    );

    const readings: BPReading[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      readings.push(this.mapRowToReading(results[0].rows.item(i)));
    }

    return readings;
  }

  /**
   * Get reading by ID
   */
  async getReadingById(id: number): Promise<BPReading | null> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.executeSql('SELECT * FROM readings WHERE id = ?', [id]);

    if (results[0].rows.length === 0) {
      return null;
    }

    return this.mapRowToReading(results[0].rows.item(0));
  }

  /**
   * Update a reading
   */
  async updateReading(id: number, reading: Partial<BPReading>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const updatedAt = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (reading.timestamp) {
      fields.push('timestamp = ?');
      values.push(reading.timestamp);
    }
    if (reading.systolic !== undefined) {
      fields.push('systolic = ?');
      values.push(reading.systolic);
    }
    if (reading.diastolic !== undefined) {
      fields.push('diastolic = ?');
      values.push(reading.diastolic);
    }
    if (reading.pulse !== undefined) {
      fields.push('pulse = ?');
      values.push(reading.pulse);
    }
    if (reading.notes !== undefined) {
      fields.push('notes = ?');
      values.push(reading.notes);
    }
    if (reading.arm) {
      fields.push('arm = ?');
      values.push(reading.arm);
    }
    if (reading.position) {
      fields.push('position = ?');
      values.push(reading.position);
    }

    fields.push('updated_at = ?');
    values.push(updatedAt);
    values.push(id);

    await this.db.executeSql(
      `UPDATE readings SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
  }

  /**
   * Delete a reading
   */
  async deleteReading(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql('DELETE FROM readings WHERE id = ?', [id]);
  }

  /**
   * Delete all readings
   */
  async deleteAllReadings(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql('DELETE FROM readings');
  }

  /**
   * Add sync log entry
   */
  async addSyncLog(log: Omit<SyncLog, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      'INSERT INTO sync_log (timestamp, status, record_count, error_message) VALUES (?, ?, ?, ?)',
      [log.timestamp, log.status, log.recordCount, log.errorMessage || null],
    );
  }

  /**
   * Get recent sync logs
   */
  async getSyncLogs(limit: number = 10): Promise<SyncLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.executeSql(
      'SELECT * FROM sync_log ORDER BY timestamp DESC LIMIT ?',
      [limit],
    );

    const logs: SyncLog[] = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      const row = results[0].rows.item(i);
      logs.push({
        id: row.id,
        timestamp: row.timestamp,
        status: row.status,
        recordCount: row.record_count,
        errorMessage: row.error_message,
      });
    }

    return logs;
  }

  /**
   * Save settings
   */
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.executeSql(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, JSON.stringify(value)],
    );
  }

  /**
   * Get setting
   */
  async getSetting(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.executeSql('SELECT value FROM settings WHERE key = ?', [
      key,
    ]);

    if (results[0].rows.length === 0) {
      return null;
    }

    return JSON.parse(results[0].rows.item(0).value);
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<UserSettings> {
    const defaults: UserSettings = {
      biometricEnabled: false,
      autoLockMinutes: 5,
      defaultArm: 'left',
      defaultPosition: 'sitting',
      cloudBackupEnabled: true,
      healthSyncEnabled: true,
      reminderEnabled: false,
    };

    try {
      const saved = await this.getSetting('user_settings');
      return saved ? {...defaults, ...saved} : defaults;
    } catch {
      return defaults;
    }
  }

  /**
   * Save all settings
   */
  async saveAllSettings(settings: UserSettings): Promise<void> {
    await this.saveSetting('user_settings', settings);
  }

  /**
   * Helper: Map database row to BPReading object
   */
  private mapRowToReading(row: any): BPReading {
    return {
      id: row.id,
      timestamp: row.timestamp,
      systolic: row.systolic,
      diastolic: row.diastolic,
      pulse: row.pulse,
      notes: row.notes,
      arm: row.arm,
      position: row.position,
      source: row.source,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export default new DatabaseService();
