import { z } from 'zod';
import { CSVMigrator } from './csvMigrator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateCategories() {
  const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.string().transform(val => new Date(val)),
    updatedAt: z.string().transform(val => new Date(val)),
  });

  const migrator = new CSVMigrator({
    csvPath: './Category.csv',
    validationSchema: categorySchema,
    batchSize: 50,
    onProgress: (progress) => console.log(`Processed ${progress} categories`),
    transform: async (data) => {
      await prisma.category.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          name: data.name,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        update: {
          name: data.name,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    },
  });

  try {
    console.log('Starting category migration...');
    const stats = await migrator.migrate();
    console.log('Category migration completed:', stats);
  } catch (error) {
    console.error('Category migration failed:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateCategories()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} 

export default migrateCategories;