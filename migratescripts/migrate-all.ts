import { PrismaClient } from '@prisma/client';

// Import migration functions
import migrateUsers  from './01-migrate-users';
import migrateCategories from './02-migrate-categories';
import migratePosts from './03-migrate-posts';
import migrateCategoryToPost from './04-migrate-category-to-post';

const prisma = new PrismaClient();

async function migrateAll() {
  try {
    console.log('Starting full database migration...');
    
    // Run migrations in order
    await migrateUsers();
    console.log('Users migration completed.');
    
    await migrateCategories();
    console.log('Categories migration completed.');
    
    await migratePosts();
    console.log('Posts migration completed.');
    
    await migrateCategoryToPost();
    console.log('Category-to-post relationships migration completed.');
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run all migrations
if (require.main === module) {
  migrateAll().catch(console.error);
} 