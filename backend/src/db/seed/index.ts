
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { UserService } from '@/modules/user/user.service';
import { seedAdmin } from './admin';

async function runSeeds() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  await seedAdmin(userService);

  await app.close();
  console.log('✅ Seeding finished');
}

runSeeds().catch((err) => {
  console.error('❌ Seeding failed', err);
  process.exit(1);
});
