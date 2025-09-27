import * as bcrypt from 'bcrypt';
import AppDataSource from '../data-source';
import { User } from '../../modules/user/user.entity';
import { UserType } from '@/modules/user/types'; 

async function runSeed() {
  const ds = await AppDataSource.initialize();
  const userRepo = ds.getRepository(User);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@system.com';
  const password = process.env.SEED_ADMIN_PASSWORD || '123456';

  const exists = await userRepo.findOne({ where: { email } });
  if (exists) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = userRepo.create({
    email,
    password: hashedPassword,
    salt,
    name: 'Admin',
    phoneNumber: '0000000000', 
    type: UserType.ADMIN,      
  });

  await userRepo.save(admin);
  console.log('✅ Admin user seeded');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Seed error', err);
  process.exit(1);
});
