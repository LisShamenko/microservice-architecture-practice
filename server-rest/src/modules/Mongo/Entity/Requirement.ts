
export class Requirement {
    title: string;
    player_level: number;
    strength: number;
    endurance: number;
    intelligence: number;
    agility: number;
    fire_weapons: number;
    melee_weapons: number;
    throwing: number;
    doctor: number;
    sneak: number;
    steal: number;
    traps: number;
    science: number;
    repair: number;
    barter: number;
}

export const requirementProps = [
    'title', 'player_level', 'strength', 'endurance', 'intelligence', 'agility',
    'fire_weapons', 'melee_weapons', 'throwing', 'doctor', 'sneak', 'steal',
    'traps', 'science', 'repair', 'barter',
];
