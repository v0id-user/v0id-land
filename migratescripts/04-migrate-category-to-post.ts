import { z } from 'zod';
import { CSVMigrator } from './csvMigrator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateCategoryToPost() {
  const categoryToPostSchema = z.object({
    A: z.string(), // categoryId
    B: z.string(), // postId
  });

  const migrator = new CSVMigrator({
    csvPath: './_CategoryToPost.csv',
    validationSchema: categoryToPostSchema,
    batchSize: 50,
    onProgress: (progress) => console.log(`Processed ${progress} category-post relationships`),
    transform: async (data) => {
      // Verify that both category and post exist
      const [category, post] = await Promise.all([
        prisma.category.findUnique({ where: { id: data.A } }),
        prisma.post.findUnique({ where: { id: data.B } }),
      ]);

      if (!category) {
        throw new Error(`Category with ID ${data.A} not found`);
      }
      if (!post) {
        throw new Error(`Post with ID ${data.B} not found`);
      }

      // Connect the category and post
      await prisma.post.update({
        where: { id: data.B },
        data: {
          categories: {
            connect: { id: data.A },
          },
        },
      });
    },
  });

  try {
    console.log('Starting category-to-post relationship migration...');
    const stats = await migrator.migrate();
    console.log('Category-to-post relationship migration completed:', stats);
  } catch (error) {
    console.error('Category-to-post relationship migration failed:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migrateCategoryToPost()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} 

export default migrateCategoryToPost; 