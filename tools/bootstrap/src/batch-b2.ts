/** Batch B2 — nutrition with every nutrient both platforms know (HealthKit dietary quantities ↔ Health Connect NutritionRecord fields). */
import { enumOf, num, str, type Entry } from './write.js';

/** [spec field, HK identifier suffix or null, HC field or null, unit] */
const NUTRIENTS: Array<[string, string | null, string | null, 'kcal' | 'g' | 'mg' | 'mcg']> = [
  ['kilocalories', 'DietaryEnergyConsumed', 'energy', 'kcal'],
  ['energyFromFatKilocalories', null, 'energyFromFat', 'kcal'],
  ['proteinGrams', 'DietaryProtein', 'protein', 'g'],
  ['carbohydrateGrams', 'DietaryCarbohydrates', 'totalCarbohydrate', 'g'],
  ['fatGrams', 'DietaryFatTotal', 'totalFat', 'g'],
  ['fatSaturatedGrams', 'DietaryFatSaturated', 'saturatedFat', 'g'],
  ['fatMonounsaturatedGrams', 'DietaryFatMonounsaturated', 'monounsaturatedFat', 'g'],
  ['fatPolyunsaturatedGrams', 'DietaryFatPolyunsaturated', 'polyunsaturatedFat', 'g'],
  ['transFatGrams', null, 'transFat', 'g'],
  ['unsaturatedFatGrams', null, 'unsaturatedFat', 'g'],
  ['fiberGrams', 'DietaryFiber', 'dietaryFiber', 'g'],
  ['sugarGrams', 'DietarySugar', 'sugar', 'g'],
  ['cholesterolMilligrams', 'DietaryCholesterol', 'cholesterol', 'mg'],
  ['sodiumMilligrams', 'DietarySodium', 'sodium', 'mg'],
  ['potassiumMilligrams', 'DietaryPotassium', 'potassium', 'mg'],
  ['calciumMilligrams', 'DietaryCalcium', 'calcium', 'mg'],
  ['ironMilligrams', 'DietaryIron', 'iron', 'mg'],
  ['magnesiumMilligrams', 'DietaryMagnesium', 'magnesium', 'mg'],
  ['phosphorusMilligrams', 'DietaryPhosphorus', 'phosphorus', 'mg'],
  ['zincMilligrams', 'DietaryZinc', 'zinc', 'mg'],
  ['copperMilligrams', 'DietaryCopper', 'copper', 'mg'],
  ['manganeseMilligrams', 'DietaryManganese', 'manganese', 'mg'],
  ['chlorideMilligrams', 'DietaryChloride', 'chloride', 'mg'],
  ['seleniumMicrograms', 'DietarySelenium', 'selenium', 'mcg'],
  ['iodineMicrograms', 'DietaryIodine', 'iodine', 'mcg'],
  ['chromiumMicrograms', 'DietaryChromium', 'chromium', 'mcg'],
  ['molybdenumMicrograms', 'DietaryMolybdenum', 'molybdenum', 'mcg'],
  ['vitaminAMicrograms', 'DietaryVitaminA', 'vitaminA', 'mcg'],
  ['vitaminB6Milligrams', 'DietaryVitaminB6', 'vitaminB6', 'mg'],
  ['vitaminB12Micrograms', 'DietaryVitaminB12', 'vitaminB12', 'mcg'],
  ['vitaminCMilligrams', 'DietaryVitaminC', 'vitaminC', 'mg'],
  ['vitaminDMicrograms', 'DietaryVitaminD', 'vitaminD', 'mcg'],
  ['vitaminEMilligrams', 'DietaryVitaminE', 'vitaminE', 'mg'],
  ['vitaminKMicrograms', 'DietaryVitaminK', 'vitaminK', 'mcg'],
  ['thiaminMilligrams', 'DietaryThiamin', 'thiamin', 'mg'],
  ['riboflavinMilligrams', 'DietaryRiboflavin', 'riboflavin', 'mg'],
  ['niacinMilligrams', 'DietaryNiacin', 'niacin', 'mg'],
  ['folateMicrograms', 'DietaryFolate', 'folate', 'mcg'],
  ['folicAcidMicrograms', null, 'folicAcid', 'mcg'],
  ['biotinMicrograms', 'DietaryBiotin', 'biotin', 'mcg'],
  ['pantothenicAcidMilligrams', 'DietaryPantothenicAcid', 'pantothenicAcid', 'mg'],
  ['caffeineMilligrams', 'DietaryCaffeine', 'caffeine', 'mg'],
];

export const NUTRIENT_TABLE = NUTRIENTS;

export const BATCH_B2: Entry[] = [
  {
    id: 'nutrition',
    description: 'Nutrients consumed during the interval (a meal or a day). Every nutrient either platform records; fields a platform lacks are simply absent there.',
    category: 'nutrition',
    kind: 'interval',
    aggregate: ['sum'],
    hk: {
      kind: 'multi',
      fields: Object.fromEntries(NUTRIENTS.filter(([, hk]) => hk).map(([field, hk]) => [field, `HKQuantityTypeIdentifier${hk}`])),
      notes: ['No single nutrition object: one quantity sample per nutrient, grouped in an HKCorrelationTypeIdentifierFood correlation on write and when reading.', 'HKUnit strings: kcal, g, mg, mcg.'],
    },
    hc: {
      record: 'NutritionRecord',
      permission: 'NUTRITION',
      fields: Object.fromEntries(NUTRIENTS.filter(([, , hc]) => hc).map(([field, , hc]) => [field, hc as string])),
    },
    notes: ['The two platforms are structural opposites (many samples vs one record); the spec models the Health Connect shape and HealthKit providers group/ungroup.'],
    properties: {
      ...Object.fromEntries(NUTRIENTS.map(([field, , , unit]) => [field, num(unit, { minimum: 0 })])),
      mealType: { $ref: '../enums/meal_type.json' },
      name: str(),
    },
    examples: [{ kilocalories: 620, proteinGrams: 32, carbohydrateGrams: 71, fatGrams: 22, vitaminCMilligrams: 40, mealType: 'lunch', name: 'Bibimbap' }],
  },
];

void enumOf;
