import { Injectable } from "@nestjs/common";
import { clamp } from "lodash";
// 
import { PlayerProperty } from "../../../modules/Postgres/entity/PlayerProperty";
import { Requirement } from "../../../modules/Postgres/entity/Requirement";
import { PropertiesInput, RequirementInput } from "../graphql.objects";



// 
@Injectable()
export class PropertyHelper {

    // 
    newProperties(properties: PlayerProperty) {
        const result = new PlayerProperty();
        this.copyAttributes(result, properties);
        this.copyParameters(result, properties);
        return result;
    }

    copyProperties(target: PlayerProperty, source: PlayerProperty) {
        this.copyAttributes(target, source);
        this.copyParameters(target, source);
    }

    private copyAttributes(target: PlayerProperty, source: PlayerProperty) {
        PlayerProperty.attributes.forEach(k => {
            const data = source.dataValues;
            if (data[k] === undefined || data[k] === null) return;
            target[k] = data[k];
        });
    }

    private copyParameters(target: PlayerProperty, source: PlayerProperty) {
        PlayerProperty.parameters.forEach(k => {
            const data = source.dataValues;
            if (data[k] === undefined || data[k] === null) return;
            target[k] = data[k];
        });
    }


    // 
    deltaProperties(properties: PlayerProperty, delta: PropertiesInput) {
        if (properties) {
            this.deltaAttributes(properties, delta);
            this.deltaParameters(properties, delta);
        }
    }

    private deltaAttributes(properties: PlayerProperty, delta: PropertiesInput) {
        PlayerProperty.attributes.forEach(k => {
            if (delta[k]) {
                const prop = (properties[k]) ? properties[k] : 0;
                properties[k] = clamp(prop + delta[k], 0, 10);
            }
        });
    }

    private deltaParameters(properties: PlayerProperty, delta: PropertiesInput) {
        PlayerProperty.parameters.forEach(k => {
            if (delta[k]) {
                const prop = (properties[k]) ? properties[k] : 0;
                properties[k] = clamp(prop + delta[k], 0, 100);
            }
        });
    }

    //
    newRequirements(requirement: RequirementInput) {
        const requirements = new Requirement();
        this.setRequirements(requirements, requirement);
        return requirements;
    }

    setRequirements(requirements: Requirement, delta: RequirementInput) {
        Requirement.properties.forEach(k => {
            if (delta[k] === undefined || delta[k] === null) return;
            requirements[k] = delta[k];
        });
    }
}
