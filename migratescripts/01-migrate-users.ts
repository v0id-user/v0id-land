import { z } from 'zod';
import { CSVMigrator } from './csvMigrator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUsers() {
  const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    RegisterGPGKeyId: z.string().nullable(),
    password: z.string(),
  });

  const migrator = new CSVMigrator({
    csvPath: './User.csv',
    validationSchema: userSchema,
    batchSize: 50,
    onProgress: (progress) => console.log(`Processed ${progress} users`),
    transform: async (data) => {
      // Using upsert to handle potential conflicts
      await prisma.user.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          email: data.email,
          name: data.name,
          RegisterGPGKeyId: data.RegisterGPGKeyId!,
          password: data.password,
        },
        update: {
          email: data.email,
          name: data.name,
          RegisterGPGKeyId: data.RegisterGPGKeyId!,
          password: data.password,
        },
      });
    },
  });

  try {
    console.log('Starting user migration...');
    const stats = await migrator.migrate();
    console.log('User migration completed:', stats);
  } catch (error) {
    console.error('User migration failed:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateUsers()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

export default migrateUsers;