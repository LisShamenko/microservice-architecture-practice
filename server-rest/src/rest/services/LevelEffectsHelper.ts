import { Injectable } from "@nestjs/common";
// 
import { LevelEffectDto } from "../dto/LevelEffectDto";
import { LevelEffect } from "src/modules/Mongo/Entity/Player";



// 
@Injectable()
export class LevelEffectsHelper {

    addEffects(tmpEffects: LevelEffect[], idtoEffects: LevelEffectDto[]) {
        if (!idtoEffects || idtoEffects.length <= 0) return;

        idtoEffects.forEach(idto_e => {
            const effect = new LevelEffect();
            effect.count_matches = idto_e.count_matches;
            effect.is_equipment = idto_e.is_equipment;
            effect.property_column = idto_e.property_column;
            effect.delta_value = idto_e.delta_value;
            tmpEffects.push(effect);
        });
    }
}
