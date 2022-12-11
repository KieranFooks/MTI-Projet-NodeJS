import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NFTModel } from '../Models/nft';
import { CreateNFTInput } from './dto/createNFT.input';
import { UpdateNFTInput } from './dto/updateNFT.input';
import { NFTsService } from './nfts.service';

@Resolver(NFTModel)
export class NFTsResolver {
  constructor(@Inject(NFTsService) private nsftService: NFTsService) {}

  @Query(() => [NFTModel], { nullable: 'items' })
  nfts() {
    return this.nsftService.fintAll();
  }

  @Query(() => NFTModel, { nullable: true })
  nft(@Args('id') id: number) {
    return this.nsftService.findOne(id);
  }

  @Mutation(() => NFTModel)
  createNFT(@Args('nft') nft: CreateNFTInput) {
    return this.nsftService.create(nft);
  }

  @Mutation(() => NFTModel)
  updateNFT(@Args('nft') nft: UpdateNFTInput) {
    return this.nsftService.update(nft);
  }

  @Mutation(() => NFTModel)
  buyNFT(@Args('id') id: number) {
    return this.nsftService.buyNFT(id);
  }
}
