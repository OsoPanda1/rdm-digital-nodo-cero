import crypto from 'crypto';

export type Emotion = 'amor' | 'tristeza' | 'miedo' | 'odio' | 'asombro' | 'neutral';

export interface BookPIRecord {
  id: string;
  userId: string;
  cleanInput: string;
  intent: string;
  emotion: Emotion;
  routePlan: string[];
  miniResults: Record<string, unknown>[];
  createdAt: string;
  previousHash: string;
  hash: string;
}

class BookPIStore {
  private readonly records: BookPIRecord[] = [];

  append(record: Omit<BookPIRecord, 'id' | 'createdAt' | 'previousHash' | 'hash'>): BookPIRecord {
    const previousHash = this.records.at(-1)?.hash ?? 'GENESIS';
    const createdAt = new Date().toISOString();
    const id = crypto.randomUUID();
    const hash = this.makeHash({ ...record, id, createdAt, previousHash });

    const finalRecord: BookPIRecord = {
      ...record,
      id,
      createdAt,
      previousHash,
      hash,
    };

    this.records.push(finalRecord);
    return finalRecord;
  }

  byUser(userId: string): BookPIRecord[] {
    return this.records.filter((record) => record.userId === userId);
  }

  latest(limit = 25): BookPIRecord[] {
    return this.records.slice(-limit).reverse();
  }

  private makeHash(data: unknown): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }
}

export const bookpiStore = new BookPIStore();
