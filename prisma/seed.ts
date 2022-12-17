import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  /**
   * User
   */
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

  /**
   * Team
   */
  const adminTeam = await prisma.team.upsert({
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

  const userTeam = await prisma.team.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'User Team',
      balance: 100000,
      users: {
        connect: [{ id: user.id }, { id: user2.id }],
      },
    },
  });

  /**
   * Collection
   */
  const collectionDraft = await prisma.collection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Letters',
      creatorTeamId: userTeam.id,
      status: 'DRAFT',
    },
  });

  const collectionPublished = await prisma.collection.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Numbers',
      creatorTeamId: adminTeam.id,
      status: 'PUBLISHED',
    },
  });

  const collectionArchived = await prisma.collection.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Cities',
      creatorTeamId: adminTeam.id,
      status: 'ARCHIVED',
    },
  });

  /**
   * NFT
   */
  await prisma.nft.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'A',
      image: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      price: 100,
      status: 'DRAFT',
      teamId: userTeam.id,
      collectionId: collectionDraft.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'B',
      image: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      price: 150,
      status: 'PUBLISHED',
      teamId: userTeam.id,
      collectionId: collectionDraft.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'C',
      image: 'ccccccccccccccccccccccccccccccccccccccccc',
      price: 10,
      status: 'ARCHIVED',
      teamId: userTeam.id,
      collectionId: collectionDraft.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'One',
      image: '1111111111111111111111111111111111111111',
      price: 1111,
      status: 'DRAFT',
      teamId: adminTeam.id,
      collectionId: collectionPublished.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Two',
      image: '2222222222222222222222222222222222222222',
      price: 2222,
      status: 'PUBLISHED',
      teamId: adminTeam.id,
      collectionId: collectionPublished.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Three',
      image: '3333333333333333333333333333333333333333',
      price: 3333,
      status: 'ARCHIVED',
      teamId: adminTeam.id,
      collectionId: collectionPublished.id,
    },
  });

  await prisma.nft.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'London',
      image: 'LondonLondonLondonLondonLondonLondonLondon',
      price: 1000,
      status: 'DRAFT',
      teamId: adminTeam.id,
      collectionId: collectionArchived.id,
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
      teamId: adminTeam.id,
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
      teamId: userTeam.id,
      collectionId: collectionArchived.id,
    },
  });

  /**
   * Transaction
   */

  await prisma.transactions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      buyerId: user.id,
      amount: 50,
      nftId: nftArchivedInArchived.id,
      sellerTeamId: adminTeam.id,
    },
  });

  await prisma.transactions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      buyerId: user2.id,
      amount: 100,
      nftId: nftPublishedInArchived.id,
      sellerTeamId: adminTeam.id,
    },
  });

  await prisma.transactions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      buyerId: user.id,
      amount: 150,
      nftId: nftPublishedInArchived.id,
      sellerTeamId: userTeam.id,
    },
  });

  /**
   * User Rating
   */
  await prisma.userRating.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      nftId: nftArchivedInArchived.id,
      rate: 5,
      timestamp: new Date(),
    },
  });

  await prisma.userRating.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: user2.id,
      nftId: nftArchivedInArchived.id,
      rate: 4,
      timestamp: new Date(),
    },
  });

  await prisma.userRating.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: user.id,
      nftId: nftPublishedInArchived.id,
      rate: 5,
      timestamp: new Date(),
    },
  });

  await prisma.userRating.upsert({
    where: { id: 4 },
    update: {},
    create: {
      userId: user2.id,
      nftId: nftPublishedInArchived.id,
      rate: 4,
      timestamp: new Date(),
    },
  });

  await prisma.userRating.upsert({
    where: { id: 5 },
    update: {},
    create: {
      userId: admin.id,
      nftId: nftPublishedInArchived.id,
      rate: 1,
      timestamp: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.log('Error while seeding: ', e);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
