// libs/your-app/src/check-db.ts
import {PrismaClient} from '../../../generated/prisma/client.js';

// Потрібно, щоб завантажити .env, якщо ви його використовуєте
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Вмикаємо детальні логи Prisma
});

async function main() {
  console.log('Attempting to connect to the database...');
  try {
    await prisma.$connect(); // Явно намагаємось підключитися
    console.log('✅ Prisma client connected successfully.');

    const userCount = await prisma.users.count();
    console.log(`✅ Successfully queried the database! Found ${userCount} users.`);

  } catch (error) {
    console.error('❌ Failed to connect to or query the database:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

main();