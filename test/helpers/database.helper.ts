import prisma from '../../src/client';
import * as bcrypt from 'bcrypt';

export async function initDatabaseForTeamsTests() {
  const admin = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin', 10),
      role: 'ADMIN',
      blockchainAddress: '0x0000000000000000000000000000000000000000',
    },
  });

  const user = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Test',
      email: 'test@test.com',
      password: await bcrypt.hash('test', 10),
      role: 'USER',
      blockchainAddress: '0x0000000000000000000000000000000000000001',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Test2',
      email: 'test2@test.com',
      password: await bcrypt.hash('test', 10),
      role: 'USER',
      blockchainAddress: '0x0000000000000000000000000000000000000002',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Test3',
      email: 'test3@test.com',
      password: await bcrypt.hash('test', 10),
      role: 'USER',
      blockchainAddress: '0x0000000000000000000000000000000000000002',
    },
  });

  return { admin: admin, user1: user, user2: user2, user3: user3 };
}

export async function clearDatabase(): Promise<void> {
  const deleteUser = prisma.user.deleteMany();
  const deleteCharacter = prisma.team.deleteMany();
  const deleteEquipment = prisma.nft.deleteMany();
  const deleteEquipmentBase = prisma.transactions.deleteMany();
  const deleteStat = prisma.collection.deleteMany();
  const deleteGuild = prisma.userRating.deleteMany();

  await prisma.$transaction([
    deleteUser,
    deleteCharacter,
    deleteEquipment,
    deleteEquipmentBase,
    deleteStat,
    deleteGuild,
  ]);

  await prisma.$disconnect();
}
