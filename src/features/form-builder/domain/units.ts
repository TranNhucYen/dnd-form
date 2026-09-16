declare const internalUnitBrand: unique symbol;
declare const pxBrand: unique symbol;


export type InternalUnit = number & { [internalUnitBrand]: 'InternalUnit' }; 
export type Px = number & { [pxBrand]: 'Px' };

export const INTERNAL_UNITS_PER_MM = 100; // 1 internal unit = 0.01 mm
export const CSS_PX_PER_MM = 96 / 25.4;

export const toInternalUnit = (mm: number): InternalUnit =>
    Math.round(mm * INTERNAL_UNITS_PER_MM) as InternalUnit;

export const toMm = (unit: InternalUnit): number =>
    unit / INTERNAL_UNITS_PER_MM;

export const toScreenPx = (unit: InternalUnit): Px =>
    (toMm(unit) * CSS_PX_PER_MM) as Px;

export const pxToInternalUnit = (px: Px): InternalUnit =>
    Math.round((px / CSS_PX_PER_MM) * INTERNAL_UNITS_PER_MM) as InternalUnit;