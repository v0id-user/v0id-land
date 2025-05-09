import { z } from 'zod';
import { CSVMigrator } from './csvMigrator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migratePosts() {
  const postSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string().transform(val => new Date(val)),
    updatedAt: z.string().transform(val => new Date(val)),
    authorId: z.string(),
    signature: z.string().nullable(),
    signedWithGPG: z.string().transform(val => val === 'true'),
    workbar: z.string().transform(val => val === 'true'),
    status: z.enum(['PUBLISHED', 'DRAFT']),
  });

  const migrator = new CSVMigrator({
    csvPath: './Post.csv',
    validationSchema: postSchema,
    batchSize: 10, // Smaller batch size due to larger content
    onProgress: (progress) => console.log(`Processed ${progress} posts`),
    transform: async (data) => {
      // First verify that the author exists
      const author = await prisma.user.findUnique({
        where: { id: data.authorId },
      });

      if (!author) {
        throw new Error(`Author with ID ${data.authorId} not found for post ${data.id}`);
      }

      await prisma.post.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          slug: data.slug,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          authorId: data.authorId,
          signature: data.signature,
          signedWithGPG: data.signedWithGPG,
          workbar: data.workbar,
          status: data.status,
        },
        update: {
          slug: data.slug,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          signature: data.signature,
          signedWithGPG: data.signedWithGPG,
          workbar: data.workbar,
          status: data.status,
        },
      });
    },
  });

  try {
    console.log('Starting post migration...');
    const stats = await migrator.migrate();
    console.log('Post migration completed:', stats);
  } catch (error) {
    console.error('Post migration failed:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  migratePosts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} 

export default migratePosts;