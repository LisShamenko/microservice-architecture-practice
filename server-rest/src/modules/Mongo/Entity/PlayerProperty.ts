import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';



//
@Schema({ _id: false })
export class PlayerProperty {
    @Prop() strength: number;
    @Prop() endurance: number;
    @Prop() intelligence: number;
    @Prop() agility: number;
    @Prop() fire_weapons: number;
    @Prop() melee_weapons: number;
    @Prop() throwing: number;
    @Prop() doctor: number;
    @Prop() sneak: number;
    @Prop() steal: number;
    @Prop() traps: number;
    @Prop() science: number;
    @Prop() repair: number;
    @Prop() barter: number;

    // 
    public static attributes: string[] = [
        'strength', 'endurance', 'intelligence', 'agility'
    ];
    public static parameters: string[] = [
        'fire_weapons', 'melee_weapons', 'throwing', 'doctor',
        'sneak', 'steal', 'traps', 'science', 'repair', 'barter'
    ];
}

export const PlayerPropertySchema = SchemaFactory.createForClass(PlayerProperty);
