/**
 * Conversions between HealthSpec canonical units and common display units.
 * Canonical units per value field are listed in TYPE_MAPPINGS[type].fieldUnits.
 */

/** Glucose: 1 mmol/L = 18.0182 mg/dL (molar mass of glucose 180.182 g/mol). */
export const MG_PER_DL_PER_MMOL_PER_L = 18.0182;
export const glucose = {
  mmolPerLToMgPerDl: (mmolPerL: number): number => mmolPerL * MG_PER_DL_PER_MMOL_PER_L,
  mgPerDlToMmolPerL: (mgPerDl: number): number => mgPerDl / MG_PER_DL_PER_MMOL_PER_L,
} as const;

export const temperature = {
  celsiusToFahrenheit: (c: number): number => (c * 9) / 5 + 32,
  fahrenheitToCelsius: (f: number): number => ((f - 32) * 5) / 9,
} as const;

export const KG_PER_LB = 0.45359237;
export const mass = {
  kgToLb: (kg: number): number => kg / KG_PER_LB,
  lbToKg: (lb: number): number => lb * KG_PER_LB,
} as const;

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_FOOT = 0.3048;
export const length = {
  metersToKm: (m: number): number => m / 1000,
  kmToMeters: (km: number): number => km * 1000,
  metersToMiles: (m: number): number => m / METERS_PER_MILE,
  milesToMeters: (mi: number): number => mi * METERS_PER_MILE,
  metersToFeet: (m: number): number => m / METERS_PER_FOOT,
  feetToMeters: (ft: number): number => ft * METERS_PER_FOOT,
  cmToMeters: (cm: number): number => cm / 100,
  metersToCm: (m: number): number => m * 100,
} as const;

export const KJ_PER_KCAL = 4.184;
export const energy = {
  kcalToKj: (kcal: number): number => kcal * KJ_PER_KCAL,
  kjToKcal: (kj: number): number => kj / KJ_PER_KCAL,
} as const;

export const ML_PER_US_FL_OZ = 29.5735295625;
export const volume = {
  litersToMl: (l: number): number => l * 1000,
  mlToLiters: (ml: number): number => ml / 1000,
  litersToUsFlOz: (l: number): number => (l * 1000) / ML_PER_US_FL_OZ,
  usFlOzToLiters: (oz: number): number => (oz * ML_PER_US_FL_OZ) / 1000,
} as const;

/** HealthKit's `.percent()` unit is a fraction (0.97); HealthSpec percentages are 0–100. */
export const percent = {
  fractionToPercent: (fraction: number): number => fraction * 100,
  percentToFraction: (pct: number): number => pct / 100,
} as const;
