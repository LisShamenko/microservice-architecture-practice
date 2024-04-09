


//      [presetsObj](https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts)
export enum EnvironmentPresets {
    apartment = 'apartment',    // = 'lebombo_1k.hdr',
    city = 'city',              // = 'potsdamer_platz_1k.hdr',
    dawn = 'dawn',              // = 'kiara_1_dawn_1k.hdr',
    forest = 'forest',          // = 'forest_slope_1k.hdr',
    lobby = 'lobby',            // = 'st_fagans_interior_1k.hdr',
    night = 'night',            // = 'dikhololo_night_1k.hdr',
    park = 'park',              // = 'rooitou_park_1k.hdr',
    studio = 'studio',          // = 'studio_small_03_1k.hdr',
    sunset = 'sunset',          // = 'venice_sunset_1k.hdr',
    warehouse = 'warehouse',    // = 'empty_warehouse_01_1k.hdr',
}

export type PresetsType = keyof typeof EnvironmentPresets;
