import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generic type for CSV row validation
type ValidationSchema<T> = z.ZodType<T, z.ZodTypeDef, any>;

interface MigrationOptions<T> {
  csvPath: string;
  validationSchema: ValidationSchema<T>;
  batchSize?: number;
  onProgress?: (progress: number) => void;
  transform?: (data: T) => Promise<any>;
}

export class CSVMigrator<T> {
  private options: MigrationOptions<T>;

  constructor(options: MigrationOptions<T>) {
    this.options = {
      batchSize: 100,
      ...options,
    };
  }

  async migrate(): Promise<{ success: number; failed: number }> {
    const stats = { success: 0, failed: 0 };
    let batch: T[] = [];

    return new Promise((resolve, reject) => {
      createReadStream(this.options.csvPath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on('data', async (row: any) => {
          try {
            const validatedRow = this.options.validationSchema.parse(row);
            batch.push(validatedRow);

            if (batch.length >= (this.options.batchSize || 100)) {
              await this.processBatch(batch);
              stats.success += batch.length;
              batch = [];
              this.options.onProgress?.(stats.success);
            }
          } catch (error) {
            console.error('Row validation failed:', error);
            stats.failed++;
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            await this.processBatch(batch);
            stats.success += batch.length;
          }
          resolve(stats);
        })
        .on('error', reject);
    });
  }

  private async processBatch(batch: T[]): Promise<void> {
    if (this.options.transform) {
      await Promise.all(batch.map(this.options.transform));
    }
  }
}

// Example usage:
/*
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.string().transform(val => parseInt(val)),
});

const migrator = new CSVMigrator({
  csvPath: './users.csv',
  validationSchema: userSchema,
  batchSize: 50,
  onProgress: (progress) => console.log(`Processed ${progress} rows`),
  transform: async (data) => {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        age: data.age,
      },
    });
  },
});

migrator.migrate()
  .then(stats => console.log('Migration completed:', stats))
  .catch(console.error);
*/ 