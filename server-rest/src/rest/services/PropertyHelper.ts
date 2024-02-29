import { Injectable } from "@nestjs/common";
import { clamp } from "lodash";
// 
import { InsertPropertiesDto } from "../dto/InsertPropertiesDto";
import { PlayerProperty } from "../../modules/Mongo/entity/PlayerProperty";
import { RequirementDto } from "../dto/RequirementDto";
import { Requirement, requirementProps } from "../../modules/Mongo/Entity/Requirement";



// 
@Injectable()
export class PropertyHelper {

    // 
    newProperties(properties: PlayerProperty) {
        const result = new PlayerProperty();
        this.copyProperties(PlayerProperty.attributes, properties, result);
        this.copyProperties(PlayerProperty.parameters, properties, result);
        return result;
    }

    copyProperties(props: string[], source: PlayerProperty, target: PlayerProperty) {
        props.forEach(k => {
            if (source[k] === undefined || source[k] === null) return;
            target[k] = source[k];
        });
    }

    setProperties(properties: PlayerProperty, delta: InsertPropertiesDto) {
        if (properties) {
            this.setAttributes(properties, delta);
            this.setParameters(properties, delta);
        }
    }

    // 
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

    // 
    copyRequirements(requirement: Requirement) {
        const result = new Requirement();
        requirementProps.forEach(k => {
            if (requirement[k] === undefined || requirement[k] === null) return;
            result[k] = requirement[k];
        });
        return result;
    }

    setRequirements(requirements: Requirement, delta: RequirementDto) {
        requirementProps.forEach(k => {
            if (delta[k] === undefined || delta[k] === null) return;
            requirements[k] = delta[k];
        });
    }

    newRequirements(requirement: RequirementDto) {
        const requirements = new Requirement();
        this.setRequirements(requirements, requirement);
        return requirements;
    }
}
