import { Injectable } from "@nestjs/common";
import { clamp } from "lodash";
// 
import { InsertPropertiesDto } from "../dto/InsertPropertiesDto";
import { PlayerProperty } from "../../modules/Postgres/entity/PlayerProperty";

// 
@Injectable()
export class PropertyHelper {

    setProperties(properties: PlayerProperty, delta: InsertPropertiesDto) {
        if (properties) {
            this.setAttributes(properties, delta);
            this.setParameters(properties, delta);
        }
    }

    private setAttributes(properties: PlayerProperty, delta: InsertPropertiesDto) {
        PlayerProperty.attributes.forEach(k => {
            if (delta[k]) {
                const prop = (properties[k]) ? properties[k] : 0;
                properties[k] = clamp(prop + delta[k], 0, 10);
            }
        });
    }

    private setParameters(properties: PlayerProperty, delta: InsertPropertiesDto) {
        PlayerProperty.parameters.forEach(k => {
            if (delta[k]) {
                const prop = (properties[k]) ? properties[k] : 0;
                properties[k] = clamp(prop + delta[k], 0, 100);
            }
        });
    }
}
