import { Inject, Injectable } from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';

@Injectable()
export class CollectionsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}
}
