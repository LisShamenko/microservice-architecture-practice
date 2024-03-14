import { Resolver } from '@nestjs/graphql';
// 
import { LevelEffectObject } from './player.objects';
import { PlayerService } from './player.service';



// 
@Resolver(() => LevelEffectObject)
export class LevelEffectResolver {
    constructor(private readonly playerService: PlayerService) { }
    // fields
    // CRUD 
}
