import { Inject, Injectable } from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';

@Injectable()
export class NFTsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}
}
