import prisma from '../../src/client';

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
