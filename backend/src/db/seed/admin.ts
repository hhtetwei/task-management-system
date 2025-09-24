
import { UserService } from '@/modules/user/user.service';
import { UserType } from '@/modules/user/types';

export async function seedAdmin(userService: UserService) {
  const adminData = {
    email: 'admin@system.com',
    name: 'Admin',
    phoneNumber: '0000000000',
    password: '123456',
    type: UserType.ADMIN,
    profileImage: null,
  };

  const existingAdmin = await userService.getUserByEmail(adminData.email);

  if (!existingAdmin) {
    await userService.createUser(adminData);
    console.log('✅ Admin seeded successfully');
  } else {
    console.log('Admin already exists');
  }
}
