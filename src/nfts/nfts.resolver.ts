import { Inject, UseGuards } from '@nestjs/common';
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

@Resolver(NftModel)
export class NftsResolver {
  constructor(@Inject(NftsService) private nftsService: NftsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [NftModel], { nullable: 'items' })
  nfts(
    @CurrentUser() user: JWTUser,
    @Args('pagination', { nullable: true, type: () => PaginationInput })
    pagination: PaginationInput | null,
  ) {
    return this.nftsService.findAll(user, pagination);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => NftModel, { nullable: true })
  nft(@Args('id') id: number, @CurrentUser() user: JWTUser) {
    return this.nftsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel)
  createNft(@Args('nft') nft: CreateNftInput, @CurrentUser() user: JWTUser) {
    return this.nftsService.create(nft, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel)
  updateNft(@Args('nft') nft: UpdateNftInput, @CurrentUser() user: JWTUser) {
    return this.nftsService.update(nft, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => NftModel)
  buyNft(@Args('id') id: number, @CurrentUser() user: JWTUser) {
    return this.nftsService.buyNft(id, user);
  }

  @Query(() => [MostRatedNftOutput], { nullable: 'items' })
  mostRatedNfts(
    @Args('top', { type: () => Int })
    top: number,
  ) {
    return this.nftsService.mostRatedNfts(top);
  }
}
