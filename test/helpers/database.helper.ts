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

  const user4 = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Test4',
      email: 'test4@test.com',
      password: await bcrypt.hash('test', 10),
      role: 'USER',
      blockchainAddress: '0x0000000000000000000000000000000000000002',
    },
  });

  const team1 = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Admin Team',
      balance: 100000,
      users: {
        connect: [{ id: admin.id }],
      },
    },
  });

  const team2 = await prisma.team.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'User Team',
      balance: 100000,
      users: {
        connect: [{ id: user4.id }],
      },
    },
  });

  const collectionArchived = await prisma.collection.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Cities',
      creatorTeamId: team1.id,
      status: 'ARCHIVED',
    },
  });

  const nftPublishedInArchived = await prisma.nft.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Paris',
      image: 'ParisParisParisParisParisParisParisParis',
      price: 2000,
      status: 'PUBLISHED',
      teamId: team1.id,
      collectionId: collectionArchived.id,
    },
  });

  const nftArchivedInArchived = await prisma.nft.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'Rome',
      image: 'RomeRomeRomeRomeRomeRomeRomeRomeRomeRome',
      price: 3000,
      status: 'ARCHIVED',
      teamId: team2.id,
      collectionId: collectionArchived.id,
    },
  });

  await prisma.transactions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      buyerId: user.id,
      amount: 50,
      nftId: nftArchivedInArchived.id,
      sellerTeamId: team1.id,
    },
  });

  await prisma.transactions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      buyerId: user2.id,
      amount: 100,
      nftId: nftPublishedInArchived.id,
      sellerTeamId: team1.id,
    },
  });

  await prisma.transactions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      buyerId: user.id,
      amount: 200,
      nftId: nftPublishedInArchived.id,
      sellerTeamId: team2.id,
    },
  });

  return { admin, user, user2, user3, user4, team1, team2 };
}

export async function clearDatabase(): Promise<void> {
  const deleteGuild = prisma.userRating.deleteMany();
  const deleteUser = prisma.user.deleteMany();
  const deleteCharacter = prisma.team.deleteMany();
  const deleteEquipment = prisma.nft.deleteMany();
  const deleteEquipmentBase = prisma.transactions.deleteMany();
  const deleteStat = prisma.collection.deleteMany();

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
