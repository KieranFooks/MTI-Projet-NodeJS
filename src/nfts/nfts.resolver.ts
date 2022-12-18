import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/auth/optional-jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { NftModel } from '../Models/nft';
import { CreateNftInput } from './dto/createNft.input';
import { UpdateNftInput } from './dto/updateNft.input';
import { NftsService } from './nfts.service';
import { PaginationInput } from '../users/dto/pagination.input';
import { MostRatedNftOutput } from './dto/most-rated-nft';
import { LogSellNft } from './nfts.interceptor';

@Resolver(NftModel)
export class NftsResolver {
  constructor(@Inject(NftsService) private nftsService: NftsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [NftModel], {
    nullable: 'items',
    name: 'nfts',
    description:
      "Get all NFTs. If a user is not connected or if the user has no team, the published NFTs are returned. If the user has a team, the published NFTs and the NFTs of the user's team are returned. If the user is an admin, all NFTs are returned.",
  })
  nfts(
    @CurrentUser() user: JWTUser,
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
      description: 'Optional argument used to paginate the query.',
    })
    pagination: PaginationInput | null,
  ) {
    return this.nftsService.findAll(user, pagination);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => NftModel, {
    nullable: true,
    name: 'nft',
    description:
      'Get an NFT by its id. If the NFT is not published, the user must be connected and be part of the team that owns the NFT or be an admin.',
  })
  nft(
    @Args('id', { description: 'The id of the requested nft.' }) id: number,
    @CurrentUser() user: JWTUser,
  ) {
    return this.nftsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel, {
    name: 'createNft',
    description:
      'Create a new NFT. You need to be logged in to use this mutation.',
  })
  createNft(
    @Args('nft', { description: 'The nft informations.' }) nft: CreateNftInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.nftsService.create(nft, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel, {
    name: 'updateNft',
    description:
      'Update an NFT informations. You need to be logged in to use this mutation.',
  })
  updateNft(
    @Args('nft', { description: 'The informations to update.' })
    nft: UpdateNftInput,
    @CurrentUser() user: JWTUser,
  ) {
    return this.nftsService.update(nft, user);
  }

  @UseInterceptors(LogSellNft)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel, {
    name: 'buyNft',
    description: 'Buy a nft. You need to be logged in to use this mutation.',
  })
  buyNft(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JWTUser,
  ) {
    return this.nftsService.buyNft(id, user);
  }

  @Query(() => [MostRatedNftOutput], {
    nullable: 'items',
    name: 'mostRatedNfts',
    description: 'Get the X most rated NFTs.',
  })
  mostRatedNfts(
    @Args('top', {
      type: () => Int,
      description: 'The number of NFTs to return.',
    })
    top: number,
  ) {
    return this.nftsService.mostRatedNfts(top);
  }
}
