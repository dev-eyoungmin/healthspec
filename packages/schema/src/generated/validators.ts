// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.

import { HEALTH_TYPES, DEVICE_TYPE_VALUES, EXERCISE_TYPE_VALUES, MEAL_TYPE_VALUES, RECORDING_METHOD_VALUES, SLEEP_STAGE_VALUES } from './types.js';
import type { HealthType } from './types.js';
import { TYPE_MAPPINGS } from './mapping.js';

export interface ValidationIssue {
  /** e.g. "value.stages[2].stage" */
  path: string;
  message: string;
}
export type Check = (v: unknown, path: string, out: ValidationIssue[]) => void;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const enumCheck = (values: readonly string[]): Check => (v, path, out) => {
  if (typeof v !== 'string' || !values.includes(v)) out.push({ path, message: 'must be one of ' + values.join(', ') });
};

// ---------------------------------------------------------------- enums

export const checkDeviceType: Check = enumCheck(DEVICE_TYPE_VALUES);
export const checkExerciseType: Check = enumCheck(EXERCISE_TYPE_VALUES);
export const checkMealType: Check = enumCheck(MEAL_TYPE_VALUES);
export const checkRecordingMethod: Check = enumCheck(RECORDING_METHOD_VALUES);
export const checkSleepStage: Check = enumCheck(SLEEP_STAGE_VALUES);

// ---------------------------------------------------------------- common

export const checkHealthProfile: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o0 = v;
    for (const k of Object.keys(o0)) if (!(["biologicalSex","dateOfBirth","bloodType","fitzpatrickSkinType","wheelchairUse","activityMoveMode"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v1 = o0["biologicalSex"];
    if (v1 !== undefined) {
      if (typeof v1 !== 'string' || !["female","male","other"].includes(v1)) out.push({ path: path + ".biologicalSex", message: "must be one of female, male, other" });
    }
    const v2 = o0["dateOfBirth"];
    if (v2 !== undefined) {
      if (typeof v2 !== 'string') out.push({ path: path + ".dateOfBirth", message: "must be a string" });
      else if (!new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(v2)) out.push({ path: path + ".dateOfBirth", message: "must match ^\\d{4}-\\d{2}-\\d{2}$" });
    }
    const v3 = o0["bloodType"];
    if (v3 !== undefined) {
      if (typeof v3 !== 'string' || !["a_positive","a_negative","b_positive","b_negative","ab_positive","ab_negative","o_positive","o_negative"].includes(v3)) out.push({ path: path + ".bloodType", message: "must be one of a_positive, a_negative, b_positive, b_negative, ab_positive, ab_negative, o_positive, o_negative" });
    }
    const v4 = o0["fitzpatrickSkinType"];
    if (v4 !== undefined) {
      if (typeof v4 !== 'string' || !["type_1","type_2","type_3","type_4","type_5","type_6"].includes(v4)) out.push({ path: path + ".fitzpatrickSkinType", message: "must be one of type_1, type_2, type_3, type_4, type_5, type_6" });
    }
    const v5 = o0["wheelchairUse"];
    if (v5 !== undefined) {
      if (typeof v5 !== 'boolean') out.push({ path: path + ".wheelchairUse", message: "must be a boolean" });
    }
    const v6 = o0["activityMoveMode"];
    if (v6 !== undefined) {
      if (typeof v6 !== 'string' || !["active_energy","move_time"].includes(v6)) out.push({ path: path + ".activityMoveMode", message: "must be one of active_energy, move_time" });
    }
  }
};

export const checkHealthSource: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o7 = v;
    for (const k of Object.keys(o7)) if (!(["app","device","recordingMethod"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v8 = o7["app"];
    if (v8 !== undefined) {
      if (!isObject(v8)) out.push({ path: path + ".app", message: "must be an object" });
      else {
        const o9 = v8;
        for (const k of Object.keys(o9)) if (!(["id","name"] as string[]).includes(k)) out.push({ path: path + ".app" + '.' + k, message: 'unknown property' });
        const v10 = o9["id"];
        if (v10 === undefined) out.push({ path: path + ".app" + ".id", message: 'required' });
        else {
          if (typeof v10 !== 'string') out.push({ path: path + ".app" + ".id", message: "must be a string" });
        }
        const v11 = o9["name"];
        if (v11 !== undefined) {
          if (typeof v11 !== 'string') out.push({ path: path + ".app" + ".name", message: "must be a string" });
        }
      }
    }
    const v12 = o7["device"];
    if (v12 !== undefined) {
      if (!isObject(v12)) out.push({ path: path + ".device", message: "must be an object" });
      else {
        const o13 = v12;
        for (const k of Object.keys(o13)) if (!(["manufacturer","model","type"] as string[]).includes(k)) out.push({ path: path + ".device" + '.' + k, message: 'unknown property' });
        const v14 = o13["manufacturer"];
        if (v14 !== undefined) {
          if (typeof v14 !== 'string') out.push({ path: path + ".device" + ".manufacturer", message: "must be a string" });
        }
        const v15 = o13["model"];
        if (v15 !== undefined) {
          if (typeof v15 !== 'string') out.push({ path: path + ".device" + ".model", message: "must be a string" });
        }
        const v16 = o13["type"];
        if (v16 !== undefined) {
          checkDeviceType(v16, path + ".device" + ".type", out);
        }
      }
    }
    const v17 = o7["recordingMethod"];
    if (v17 === undefined) out.push({ path: path + ".recordingMethod", message: 'required' });
    else {
      checkRecordingMethod(v17, path + ".recordingMethod", out);
    }
  }
};

export interface EnvelopeOptions {
  /** Records being written may omit id (assigned by the store) and source (filled by the provider). */
  partial?: boolean;
}
const ENVELOPE_KEYS = ["id","type","start","end","zoneOffset","value","source","metadata"];
export const checkEnvelope = (v: unknown, path: string, out: ValidationIssue[], options: EnvelopeOptions = {}): void => {
  if (!isObject(v)) { out.push({ path, message: 'must be an object' }); return; }
  for (const k of Object.keys(v)) if (!ENVELOPE_KEYS.includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  const partial = options.partial === true;
  const v18 = v["id"];
  if (v18 === undefined) { if (!partial) out.push({ path: path + ".id", message: 'required' }); }
  else {
    if (typeof v18 !== 'string') out.push({ path: path + ".id", message: "must be a string" });
  }
  const v19 = v["start"];
  if (v19 === undefined) out.push({ path: path + ".start", message: 'required' });
  else {
    if (typeof v19 !== 'string') out.push({ path: path + ".start", message: "must be a string" });
    else if (!DATE_TIME_RE.test(v19)) out.push({ path: path + ".start", message: "must be an RFC 3339 date-time" });
  }
  const v20 = v["end"];
  if (v20 === undefined) out.push({ path: path + ".end", message: 'required' });
  else {
    if (typeof v20 !== 'string') out.push({ path: path + ".end", message: "must be a string" });
    else if (!DATE_TIME_RE.test(v20)) out.push({ path: path + ".end", message: "must be an RFC 3339 date-time" });
  }
  const v21 = v["zoneOffset"];
  if (v21 === undefined) { /* optional */ }
  else {
    if (typeof v21 !== 'string') out.push({ path: path + ".zoneOffset", message: "must be a string" });
    else if (!new RegExp("^[+-]\\d{2}:\\d{2}$").test(v21)) out.push({ path: path + ".zoneOffset", message: "must match ^[+-]\\d{2}:\\d{2}$" });
  }
  const v22 = v["source"];
  if (v22 === undefined) { if (!partial) out.push({ path: path + ".source", message: 'required' }); }
  else {
    checkHealthSource(v22, path + ".source", out);
  }
  const v23 = v["metadata"];
  if (v23 === undefined) { /* optional */ }
  else {
    if (!isObject(v23)) out.push({ path: path + ".metadata", message: "must be an object" });
    else {
      const o24 = v23;
      for (const k of Object.keys(o24)) {
        const v25 = o24[k];
        if (typeof v25 !== 'string') out.push({ path: path + ".metadata" + '.' + k, message: "must be a string" });
      }
    }
  }
  const t = v['type'];
  if (t === undefined) out.push({ path: path + '.type', message: 'required' });
  else if (typeof t !== 'string' || !(HEALTH_TYPES as readonly string[]).includes(t)) out.push({ path: path + '.type', message: 'unknown health type' });
  if (v['value'] === undefined) out.push({ path: path + '.value', message: 'required' });
};

// ---------------------------------------------------------------- values

const check_active_energy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o26 = v;
    for (const k of Object.keys(o26)) if (!(["kilocalories"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v27 = o26["kilocalories"];
    if (v27 === undefined) out.push({ path: path + ".kilocalories", message: 'required' });
    else {
      if (typeof v27 !== 'number' || Number.isNaN(v27)) out.push({ path: path + ".kilocalories", message: "must be a number" });
      else {
        if (v27 < 0) out.push({ path: path + ".kilocalories", message: "must be ≥ 0" });
      }
    }
  }
};
const check_activity_summary: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o28 = v;
    for (const k of Object.keys(o28)) if (!(["date","activeEnergyKilocalories","activeEnergyGoalKilocalories","exerciseMinutes","exerciseGoalMinutes","standHours","standGoalHours","moveMinutes","moveGoalMinutes","activityMoveMode"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v29 = o28["date"];
    if (v29 === undefined) out.push({ path: path + ".date", message: 'required' });
    else {
      if (typeof v29 !== 'string') out.push({ path: path + ".date", message: "must be a string" });
      else if (!new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(v29)) out.push({ path: path + ".date", message: "must match ^\\d{4}-\\d{2}-\\d{2}$" });
    }
    const v30 = o28["activeEnergyKilocalories"];
    if (v30 !== undefined) {
      if (typeof v30 !== 'number' || Number.isNaN(v30)) out.push({ path: path + ".activeEnergyKilocalories", message: "must be a number" });
      else {
        if (v30 < 0) out.push({ path: path + ".activeEnergyKilocalories", message: "must be ≥ 0" });
      }
    }
    const v31 = o28["activeEnergyGoalKilocalories"];
    if (v31 !== undefined) {
      if (typeof v31 !== 'number' || Number.isNaN(v31)) out.push({ path: path + ".activeEnergyGoalKilocalories", message: "must be a number" });
      else {
        if (v31 < 0) out.push({ path: path + ".activeEnergyGoalKilocalories", message: "must be ≥ 0" });
      }
    }
    const v32 = o28["exerciseMinutes"];
    if (v32 !== undefined) {
      if (typeof v32 !== 'number' || Number.isNaN(v32)) out.push({ path: path + ".exerciseMinutes", message: "must be a number" });
      else {
        if (v32 < 0) out.push({ path: path + ".exerciseMinutes", message: "must be ≥ 0" });
      }
    }
    const v33 = o28["exerciseGoalMinutes"];
    if (v33 !== undefined) {
      if (typeof v33 !== 'number' || Number.isNaN(v33)) out.push({ path: path + ".exerciseGoalMinutes", message: "must be a number" });
      else {
        if (v33 < 0) out.push({ path: path + ".exerciseGoalMinutes", message: "must be ≥ 0" });
      }
    }
    const v34 = o28["standHours"];
    if (v34 !== undefined) {
      if (typeof v34 !== 'number' || Number.isNaN(v34)) out.push({ path: path + ".standHours", message: "must be a number" });
      else {
        if (v34 < 0) out.push({ path: path + ".standHours", message: "must be ≥ 0" });
      }
    }
    const v35 = o28["standGoalHours"];
    if (v35 !== undefined) {
      if (typeof v35 !== 'number' || Number.isNaN(v35)) out.push({ path: path + ".standGoalHours", message: "must be a number" });
      else {
        if (v35 < 0) out.push({ path: path + ".standGoalHours", message: "must be ≥ 0" });
      }
    }
    const v36 = o28["moveMinutes"];
    if (v36 !== undefined) {
      if (typeof v36 !== 'number' || Number.isNaN(v36)) out.push({ path: path + ".moveMinutes", message: "must be a number" });
      else {
        if (v36 < 0) out.push({ path: path + ".moveMinutes", message: "must be ≥ 0" });
      }
    }
    const v37 = o28["moveGoalMinutes"];
    if (v37 !== undefined) {
      if (typeof v37 !== 'number' || Number.isNaN(v37)) out.push({ path: path + ".moveGoalMinutes", message: "must be a number" });
      else {
        if (v37 < 0) out.push({ path: path + ".moveGoalMinutes", message: "must be ≥ 0" });
      }
    }
    const v38 = o28["activityMoveMode"];
    if (v38 !== undefined) {
      if (typeof v38 !== 'string' || !["active_energy","move_time"].includes(v38)) out.push({ path: path + ".activityMoveMode", message: "must be one of active_energy, move_time" });
    }
  }
};
const check_apple_exercise_time: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o39 = v;
    for (const k of Object.keys(o39)) if (!(["minutes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v40 = o39["minutes"];
    if (v40 === undefined) out.push({ path: path + ".minutes", message: 'required' });
    else {
      if (typeof v40 !== 'number' || Number.isNaN(v40)) out.push({ path: path + ".minutes", message: "must be a number" });
      else {
        if (v40 < 0) out.push({ path: path + ".minutes", message: "must be ≥ 0" });
      }
    }
  }
};
const check_apple_move_time: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o41 = v;
    for (const k of Object.keys(o41)) if (!(["minutes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v42 = o41["minutes"];
    if (v42 === undefined) out.push({ path: path + ".minutes", message: 'required' });
    else {
      if (typeof v42 !== 'number' || Number.isNaN(v42)) out.push({ path: path + ".minutes", message: "must be a number" });
      else {
        if (v42 < 0) out.push({ path: path + ".minutes", message: "must be ≥ 0" });
      }
    }
  }
};
const check_apple_sleeping_breathing_disturbances: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o43 = v;
    for (const k of Object.keys(o43)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v44 = o43["count"];
    if (v44 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v44 !== 'number' || Number.isNaN(v44)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v44 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_apple_sleeping_wrist_temperature: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o45 = v;
    for (const k of Object.keys(o45)) if (!(["celsius"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v46 = o45["celsius"];
    if (v46 === undefined) out.push({ path: path + ".celsius", message: 'required' });
    else {
      if (typeof v46 !== 'number' || Number.isNaN(v46)) out.push({ path: path + ".celsius", message: "must be a number" });
      else {
        if (v46 < 0) out.push({ path: path + ".celsius", message: "must be ≥ 0" });
      }
    }
  }
};
const check_apple_stand_hour: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o47 = v;
    for (const k of Object.keys(o47)) if (!(["status"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v48 = o47["status"];
    if (v48 === undefined) out.push({ path: path + ".status", message: 'required' });
    else {
      if (typeof v48 !== 'string' || !["stood","idle"].includes(v48)) out.push({ path: path + ".status", message: "must be one of stood, idle" });
    }
  }
};
const check_apple_stand_time: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o49 = v;
    for (const k of Object.keys(o49)) if (!(["minutes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v50 = o49["minutes"];
    if (v50 === undefined) out.push({ path: path + ".minutes", message: 'required' });
    else {
      if (typeof v50 !== 'number' || Number.isNaN(v50)) out.push({ path: path + ".minutes", message: "must be a number" });
      else {
        if (v50 < 0) out.push({ path: path + ".minutes", message: "must be ≥ 0" });
      }
    }
  }
};
const check_apple_walking_steadiness: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o51 = v;
    for (const k of Object.keys(o51)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v52 = o51["percent"];
    if (v52 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v52 !== 'number' || Number.isNaN(v52)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v52 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v52 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_apple_walking_steadiness_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o53 = v;
    for (const k of Object.keys(o53)) if (!(["level"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v54 = o53["level"];
    if (v54 === undefined) out.push({ path: path + ".level", message: 'required' });
    else {
      if (typeof v54 !== 'string' || !["initial_low","initial_very_low","repeat_low","repeat_very_low"].includes(v54)) out.push({ path: path + ".level", message: "must be one of initial_low, initial_very_low, repeat_low, repeat_very_low" });
    }
  }
};
const check_atrial_fibrillation_burden: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o55 = v;
    for (const k of Object.keys(o55)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v56 = o55["percent"];
    if (v56 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v56 !== 'number' || Number.isNaN(v56)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v56 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v56 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_basal_body_temperature: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o57 = v;
    for (const k of Object.keys(o57)) if (!(["celsius","measurementLocation"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v58 = o57["celsius"];
    if (v58 === undefined) out.push({ path: path + ".celsius", message: 'required' });
    else {
      if (typeof v58 !== 'number' || Number.isNaN(v58)) out.push({ path: path + ".celsius", message: "must be a number" });
      else {
        if (v58 < 20) out.push({ path: path + ".celsius", message: "must be ≥ 20" });
        if (v58 > 50) out.push({ path: path + ".celsius", message: "must be ≤ 50" });
      }
    }
    const v59 = o57["measurementLocation"];
    if (v59 !== undefined) {
      if (typeof v59 !== 'string' || !["armpit","finger","forehead","mouth","rectum","temporal_artery","toe","ear","wrist","vagina","unknown"].includes(v59)) out.push({ path: path + ".measurementLocation", message: "must be one of armpit, finger, forehead, mouth, rectum, temporal_artery, toe, ear, wrist, vagina, unknown" });
    }
  }
};
const check_basal_energy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o60 = v;
    for (const k of Object.keys(o60)) if (!(["kilocalories"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v61 = o60["kilocalories"];
    if (v61 === undefined) out.push({ path: path + ".kilocalories", message: 'required' });
    else {
      if (typeof v61 !== 'number' || Number.isNaN(v61)) out.push({ path: path + ".kilocalories", message: "must be a number" });
      else {
        if (v61 < 0) out.push({ path: path + ".kilocalories", message: "must be ≥ 0" });
      }
    }
  }
};
const check_basal_metabolic_rate: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o62 = v;
    for (const k of Object.keys(o62)) if (!(["kilocaloriesPerDay"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v63 = o62["kilocaloriesPerDay"];
    if (v63 === undefined) out.push({ path: path + ".kilocaloriesPerDay", message: 'required' });
    else {
      if (typeof v63 !== 'number' || Number.isNaN(v63)) out.push({ path: path + ".kilocaloriesPerDay", message: "must be a number" });
      else {
        if (v63 < 0) out.push({ path: path + ".kilocaloriesPerDay", message: "must be ≥ 0" });
      }
    }
  }
};
const check_bleeding_after_pregnancy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o64 = v;
    for (const k of Object.keys(o64)) if (!(["flow"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v65 = o64["flow"];
    if (v65 === undefined) out.push({ path: path + ".flow", message: 'required' });
    else {
      if (typeof v65 !== 'string' || !["unspecified","light","medium","heavy","none"].includes(v65)) out.push({ path: path + ".flow", message: "must be one of unspecified, light, medium, heavy, none" });
    }
  }
};
const check_bleeding_during_pregnancy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o66 = v;
    for (const k of Object.keys(o66)) if (!(["flow"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v67 = o66["flow"];
    if (v67 === undefined) out.push({ path: path + ".flow", message: 'required' });
    else {
      if (typeof v67 !== 'string' || !["unspecified","light","medium","heavy","none"].includes(v67)) out.push({ path: path + ".flow", message: "must be one of unspecified, light, medium, heavy, none" });
    }
  }
};
const check_blood_alcohol_content: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o68 = v;
    for (const k of Object.keys(o68)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v69 = o68["percent"];
    if (v69 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v69 !== 'number' || Number.isNaN(v69)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v69 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v69 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_blood_glucose: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o70 = v;
    for (const k of Object.keys(o70)) if (!(["millimolesPerLiter","specimenSource","mealType","relationToMeal"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v71 = o70["millimolesPerLiter"];
    if (v71 === undefined) out.push({ path: path + ".millimolesPerLiter", message: 'required' });
    else {
      if (typeof v71 !== 'number' || Number.isNaN(v71)) out.push({ path: path + ".millimolesPerLiter", message: "must be a number" });
      else {
        if (v71 < 0) out.push({ path: path + ".millimolesPerLiter", message: "must be ≥ 0" });
        if (v71 > 60) out.push({ path: path + ".millimolesPerLiter", message: "must be ≤ 60" });
      }
    }
    const v72 = o70["specimenSource"];
    if (v72 !== undefined) {
      if (typeof v72 !== 'string' || !["interstitial_fluid","capillary_blood","plasma","serum","tears","whole_blood","unknown"].includes(v72)) out.push({ path: path + ".specimenSource", message: "must be one of interstitial_fluid, capillary_blood, plasma, serum, tears, whole_blood, unknown" });
    }
    const v73 = o70["mealType"];
    if (v73 !== undefined) {
      checkMealType(v73, path + ".mealType", out);
    }
    const v74 = o70["relationToMeal"];
    if (v74 !== undefined) {
      if (typeof v74 !== 'string' || !["general","fasting","before_meal","after_meal","unknown"].includes(v74)) out.push({ path: path + ".relationToMeal", message: "must be one of general, fasting, before_meal, after_meal, unknown" });
    }
  }
};
const check_blood_pressure: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o75 = v;
    for (const k of Object.keys(o75)) if (!(["systolicMmHg","diastolicMmHg","bodyPosition","measurementLocation"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v76 = o75["systolicMmHg"];
    if (v76 === undefined) out.push({ path: path + ".systolicMmHg", message: 'required' });
    else {
      if (typeof v76 !== 'number' || Number.isNaN(v76)) out.push({ path: path + ".systolicMmHg", message: "must be a number" });
      else {
        if (v76 < 20) out.push({ path: path + ".systolicMmHg", message: "must be ≥ 20" });
        if (v76 > 300) out.push({ path: path + ".systolicMmHg", message: "must be ≤ 300" });
      }
    }
    const v77 = o75["diastolicMmHg"];
    if (v77 === undefined) out.push({ path: path + ".diastolicMmHg", message: 'required' });
    else {
      if (typeof v77 !== 'number' || Number.isNaN(v77)) out.push({ path: path + ".diastolicMmHg", message: "must be a number" });
      else {
        if (v77 < 10) out.push({ path: path + ".diastolicMmHg", message: "must be ≥ 10" });
        if (v77 > 200) out.push({ path: path + ".diastolicMmHg", message: "must be ≤ 200" });
      }
    }
    const v78 = o75["bodyPosition"];
    if (v78 !== undefined) {
      if (typeof v78 !== 'string' || !["standing_up","sitting_down","lying_down","reclining","unknown"].includes(v78)) out.push({ path: path + ".bodyPosition", message: "must be one of standing_up, sitting_down, lying_down, reclining, unknown" });
    }
    const v79 = o75["measurementLocation"];
    if (v79 !== undefined) {
      if (typeof v79 !== 'string' || !["left_wrist","right_wrist","left_upper_arm","right_upper_arm","unknown"].includes(v79)) out.push({ path: path + ".measurementLocation", message: "must be one of left_wrist, right_wrist, left_upper_arm, right_upper_arm, unknown" });
    }
  }
};
const check_body_fat: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o80 = v;
    for (const k of Object.keys(o80)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v81 = o80["percent"];
    if (v81 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v81 !== 'number' || Number.isNaN(v81)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v81 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v81 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_body_mass_index: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o82 = v;
    for (const k of Object.keys(o82)) if (!(["value"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v83 = o82["value"];
    if (v83 === undefined) out.push({ path: path + ".value", message: 'required' });
    else {
      if (typeof v83 !== 'number' || Number.isNaN(v83)) out.push({ path: path + ".value", message: "must be a number" });
      else {
        if (v83 < 0) out.push({ path: path + ".value", message: "must be ≥ 0" });
        if (v83 > 100) out.push({ path: path + ".value", message: "must be ≤ 100" });
      }
    }
  }
};
const check_body_temperature: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o84 = v;
    for (const k of Object.keys(o84)) if (!(["celsius","measurementLocation"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v85 = o84["celsius"];
    if (v85 === undefined) out.push({ path: path + ".celsius", message: 'required' });
    else {
      if (typeof v85 !== 'number' || Number.isNaN(v85)) out.push({ path: path + ".celsius", message: "must be a number" });
      else {
        if (v85 < 20) out.push({ path: path + ".celsius", message: "must be ≥ 20" });
        if (v85 > 50) out.push({ path: path + ".celsius", message: "must be ≤ 50" });
      }
    }
    const v86 = o84["measurementLocation"];
    if (v86 !== undefined) {
      if (typeof v86 !== 'string' || !["armpit","finger","forehead","mouth","rectum","temporal_artery","toe","ear","wrist","vagina","unknown"].includes(v86)) out.push({ path: path + ".measurementLocation", message: "must be one of armpit, finger, forehead, mouth, rectum, temporal_artery, toe, ear, wrist, vagina, unknown" });
    }
  }
};
const check_body_water_mass: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o87 = v;
    for (const k of Object.keys(o87)) if (!(["kilograms"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v88 = o87["kilograms"];
    if (v88 === undefined) out.push({ path: path + ".kilograms", message: 'required' });
    else {
      if (typeof v88 !== 'number' || Number.isNaN(v88)) out.push({ path: path + ".kilograms", message: "must be a number" });
      else {
        if (v88 <= 0) out.push({ path: path + ".kilograms", message: "must be > 0" });
        if (v88 > 500) out.push({ path: path + ".kilograms", message: "must be ≤ 500" });
      }
    }
  }
};
const check_bone_mass: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o89 = v;
    for (const k of Object.keys(o89)) if (!(["kilograms"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v90 = o89["kilograms"];
    if (v90 === undefined) out.push({ path: path + ".kilograms", message: 'required' });
    else {
      if (typeof v90 !== 'number' || Number.isNaN(v90)) out.push({ path: path + ".kilograms", message: "must be a number" });
      else {
        if (v90 <= 0) out.push({ path: path + ".kilograms", message: "must be > 0" });
        if (v90 > 100) out.push({ path: path + ".kilograms", message: "must be ≤ 100" });
      }
    }
  }
};
const check_cervical_mucus: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o91 = v;
    for (const k of Object.keys(o91)) if (!(["appearance","sensation"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v92 = o91["appearance"];
    if (v92 !== undefined) {
      if (typeof v92 !== 'string' || !["dry","sticky","creamy","watery","egg_white","unusual","unknown"].includes(v92)) out.push({ path: path + ".appearance", message: "must be one of dry, sticky, creamy, watery, egg_white, unusual, unknown" });
    }
    const v93 = o91["sensation"];
    if (v93 !== undefined) {
      if (typeof v93 !== 'string' || !["light","medium","heavy","unknown"].includes(v93)) out.push({ path: path + ".sensation", message: "must be one of light, medium, heavy, unknown" });
    }
  }
};
const check_clinical_allergy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o94 = v;
    for (const k of Object.keys(o94)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v95 = o94["resourceType"];
    if (v95 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v95 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v96 = o94["fhirVersion"];
    if (v96 !== undefined) {
      if (typeof v96 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v97 = o94["displayName"];
    if (v97 !== undefined) {
      if (typeof v97 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v98 = o94["sourceUrl"];
    if (v98 !== undefined) {
      if (typeof v98 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v99 = o94["fhir"];
    if (v99 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v99)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o100 = v99;
      }
    }
  }
};
const check_clinical_condition: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o101 = v;
    for (const k of Object.keys(o101)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v102 = o101["resourceType"];
    if (v102 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v102 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v103 = o101["fhirVersion"];
    if (v103 !== undefined) {
      if (typeof v103 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v104 = o101["displayName"];
    if (v104 !== undefined) {
      if (typeof v104 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v105 = o101["sourceUrl"];
    if (v105 !== undefined) {
      if (typeof v105 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v106 = o101["fhir"];
    if (v106 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v106)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o107 = v106;
      }
    }
  }
};
const check_clinical_coverage: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o108 = v;
    for (const k of Object.keys(o108)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v109 = o108["resourceType"];
    if (v109 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v109 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v110 = o108["fhirVersion"];
    if (v110 !== undefined) {
      if (typeof v110 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v111 = o108["displayName"];
    if (v111 !== undefined) {
      if (typeof v111 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v112 = o108["sourceUrl"];
    if (v112 !== undefined) {
      if (typeof v112 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v113 = o108["fhir"];
    if (v113 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v113)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o114 = v113;
      }
    }
  }
};
const check_clinical_immunization: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o115 = v;
    for (const k of Object.keys(o115)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v116 = o115["resourceType"];
    if (v116 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v116 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v117 = o115["fhirVersion"];
    if (v117 !== undefined) {
      if (typeof v117 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v118 = o115["displayName"];
    if (v118 !== undefined) {
      if (typeof v118 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v119 = o115["sourceUrl"];
    if (v119 !== undefined) {
      if (typeof v119 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v120 = o115["fhir"];
    if (v120 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v120)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o121 = v120;
      }
    }
  }
};
const check_clinical_lab_result: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o122 = v;
    for (const k of Object.keys(o122)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v123 = o122["resourceType"];
    if (v123 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v123 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v124 = o122["fhirVersion"];
    if (v124 !== undefined) {
      if (typeof v124 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v125 = o122["displayName"];
    if (v125 !== undefined) {
      if (typeof v125 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v126 = o122["sourceUrl"];
    if (v126 !== undefined) {
      if (typeof v126 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v127 = o122["fhir"];
    if (v127 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v127)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o128 = v127;
      }
    }
  }
};
const check_clinical_medication: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o129 = v;
    for (const k of Object.keys(o129)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v130 = o129["resourceType"];
    if (v130 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v130 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v131 = o129["fhirVersion"];
    if (v131 !== undefined) {
      if (typeof v131 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v132 = o129["displayName"];
    if (v132 !== undefined) {
      if (typeof v132 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v133 = o129["sourceUrl"];
    if (v133 !== undefined) {
      if (typeof v133 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v134 = o129["fhir"];
    if (v134 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v134)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o135 = v134;
      }
    }
  }
};
const check_clinical_note: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o136 = v;
    for (const k of Object.keys(o136)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v137 = o136["resourceType"];
    if (v137 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v137 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v138 = o136["fhirVersion"];
    if (v138 !== undefined) {
      if (typeof v138 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v139 = o136["displayName"];
    if (v139 !== undefined) {
      if (typeof v139 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v140 = o136["sourceUrl"];
    if (v140 !== undefined) {
      if (typeof v140 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v141 = o136["fhir"];
    if (v141 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v141)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o142 = v141;
      }
    }
  }
};
const check_clinical_personal_details: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o143 = v;
    for (const k of Object.keys(o143)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v144 = o143["resourceType"];
    if (v144 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v144 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v145 = o143["fhirVersion"];
    if (v145 !== undefined) {
      if (typeof v145 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v146 = o143["displayName"];
    if (v146 !== undefined) {
      if (typeof v146 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v147 = o143["sourceUrl"];
    if (v147 !== undefined) {
      if (typeof v147 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v148 = o143["fhir"];
    if (v148 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v148)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o149 = v148;
      }
    }
  }
};
const check_clinical_practitioner_details: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o150 = v;
    for (const k of Object.keys(o150)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v151 = o150["resourceType"];
    if (v151 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v151 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v152 = o150["fhirVersion"];
    if (v152 !== undefined) {
      if (typeof v152 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v153 = o150["displayName"];
    if (v153 !== undefined) {
      if (typeof v153 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v154 = o150["sourceUrl"];
    if (v154 !== undefined) {
      if (typeof v154 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v155 = o150["fhir"];
    if (v155 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v155)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o156 = v155;
      }
    }
  }
};
const check_clinical_pregnancy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o157 = v;
    for (const k of Object.keys(o157)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v158 = o157["resourceType"];
    if (v158 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v158 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v159 = o157["fhirVersion"];
    if (v159 !== undefined) {
      if (typeof v159 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v160 = o157["displayName"];
    if (v160 !== undefined) {
      if (typeof v160 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v161 = o157["sourceUrl"];
    if (v161 !== undefined) {
      if (typeof v161 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v162 = o157["fhir"];
    if (v162 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v162)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o163 = v162;
      }
    }
  }
};
const check_clinical_procedure: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o164 = v;
    for (const k of Object.keys(o164)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v165 = o164["resourceType"];
    if (v165 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v165 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v166 = o164["fhirVersion"];
    if (v166 !== undefined) {
      if (typeof v166 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v167 = o164["displayName"];
    if (v167 !== undefined) {
      if (typeof v167 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v168 = o164["sourceUrl"];
    if (v168 !== undefined) {
      if (typeof v168 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v169 = o164["fhir"];
    if (v169 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v169)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o170 = v169;
      }
    }
  }
};
const check_clinical_social_history: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o171 = v;
    for (const k of Object.keys(o171)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v172 = o171["resourceType"];
    if (v172 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v172 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v173 = o171["fhirVersion"];
    if (v173 !== undefined) {
      if (typeof v173 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v174 = o171["displayName"];
    if (v174 !== undefined) {
      if (typeof v174 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v175 = o171["sourceUrl"];
    if (v175 !== undefined) {
      if (typeof v175 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v176 = o171["fhir"];
    if (v176 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v176)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o177 = v176;
      }
    }
  }
};
const check_clinical_visit: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o178 = v;
    for (const k of Object.keys(o178)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v179 = o178["resourceType"];
    if (v179 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v179 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v180 = o178["fhirVersion"];
    if (v180 !== undefined) {
      if (typeof v180 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v181 = o178["displayName"];
    if (v181 !== undefined) {
      if (typeof v181 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v182 = o178["sourceUrl"];
    if (v182 !== undefined) {
      if (typeof v182 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v183 = o178["fhir"];
    if (v183 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v183)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o184 = v183;
      }
    }
  }
};
const check_clinical_vital_sign: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o185 = v;
    for (const k of Object.keys(o185)) if (!(["resourceType","fhirVersion","displayName","sourceUrl","fhir"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v186 = o185["resourceType"];
    if (v186 === undefined) out.push({ path: path + ".resourceType", message: 'required' });
    else {
      if (typeof v186 !== 'string') out.push({ path: path + ".resourceType", message: "must be a string" });
    }
    const v187 = o185["fhirVersion"];
    if (v187 !== undefined) {
      if (typeof v187 !== 'string') out.push({ path: path + ".fhirVersion", message: "must be a string" });
    }
    const v188 = o185["displayName"];
    if (v188 !== undefined) {
      if (typeof v188 !== 'string') out.push({ path: path + ".displayName", message: "must be a string" });
    }
    const v189 = o185["sourceUrl"];
    if (v189 !== undefined) {
      if (typeof v189 !== 'string') out.push({ path: path + ".sourceUrl", message: "must be a string" });
    }
    const v190 = o185["fhir"];
    if (v190 === undefined) out.push({ path: path + ".fhir", message: 'required' });
    else {
      if (!isObject(v190)) out.push({ path: path + ".fhir", message: "must be an object" });
      else {
        const o191 = v190;
      }
    }
  }
};
const check_contraceptive: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o192 = v;
    for (const k of Object.keys(o192)) if (!(["method"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v193 = o192["method"];
    if (v193 === undefined) out.push({ path: path + ".method", message: 'required' });
    else {
      if (typeof v193 !== 'string' || !["unspecified","implant","injection","intrauterine_device","intravaginal_ring","oral","patch"].includes(v193)) out.push({ path: path + ".method", message: "must be one of unspecified, implant, injection, intrauterine_device, intravaginal_ring, oral, patch" });
    }
  }
};
const check_cross_country_skiing_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o194 = v;
    for (const k of Object.keys(o194)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v195 = o194["metersPerSecond"];
    if (v195 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v195 !== 'number' || Number.isNaN(v195)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v195 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_cycling_cadence: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o196 = v;
    for (const k of Object.keys(o196)) if (!(["rpm"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v197 = o196["rpm"];
    if (v197 === undefined) out.push({ path: path + ".rpm", message: 'required' });
    else {
      if (typeof v197 !== 'number' || Number.isNaN(v197)) out.push({ path: path + ".rpm", message: "must be a number" });
      else {
        if (v197 < 0) out.push({ path: path + ".rpm", message: "must be ≥ 0" });
        if (v197 > 400) out.push({ path: path + ".rpm", message: "must be ≤ 400" });
      }
    }
  }
};
const check_cycling_functional_threshold_power: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o198 = v;
    for (const k of Object.keys(o198)) if (!(["watts"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v199 = o198["watts"];
    if (v199 === undefined) out.push({ path: path + ".watts", message: 'required' });
    else {
      if (typeof v199 !== 'number' || Number.isNaN(v199)) out.push({ path: path + ".watts", message: "must be a number" });
      else {
        if (v199 < 0) out.push({ path: path + ".watts", message: "must be ≥ 0" });
      }
    }
  }
};
const check_cycling_power: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o200 = v;
    for (const k of Object.keys(o200)) if (!(["watts"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v201 = o200["watts"];
    if (v201 === undefined) out.push({ path: path + ".watts", message: 'required' });
    else {
      if (typeof v201 !== 'number' || Number.isNaN(v201)) out.push({ path: path + ".watts", message: "must be a number" });
      else {
        if (v201 < 0) out.push({ path: path + ".watts", message: "must be ≥ 0" });
      }
    }
  }
};
const check_cycling_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o202 = v;
    for (const k of Object.keys(o202)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v203 = o202["metersPerSecond"];
    if (v203 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v203 !== 'number' || Number.isNaN(v203)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v203 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o204 = v;
    for (const k of Object.keys(o204)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v205 = o204["meters"];
    if (v205 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v205 !== 'number' || Number.isNaN(v205)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v205 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_cross_country_skiing: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o206 = v;
    for (const k of Object.keys(o206)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v207 = o206["meters"];
    if (v207 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v207 !== 'number' || Number.isNaN(v207)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v207 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_cycling: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o208 = v;
    for (const k of Object.keys(o208)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v209 = o208["meters"];
    if (v209 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v209 !== 'number' || Number.isNaN(v209)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v209 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_downhill_snow_sports: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o210 = v;
    for (const k of Object.keys(o210)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v211 = o210["meters"];
    if (v211 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v211 !== 'number' || Number.isNaN(v211)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v211 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_paddle_sports: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o212 = v;
    for (const k of Object.keys(o212)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v213 = o212["meters"];
    if (v213 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v213 !== 'number' || Number.isNaN(v213)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v213 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_rowing: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o214 = v;
    for (const k of Object.keys(o214)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v215 = o214["meters"];
    if (v215 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v215 !== 'number' || Number.isNaN(v215)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v215 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_skating_sports: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o216 = v;
    for (const k of Object.keys(o216)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v217 = o216["meters"];
    if (v217 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v217 !== 'number' || Number.isNaN(v217)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v217 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_swimming: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o218 = v;
    for (const k of Object.keys(o218)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v219 = o218["meters"];
    if (v219 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v219 !== 'number' || Number.isNaN(v219)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v219 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_distance_wheelchair: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o220 = v;
    for (const k of Object.keys(o220)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v221 = o220["meters"];
    if (v221 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v221 !== 'number' || Number.isNaN(v221)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v221 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_electrocardiogram: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o222 = v;
    for (const k of Object.keys(o222)) if (!(["classification","symptomsStatus","averageBpm","samplingFrequencyHz","voltageCount"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v223 = o222["classification"];
    if (v223 === undefined) out.push({ path: path + ".classification", message: 'required' });
    else {
      if (typeof v223 !== 'string' || !["not_set","sinus_rhythm","atrial_fibrillation","inconclusive_low_heart_rate","inconclusive_high_heart_rate","inconclusive_poor_reading","inconclusive_other","unrecognized"].includes(v223)) out.push({ path: path + ".classification", message: "must be one of not_set, sinus_rhythm, atrial_fibrillation, inconclusive_low_heart_rate, inconclusive_high_heart_rate, inconclusive_poor_reading, inconclusive_other, unrecognized" });
    }
    const v224 = o222["symptomsStatus"];
    if (v224 !== undefined) {
      if (typeof v224 !== 'string' || !["not_set","none","present"].includes(v224)) out.push({ path: path + ".symptomsStatus", message: "must be one of not_set, none, present" });
    }
    const v225 = o222["averageBpm"];
    if (v225 !== undefined) {
      if (typeof v225 !== 'number' || Number.isNaN(v225)) out.push({ path: path + ".averageBpm", message: "must be a number" });
      else {
        if (v225 < 0) out.push({ path: path + ".averageBpm", message: "must be ≥ 0" });
        if (v225 > 300) out.push({ path: path + ".averageBpm", message: "must be ≤ 300" });
      }
    }
    const v226 = o222["samplingFrequencyHz"];
    if (v226 !== undefined) {
      if (typeof v226 !== 'number' || Number.isNaN(v226)) out.push({ path: path + ".samplingFrequencyHz", message: "must be a number" });
      else {
        if (v226 < 0) out.push({ path: path + ".samplingFrequencyHz", message: "must be ≥ 0" });
      }
    }
    const v227 = o222["voltageCount"];
    if (v227 !== undefined) {
      if (typeof v227 !== 'number' || Number.isNaN(v227)) out.push({ path: path + ".voltageCount", message: "must be a number" });
      else {
        if (!Number.isInteger(v227)) out.push({ path: path + ".voltageCount", message: "must be an integer" });
        if (v227 < 0) out.push({ path: path + ".voltageCount", message: "must be ≥ 0" });
      }
    }
  }
};
const check_electrodermal_activity: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o228 = v;
    for (const k of Object.keys(o228)) if (!(["microsiemens"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v229 = o228["microsiemens"];
    if (v229 === undefined) out.push({ path: path + ".microsiemens", message: 'required' });
    else {
      if (typeof v229 !== 'number' || Number.isNaN(v229)) out.push({ path: path + ".microsiemens", message: "must be a number" });
      else {
        if (v229 < 0) out.push({ path: path + ".microsiemens", message: "must be ≥ 0" });
      }
    }
  }
};
const check_elevation_gained: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o230 = v;
    for (const k of Object.keys(o230)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v231 = o230["meters"];
    if (v231 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v231 !== 'number' || Number.isNaN(v231)) out.push({ path: path + ".meters", message: "must be a number" });
    }
  }
};
const check_environmental_audio_exposure: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o232 = v;
    for (const k of Object.keys(o232)) if (!(["decibels"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v233 = o232["decibels"];
    if (v233 === undefined) out.push({ path: path + ".decibels", message: 'required' });
    else {
      if (typeof v233 !== 'number' || Number.isNaN(v233)) out.push({ path: path + ".decibels", message: "must be a number" });
      else {
        if (v233 < 0) out.push({ path: path + ".decibels", message: "must be ≥ 0" });
        if (v233 > 200) out.push({ path: path + ".decibels", message: "must be ≤ 200" });
      }
    }
  }
};
const check_environmental_audio_exposure_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o234 = v;
    for (const k of Object.keys(o234)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_environmental_sound_reduction: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o235 = v;
    for (const k of Object.keys(o235)) if (!(["decibels"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v236 = o235["decibels"];
    if (v236 === undefined) out.push({ path: path + ".decibels", message: 'required' });
    else {
      if (typeof v236 !== 'number' || Number.isNaN(v236)) out.push({ path: path + ".decibels", message: "must be a number" });
      else {
        if (v236 < 0) out.push({ path: path + ".decibels", message: "must be ≥ 0" });
        if (v236 > 200) out.push({ path: path + ".decibels", message: "must be ≤ 200" });
      }
    }
  }
};
const check_estimated_workout_effort_score: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o237 = v;
    for (const k of Object.keys(o237)) if (!(["score"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v238 = o237["score"];
    if (v238 === undefined) out.push({ path: path + ".score", message: 'required' });
    else {
      if (typeof v238 !== 'number' || Number.isNaN(v238)) out.push({ path: path + ".score", message: "must be a number" });
      else {
        if (v238 < 1) out.push({ path: path + ".score", message: "must be ≥ 1" });
        if (v238 > 10) out.push({ path: path + ".score", message: "must be ≤ 10" });
      }
    }
  }
};
const check_exercise_route: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o239 = v;
    for (const k of Object.keys(o239)) if (!(["sessionId","points"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v240 = o239["sessionId"];
    if (v240 !== undefined) {
      if (typeof v240 !== 'string') out.push({ path: path + ".sessionId", message: "must be a string" });
    }
    const v241 = o239["points"];
    if (v241 === undefined) out.push({ path: path + ".points", message: 'required' });
    else {
      if (!Array.isArray(v241)) out.push({ path: path + ".points", message: "must be an array" });
      else {
        const a242: unknown[] = v241;
        for (let i243 = 0; i243 < a242.length; i243++) {
          const v244 = a242[i243];
          if (!isObject(v244)) out.push({ path: path + ".points" + '[' + i243 + ']', message: "must be an object" });
          else {
            const o245 = v244;
            for (const k of Object.keys(o245)) if (!(["time","latitude","longitude","altitudeMeters","horizontalAccuracyMeters","verticalAccuracyMeters"] as string[]).includes(k)) out.push({ path: path + ".points" + '[' + i243 + ']' + '.' + k, message: 'unknown property' });
            const v246 = o245["time"];
            if (v246 === undefined) out.push({ path: path + ".points" + '[' + i243 + ']' + ".time", message: 'required' });
            else {
              if (typeof v246 !== 'string') out.push({ path: path + ".points" + '[' + i243 + ']' + ".time", message: "must be a string" });
              else if (!DATE_TIME_RE.test(v246)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".time", message: "must be an RFC 3339 date-time" });
            }
            const v247 = o245["latitude"];
            if (v247 === undefined) out.push({ path: path + ".points" + '[' + i243 + ']' + ".latitude", message: 'required' });
            else {
              if (typeof v247 !== 'number' || Number.isNaN(v247)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".latitude", message: "must be a number" });
              else {
                if (v247 < -90) out.push({ path: path + ".points" + '[' + i243 + ']' + ".latitude", message: "must be ≥ -90" });
                if (v247 > 90) out.push({ path: path + ".points" + '[' + i243 + ']' + ".latitude", message: "must be ≤ 90" });
              }
            }
            const v248 = o245["longitude"];
            if (v248 === undefined) out.push({ path: path + ".points" + '[' + i243 + ']' + ".longitude", message: 'required' });
            else {
              if (typeof v248 !== 'number' || Number.isNaN(v248)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".longitude", message: "must be a number" });
              else {
                if (v248 < -180) out.push({ path: path + ".points" + '[' + i243 + ']' + ".longitude", message: "must be ≥ -180" });
                if (v248 > 180) out.push({ path: path + ".points" + '[' + i243 + ']' + ".longitude", message: "must be ≤ 180" });
              }
            }
            const v249 = o245["altitudeMeters"];
            if (v249 !== undefined) {
              if (typeof v249 !== 'number' || Number.isNaN(v249)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".altitudeMeters", message: "must be a number" });
            }
            const v250 = o245["horizontalAccuracyMeters"];
            if (v250 !== undefined) {
              if (typeof v250 !== 'number' || Number.isNaN(v250)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".horizontalAccuracyMeters", message: "must be a number" });
              else {
                if (v250 < 0) out.push({ path: path + ".points" + '[' + i243 + ']' + ".horizontalAccuracyMeters", message: "must be ≥ 0" });
              }
            }
            const v251 = o245["verticalAccuracyMeters"];
            if (v251 !== undefined) {
              if (typeof v251 !== 'number' || Number.isNaN(v251)) out.push({ path: path + ".points" + '[' + i243 + ']' + ".verticalAccuracyMeters", message: "must be a number" });
              else {
                if (v251 < 0) out.push({ path: path + ".points" + '[' + i243 + ']' + ".verticalAccuracyMeters", message: "must be ≥ 0" });
              }
            }
          }
        }
      }
    }
  }
};
const check_exercise_session: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o252 = v;
    for (const k of Object.keys(o252)) if (!(["activity","title","notes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v253 = o252["activity"];
    if (v253 === undefined) out.push({ path: path + ".activity", message: 'required' });
    else {
      checkExerciseType(v253, path + ".activity", out);
    }
    const v254 = o252["title"];
    if (v254 !== undefined) {
      if (typeof v254 !== 'string') out.push({ path: path + ".title", message: "must be a string" });
    }
    const v255 = o252["notes"];
    if (v255 !== undefined) {
      if (typeof v255 !== 'string') out.push({ path: path + ".notes", message: "must be a string" });
    }
  }
};
const check_floors_climbed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o256 = v;
    for (const k of Object.keys(o256)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v257 = o256["count"];
    if (v257 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v257 !== 'number' || Number.isNaN(v257)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v257 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_forced_expiratory_volume_1: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o258 = v;
    for (const k of Object.keys(o258)) if (!(["liters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v259 = o258["liters"];
    if (v259 === undefined) out.push({ path: path + ".liters", message: 'required' });
    else {
      if (typeof v259 !== 'number' || Number.isNaN(v259)) out.push({ path: path + ".liters", message: "must be a number" });
      else {
        if (v259 < 0) out.push({ path: path + ".liters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_forced_vital_capacity: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o260 = v;
    for (const k of Object.keys(o260)) if (!(["liters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v261 = o260["liters"];
    if (v261 === undefined) out.push({ path: path + ".liters", message: 'required' });
    else {
      if (typeof v261 !== 'number' || Number.isNaN(v261)) out.push({ path: path + ".liters", message: "must be a number" });
      else {
        if (v261 < 0) out.push({ path: path + ".liters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_handwashing_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o262 = v;
    for (const k of Object.keys(o262)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_headphone_audio_exposure: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o263 = v;
    for (const k of Object.keys(o263)) if (!(["decibels"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v264 = o263["decibels"];
    if (v264 === undefined) out.push({ path: path + ".decibels", message: 'required' });
    else {
      if (typeof v264 !== 'number' || Number.isNaN(v264)) out.push({ path: path + ".decibels", message: "must be a number" });
      else {
        if (v264 < 0) out.push({ path: path + ".decibels", message: "must be ≥ 0" });
        if (v264 > 200) out.push({ path: path + ".decibels", message: "must be ≤ 200" });
      }
    }
  }
};
const check_headphone_audio_exposure_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o265 = v;
    for (const k of Object.keys(o265)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_heart_rate: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o266 = v;
    for (const k of Object.keys(o266)) if (!(["bpm"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v267 = o266["bpm"];
    if (v267 === undefined) out.push({ path: path + ".bpm", message: 'required' });
    else {
      if (typeof v267 !== 'number' || Number.isNaN(v267)) out.push({ path: path + ".bpm", message: "must be a number" });
      else {
        if (v267 < 0) out.push({ path: path + ".bpm", message: "must be ≥ 0" });
        if (v267 > 300) out.push({ path: path + ".bpm", message: "must be ≤ 300" });
      }
    }
  }
};
const check_heart_rate_recovery_one_minute: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o268 = v;
    for (const k of Object.keys(o268)) if (!(["bpm"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v269 = o268["bpm"];
    if (v269 === undefined) out.push({ path: path + ".bpm", message: 'required' });
    else {
      if (typeof v269 !== 'number' || Number.isNaN(v269)) out.push({ path: path + ".bpm", message: "must be a number" });
      else {
        if (v269 < 0) out.push({ path: path + ".bpm", message: "must be ≥ 0" });
        if (v269 > 300) out.push({ path: path + ".bpm", message: "must be ≤ 300" });
      }
    }
  }
};
const check_heartbeat_series: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o270 = v;
    for (const k of Object.keys(o270)) if (!(["count","beats"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v271 = o270["count"];
    if (v271 !== undefined) {
      if (typeof v271 !== 'number' || Number.isNaN(v271)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (!Number.isInteger(v271)) out.push({ path: path + ".count", message: "must be an integer" });
        if (v271 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
    const v272 = o270["beats"];
    if (v272 === undefined) out.push({ path: path + ".beats", message: 'required' });
    else {
      if (!Array.isArray(v272)) out.push({ path: path + ".beats", message: "must be an array" });
      else {
        const a273: unknown[] = v272;
        for (let i274 = 0; i274 < a273.length; i274++) {
          const v275 = a273[i274];
          if (!isObject(v275)) out.push({ path: path + ".beats" + '[' + i274 + ']', message: "must be an object" });
          else {
            const o276 = v275;
            for (const k of Object.keys(o276)) if (!(["offsetSeconds","precededByGap"] as string[]).includes(k)) out.push({ path: path + ".beats" + '[' + i274 + ']' + '.' + k, message: 'unknown property' });
            const v277 = o276["offsetSeconds"];
            if (v277 === undefined) out.push({ path: path + ".beats" + '[' + i274 + ']' + ".offsetSeconds", message: 'required' });
            else {
              if (typeof v277 !== 'number' || Number.isNaN(v277)) out.push({ path: path + ".beats" + '[' + i274 + ']' + ".offsetSeconds", message: "must be a number" });
              else {
                if (v277 < 0) out.push({ path: path + ".beats" + '[' + i274 + ']' + ".offsetSeconds", message: "must be ≥ 0" });
              }
            }
            const v278 = o276["precededByGap"];
            if (v278 === undefined) out.push({ path: path + ".beats" + '[' + i274 + ']' + ".precededByGap", message: 'required' });
            else {
              if (typeof v278 !== 'boolean') out.push({ path: path + ".beats" + '[' + i274 + ']' + ".precededByGap", message: "must be a boolean" });
            }
          }
        }
      }
    }
  }
};
const check_height: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o279 = v;
    for (const k of Object.keys(o279)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v280 = o279["meters"];
    if (v280 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v280 !== 'number' || Number.isNaN(v280)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v280 <= 0) out.push({ path: path + ".meters", message: "must be > 0" });
        if (v280 > 3) out.push({ path: path + ".meters", message: "must be ≤ 3" });
      }
    }
  }
};
const check_high_heart_rate_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o281 = v;
    for (const k of Object.keys(o281)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_hrv_rmssd: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o282 = v;
    for (const k of Object.keys(o282)) if (!(["milliseconds"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v283 = o282["milliseconds"];
    if (v283 === undefined) out.push({ path: path + ".milliseconds", message: 'required' });
    else {
      if (typeof v283 !== 'number' || Number.isNaN(v283)) out.push({ path: path + ".milliseconds", message: "must be a number" });
      else {
        if (v283 < 0) out.push({ path: path + ".milliseconds", message: "must be ≥ 0" });
      }
    }
  }
};
const check_hrv_sdnn: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o284 = v;
    for (const k of Object.keys(o284)) if (!(["milliseconds"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v285 = o284["milliseconds"];
    if (v285 === undefined) out.push({ path: path + ".milliseconds", message: 'required' });
    else {
      if (typeof v285 !== 'number' || Number.isNaN(v285)) out.push({ path: path + ".milliseconds", message: "must be a number" });
      else {
        if (v285 < 0) out.push({ path: path + ".milliseconds", message: "must be ≥ 0" });
      }
    }
  }
};
const check_hydration: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o286 = v;
    for (const k of Object.keys(o286)) if (!(["liters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v287 = o286["liters"];
    if (v287 === undefined) out.push({ path: path + ".liters", message: 'required' });
    else {
      if (typeof v287 !== 'number' || Number.isNaN(v287)) out.push({ path: path + ".liters", message: "must be a number" });
      else {
        if (v287 < 0) out.push({ path: path + ".liters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_infrequent_menstrual_cycles: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o288 = v;
    for (const k of Object.keys(o288)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_inhaler_usage: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o289 = v;
    for (const k of Object.keys(o289)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v290 = o289["count"];
    if (v290 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v290 !== 'number' || Number.isNaN(v290)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v290 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_insulin_delivery: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o291 = v;
    for (const k of Object.keys(o291)) if (!(["internationalUnits","reason"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v292 = o291["internationalUnits"];
    if (v292 === undefined) out.push({ path: path + ".internationalUnits", message: 'required' });
    else {
      if (typeof v292 !== 'number' || Number.isNaN(v292)) out.push({ path: path + ".internationalUnits", message: "must be a number" });
      else {
        if (v292 < 0) out.push({ path: path + ".internationalUnits", message: "must be ≥ 0" });
      }
    }
    const v293 = o291["reason"];
    if (v293 !== undefined) {
      if (typeof v293 !== 'string' || !["basal","bolus"].includes(v293)) out.push({ path: path + ".reason", message: "must be one of basal, bolus" });
    }
  }
};
const check_intermenstrual_bleeding: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o294 = v;
    for (const k of Object.keys(o294)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_irregular_heart_rhythm_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o295 = v;
    for (const k of Object.keys(o295)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_irregular_menstrual_cycles: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o296 = v;
    for (const k of Object.keys(o296)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_lactation: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o297 = v;
    for (const k of Object.keys(o297)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_lean_body_mass: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o298 = v;
    for (const k of Object.keys(o298)) if (!(["kilograms"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v299 = o298["kilograms"];
    if (v299 === undefined) out.push({ path: path + ".kilograms", message: 'required' });
    else {
      if (typeof v299 !== 'number' || Number.isNaN(v299)) out.push({ path: path + ".kilograms", message: "must be a number" });
      else {
        if (v299 <= 0) out.push({ path: path + ".kilograms", message: "must be > 0" });
        if (v299 > 1000) out.push({ path: path + ".kilograms", message: "must be ≤ 1000" });
      }
    }
  }
};
const check_low_cardio_fitness_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o300 = v;
    for (const k of Object.keys(o300)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_low_heart_rate_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o301 = v;
    for (const k of Object.keys(o301)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_medication_dose: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o302 = v;
    for (const k of Object.keys(o302)) if (!(["medicationId","medicationName","status","scheduleType","scheduledAt","scheduledDose","dose","unit"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v303 = o302["medicationId"];
    if (v303 === undefined) out.push({ path: path + ".medicationId", message: 'required' });
    else {
      if (typeof v303 !== 'string') out.push({ path: path + ".medicationId", message: "must be a string" });
    }
    const v304 = o302["medicationName"];
    if (v304 !== undefined) {
      if (typeof v304 !== 'string') out.push({ path: path + ".medicationName", message: "must be a string" });
    }
    const v305 = o302["status"];
    if (v305 === undefined) out.push({ path: path + ".status", message: 'required' });
    else {
      if (typeof v305 !== 'string' || !["not_interacted","notification_not_sent","snoozed","taken","skipped","not_logged"].includes(v305)) out.push({ path: path + ".status", message: "must be one of not_interacted, notification_not_sent, snoozed, taken, skipped, not_logged" });
    }
    const v306 = o302["scheduleType"];
    if (v306 === undefined) out.push({ path: path + ".scheduleType", message: 'required' });
    else {
      if (typeof v306 !== 'string' || !["as_needed","scheduled"].includes(v306)) out.push({ path: path + ".scheduleType", message: "must be one of as_needed, scheduled" });
    }
    const v307 = o302["scheduledAt"];
    if (v307 !== undefined) {
      if (typeof v307 !== 'string') out.push({ path: path + ".scheduledAt", message: "must be a string" });
      else if (!DATE_TIME_RE.test(v307)) out.push({ path: path + ".scheduledAt", message: "must be an RFC 3339 date-time" });
    }
    const v308 = o302["scheduledDose"];
    if (v308 !== undefined) {
      if (typeof v308 !== 'number' || Number.isNaN(v308)) out.push({ path: path + ".scheduledDose", message: "must be a number" });
      else {
        if (v308 < 0) out.push({ path: path + ".scheduledDose", message: "must be ≥ 0" });
      }
    }
    const v309 = o302["dose"];
    if (v309 !== undefined) {
      if (typeof v309 !== 'number' || Number.isNaN(v309)) out.push({ path: path + ".dose", message: "must be a number" });
      else {
        if (v309 < 0) out.push({ path: path + ".dose", message: "must be ≥ 0" });
      }
    }
    const v310 = o302["unit"];
    if (v310 !== undefined) {
      if (typeof v310 !== 'string') out.push({ path: path + ".unit", message: "must be a string" });
    }
  }
};
const check_menstruation_flow: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o311 = v;
    for (const k of Object.keys(o311)) if (!(["flow","cycleStart"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v312 = o311["flow"];
    if (v312 === undefined) out.push({ path: path + ".flow", message: 'required' });
    else {
      if (typeof v312 !== 'string' || !["unknown","light","medium","heavy","none"].includes(v312)) out.push({ path: path + ".flow", message: "must be one of unknown, light, medium, heavy, none" });
    }
    const v313 = o311["cycleStart"];
    if (v313 !== undefined) {
      if (typeof v313 !== 'boolean') out.push({ path: path + ".cycleStart", message: "must be a boolean" });
    }
  }
};
const check_menstruation_period: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o314 = v;
    for (const k of Object.keys(o314)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_mindfulness_session: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o315 = v;
    for (const k of Object.keys(o315)) if (!(["sessionType","title","notes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v316 = o315["sessionType"];
    if (v316 !== undefined) {
      if (typeof v316 !== 'string' || !["meditation","breathing","movement","music","unguided","other"].includes(v316)) out.push({ path: path + ".sessionType", message: "must be one of meditation, breathing, movement, music, unguided, other" });
    }
    const v317 = o315["title"];
    if (v317 !== undefined) {
      if (typeof v317 !== 'string') out.push({ path: path + ".title", message: "must be a string" });
    }
    const v318 = o315["notes"];
    if (v318 !== undefined) {
      if (typeof v318 !== 'string') out.push({ path: path + ".notes", message: "must be a string" });
    }
  }
};
const check_nike_fuel: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o319 = v;
    for (const k of Object.keys(o319)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v320 = o319["count"];
    if (v320 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v320 !== 'number' || Number.isNaN(v320)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v320 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_number_of_alcoholic_beverages: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o321 = v;
    for (const k of Object.keys(o321)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v322 = o321["count"];
    if (v322 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v322 !== 'number' || Number.isNaN(v322)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v322 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_number_of_times_fallen: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o323 = v;
    for (const k of Object.keys(o323)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v324 = o323["count"];
    if (v324 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v324 !== 'number' || Number.isNaN(v324)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v324 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_nutrition: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o325 = v;
    for (const k of Object.keys(o325)) if (!(["kilocalories","energyFromFatKilocalories","proteinGrams","carbohydrateGrams","fatGrams","fatSaturatedGrams","fatMonounsaturatedGrams","fatPolyunsaturatedGrams","transFatGrams","unsaturatedFatGrams","fiberGrams","sugarGrams","cholesterolMilligrams","sodiumMilligrams","potassiumMilligrams","calciumMilligrams","ironMilligrams","magnesiumMilligrams","phosphorusMilligrams","zincMilligrams","copperMilligrams","manganeseMilligrams","chlorideMilligrams","seleniumMicrograms","iodineMicrograms","chromiumMicrograms","molybdenumMicrograms","vitaminAMicrograms","vitaminB6Milligrams","vitaminB12Micrograms","vitaminCMilligrams","vitaminDMicrograms","vitaminEMilligrams","vitaminKMicrograms","thiaminMilligrams","riboflavinMilligrams","niacinMilligrams","folateMicrograms","folicAcidMicrograms","biotinMicrograms","pantothenicAcidMilligrams","caffeineMilligrams","mealType","name"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v326 = o325["kilocalories"];
    if (v326 !== undefined) {
      if (typeof v326 !== 'number' || Number.isNaN(v326)) out.push({ path: path + ".kilocalories", message: "must be a number" });
      else {
        if (v326 < 0) out.push({ path: path + ".kilocalories", message: "must be ≥ 0" });
      }
    }
    const v327 = o325["energyFromFatKilocalories"];
    if (v327 !== undefined) {
      if (typeof v327 !== 'number' || Number.isNaN(v327)) out.push({ path: path + ".energyFromFatKilocalories", message: "must be a number" });
      else {
        if (v327 < 0) out.push({ path: path + ".energyFromFatKilocalories", message: "must be ≥ 0" });
      }
    }
    const v328 = o325["proteinGrams"];
    if (v328 !== undefined) {
      if (typeof v328 !== 'number' || Number.isNaN(v328)) out.push({ path: path + ".proteinGrams", message: "must be a number" });
      else {
        if (v328 < 0) out.push({ path: path + ".proteinGrams", message: "must be ≥ 0" });
      }
    }
    const v329 = o325["carbohydrateGrams"];
    if (v329 !== undefined) {
      if (typeof v329 !== 'number' || Number.isNaN(v329)) out.push({ path: path + ".carbohydrateGrams", message: "must be a number" });
      else {
        if (v329 < 0) out.push({ path: path + ".carbohydrateGrams", message: "must be ≥ 0" });
      }
    }
    const v330 = o325["fatGrams"];
    if (v330 !== undefined) {
      if (typeof v330 !== 'number' || Number.isNaN(v330)) out.push({ path: path + ".fatGrams", message: "must be a number" });
      else {
        if (v330 < 0) out.push({ path: path + ".fatGrams", message: "must be ≥ 0" });
      }
    }
    const v331 = o325["fatSaturatedGrams"];
    if (v331 !== undefined) {
      if (typeof v331 !== 'number' || Number.isNaN(v331)) out.push({ path: path + ".fatSaturatedGrams", message: "must be a number" });
      else {
        if (v331 < 0) out.push({ path: path + ".fatSaturatedGrams", message: "must be ≥ 0" });
      }
    }
    const v332 = o325["fatMonounsaturatedGrams"];
    if (v332 !== undefined) {
      if (typeof v332 !== 'number' || Number.isNaN(v332)) out.push({ path: path + ".fatMonounsaturatedGrams", message: "must be a number" });
      else {
        if (v332 < 0) out.push({ path: path + ".fatMonounsaturatedGrams", message: "must be ≥ 0" });
      }
    }
    const v333 = o325["fatPolyunsaturatedGrams"];
    if (v333 !== undefined) {
      if (typeof v333 !== 'number' || Number.isNaN(v333)) out.push({ path: path + ".fatPolyunsaturatedGrams", message: "must be a number" });
      else {
        if (v333 < 0) out.push({ path: path + ".fatPolyunsaturatedGrams", message: "must be ≥ 0" });
      }
    }
    const v334 = o325["transFatGrams"];
    if (v334 !== undefined) {
      if (typeof v334 !== 'number' || Number.isNaN(v334)) out.push({ path: path + ".transFatGrams", message: "must be a number" });
      else {
        if (v334 < 0) out.push({ path: path + ".transFatGrams", message: "must be ≥ 0" });
      }
    }
    const v335 = o325["unsaturatedFatGrams"];
    if (v335 !== undefined) {
      if (typeof v335 !== 'number' || Number.isNaN(v335)) out.push({ path: path + ".unsaturatedFatGrams", message: "must be a number" });
      else {
        if (v335 < 0) out.push({ path: path + ".unsaturatedFatGrams", message: "must be ≥ 0" });
      }
    }
    const v336 = o325["fiberGrams"];
    if (v336 !== undefined) {
      if (typeof v336 !== 'number' || Number.isNaN(v336)) out.push({ path: path + ".fiberGrams", message: "must be a number" });
      else {
        if (v336 < 0) out.push({ path: path + ".fiberGrams", message: "must be ≥ 0" });
      }
    }
    const v337 = o325["sugarGrams"];
    if (v337 !== undefined) {
      if (typeof v337 !== 'number' || Number.isNaN(v337)) out.push({ path: path + ".sugarGrams", message: "must be a number" });
      else {
        if (v337 < 0) out.push({ path: path + ".sugarGrams", message: "must be ≥ 0" });
      }
    }
    const v338 = o325["cholesterolMilligrams"];
    if (v338 !== undefined) {
      if (typeof v338 !== 'number' || Number.isNaN(v338)) out.push({ path: path + ".cholesterolMilligrams", message: "must be a number" });
      else {
        if (v338 < 0) out.push({ path: path + ".cholesterolMilligrams", message: "must be ≥ 0" });
      }
    }
    const v339 = o325["sodiumMilligrams"];
    if (v339 !== undefined) {
      if (typeof v339 !== 'number' || Number.isNaN(v339)) out.push({ path: path + ".sodiumMilligrams", message: "must be a number" });
      else {
        if (v339 < 0) out.push({ path: path + ".sodiumMilligrams", message: "must be ≥ 0" });
      }
    }
    const v340 = o325["potassiumMilligrams"];
    if (v340 !== undefined) {
      if (typeof v340 !== 'number' || Number.isNaN(v340)) out.push({ path: path + ".potassiumMilligrams", message: "must be a number" });
      else {
        if (v340 < 0) out.push({ path: path + ".potassiumMilligrams", message: "must be ≥ 0" });
      }
    }
    const v341 = o325["calciumMilligrams"];
    if (v341 !== undefined) {
      if (typeof v341 !== 'number' || Number.isNaN(v341)) out.push({ path: path + ".calciumMilligrams", message: "must be a number" });
      else {
        if (v341 < 0) out.push({ path: path + ".calciumMilligrams", message: "must be ≥ 0" });
      }
    }
    const v342 = o325["ironMilligrams"];
    if (v342 !== undefined) {
      if (typeof v342 !== 'number' || Number.isNaN(v342)) out.push({ path: path + ".ironMilligrams", message: "must be a number" });
      else {
        if (v342 < 0) out.push({ path: path + ".ironMilligrams", message: "must be ≥ 0" });
      }
    }
    const v343 = o325["magnesiumMilligrams"];
    if (v343 !== undefined) {
      if (typeof v343 !== 'number' || Number.isNaN(v343)) out.push({ path: path + ".magnesiumMilligrams", message: "must be a number" });
      else {
        if (v343 < 0) out.push({ path: path + ".magnesiumMilligrams", message: "must be ≥ 0" });
      }
    }
    const v344 = o325["phosphorusMilligrams"];
    if (v344 !== undefined) {
      if (typeof v344 !== 'number' || Number.isNaN(v344)) out.push({ path: path + ".phosphorusMilligrams", message: "must be a number" });
      else {
        if (v344 < 0) out.push({ path: path + ".phosphorusMilligrams", message: "must be ≥ 0" });
      }
    }
    const v345 = o325["zincMilligrams"];
    if (v345 !== undefined) {
      if (typeof v345 !== 'number' || Number.isNaN(v345)) out.push({ path: path + ".zincMilligrams", message: "must be a number" });
      else {
        if (v345 < 0) out.push({ path: path + ".zincMilligrams", message: "must be ≥ 0" });
      }
    }
    const v346 = o325["copperMilligrams"];
    if (v346 !== undefined) {
      if (typeof v346 !== 'number' || Number.isNaN(v346)) out.push({ path: path + ".copperMilligrams", message: "must be a number" });
      else {
        if (v346 < 0) out.push({ path: path + ".copperMilligrams", message: "must be ≥ 0" });
      }
    }
    const v347 = o325["manganeseMilligrams"];
    if (v347 !== undefined) {
      if (typeof v347 !== 'number' || Number.isNaN(v347)) out.push({ path: path + ".manganeseMilligrams", message: "must be a number" });
      else {
        if (v347 < 0) out.push({ path: path + ".manganeseMilligrams", message: "must be ≥ 0" });
      }
    }
    const v348 = o325["chlorideMilligrams"];
    if (v348 !== undefined) {
      if (typeof v348 !== 'number' || Number.isNaN(v348)) out.push({ path: path + ".chlorideMilligrams", message: "must be a number" });
      else {
        if (v348 < 0) out.push({ path: path + ".chlorideMilligrams", message: "must be ≥ 0" });
      }
    }
    const v349 = o325["seleniumMicrograms"];
    if (v349 !== undefined) {
      if (typeof v349 !== 'number' || Number.isNaN(v349)) out.push({ path: path + ".seleniumMicrograms", message: "must be a number" });
      else {
        if (v349 < 0) out.push({ path: path + ".seleniumMicrograms", message: "must be ≥ 0" });
      }
    }
    const v350 = o325["iodineMicrograms"];
    if (v350 !== undefined) {
      if (typeof v350 !== 'number' || Number.isNaN(v350)) out.push({ path: path + ".iodineMicrograms", message: "must be a number" });
      else {
        if (v350 < 0) out.push({ path: path + ".iodineMicrograms", message: "must be ≥ 0" });
      }
    }
    const v351 = o325["chromiumMicrograms"];
    if (v351 !== undefined) {
      if (typeof v351 !== 'number' || Number.isNaN(v351)) out.push({ path: path + ".chromiumMicrograms", message: "must be a number" });
      else {
        if (v351 < 0) out.push({ path: path + ".chromiumMicrograms", message: "must be ≥ 0" });
      }
    }
    const v352 = o325["molybdenumMicrograms"];
    if (v352 !== undefined) {
      if (typeof v352 !== 'number' || Number.isNaN(v352)) out.push({ path: path + ".molybdenumMicrograms", message: "must be a number" });
      else {
        if (v352 < 0) out.push({ path: path + ".molybdenumMicrograms", message: "must be ≥ 0" });
      }
    }
    const v353 = o325["vitaminAMicrograms"];
    if (v353 !== undefined) {
      if (typeof v353 !== 'number' || Number.isNaN(v353)) out.push({ path: path + ".vitaminAMicrograms", message: "must be a number" });
      else {
        if (v353 < 0) out.push({ path: path + ".vitaminAMicrograms", message: "must be ≥ 0" });
      }
    }
    const v354 = o325["vitaminB6Milligrams"];
    if (v354 !== undefined) {
      if (typeof v354 !== 'number' || Number.isNaN(v354)) out.push({ path: path + ".vitaminB6Milligrams", message: "must be a number" });
      else {
        if (v354 < 0) out.push({ path: path + ".vitaminB6Milligrams", message: "must be ≥ 0" });
      }
    }
    const v355 = o325["vitaminB12Micrograms"];
    if (v355 !== undefined) {
      if (typeof v355 !== 'number' || Number.isNaN(v355)) out.push({ path: path + ".vitaminB12Micrograms", message: "must be a number" });
      else {
        if (v355 < 0) out.push({ path: path + ".vitaminB12Micrograms", message: "must be ≥ 0" });
      }
    }
    const v356 = o325["vitaminCMilligrams"];
    if (v356 !== undefined) {
      if (typeof v356 !== 'number' || Number.isNaN(v356)) out.push({ path: path + ".vitaminCMilligrams", message: "must be a number" });
      else {
        if (v356 < 0) out.push({ path: path + ".vitaminCMilligrams", message: "must be ≥ 0" });
      }
    }
    const v357 = o325["vitaminDMicrograms"];
    if (v357 !== undefined) {
      if (typeof v357 !== 'number' || Number.isNaN(v357)) out.push({ path: path + ".vitaminDMicrograms", message: "must be a number" });
      else {
        if (v357 < 0) out.push({ path: path + ".vitaminDMicrograms", message: "must be ≥ 0" });
      }
    }
    const v358 = o325["vitaminEMilligrams"];
    if (v358 !== undefined) {
      if (typeof v358 !== 'number' || Number.isNaN(v358)) out.push({ path: path + ".vitaminEMilligrams", message: "must be a number" });
      else {
        if (v358 < 0) out.push({ path: path + ".vitaminEMilligrams", message: "must be ≥ 0" });
      }
    }
    const v359 = o325["vitaminKMicrograms"];
    if (v359 !== undefined) {
      if (typeof v359 !== 'number' || Number.isNaN(v359)) out.push({ path: path + ".vitaminKMicrograms", message: "must be a number" });
      else {
        if (v359 < 0) out.push({ path: path + ".vitaminKMicrograms", message: "must be ≥ 0" });
      }
    }
    const v360 = o325["thiaminMilligrams"];
    if (v360 !== undefined) {
      if (typeof v360 !== 'number' || Number.isNaN(v360)) out.push({ path: path + ".thiaminMilligrams", message: "must be a number" });
      else {
        if (v360 < 0) out.push({ path: path + ".thiaminMilligrams", message: "must be ≥ 0" });
      }
    }
    const v361 = o325["riboflavinMilligrams"];
    if (v361 !== undefined) {
      if (typeof v361 !== 'number' || Number.isNaN(v361)) out.push({ path: path + ".riboflavinMilligrams", message: "must be a number" });
      else {
        if (v361 < 0) out.push({ path: path + ".riboflavinMilligrams", message: "must be ≥ 0" });
      }
    }
    const v362 = o325["niacinMilligrams"];
    if (v362 !== undefined) {
      if (typeof v362 !== 'number' || Number.isNaN(v362)) out.push({ path: path + ".niacinMilligrams", message: "must be a number" });
      else {
        if (v362 < 0) out.push({ path: path + ".niacinMilligrams", message: "must be ≥ 0" });
      }
    }
    const v363 = o325["folateMicrograms"];
    if (v363 !== undefined) {
      if (typeof v363 !== 'number' || Number.isNaN(v363)) out.push({ path: path + ".folateMicrograms", message: "must be a number" });
      else {
        if (v363 < 0) out.push({ path: path + ".folateMicrograms", message: "must be ≥ 0" });
      }
    }
    const v364 = o325["folicAcidMicrograms"];
    if (v364 !== undefined) {
      if (typeof v364 !== 'number' || Number.isNaN(v364)) out.push({ path: path + ".folicAcidMicrograms", message: "must be a number" });
      else {
        if (v364 < 0) out.push({ path: path + ".folicAcidMicrograms", message: "must be ≥ 0" });
      }
    }
    const v365 = o325["biotinMicrograms"];
    if (v365 !== undefined) {
      if (typeof v365 !== 'number' || Number.isNaN(v365)) out.push({ path: path + ".biotinMicrograms", message: "must be a number" });
      else {
        if (v365 < 0) out.push({ path: path + ".biotinMicrograms", message: "must be ≥ 0" });
      }
    }
    const v366 = o325["pantothenicAcidMilligrams"];
    if (v366 !== undefined) {
      if (typeof v366 !== 'number' || Number.isNaN(v366)) out.push({ path: path + ".pantothenicAcidMilligrams", message: "must be a number" });
      else {
        if (v366 < 0) out.push({ path: path + ".pantothenicAcidMilligrams", message: "must be ≥ 0" });
      }
    }
    const v367 = o325["caffeineMilligrams"];
    if (v367 !== undefined) {
      if (typeof v367 !== 'number' || Number.isNaN(v367)) out.push({ path: path + ".caffeineMilligrams", message: "must be a number" });
      else {
        if (v367 < 0) out.push({ path: path + ".caffeineMilligrams", message: "must be ≥ 0" });
      }
    }
    const v368 = o325["mealType"];
    if (v368 !== undefined) {
      checkMealType(v368, path + ".mealType", out);
    }
    const v369 = o325["name"];
    if (v369 !== undefined) {
      if (typeof v369 !== 'string') out.push({ path: path + ".name", message: "must be a string" });
    }
  }
};
const check_ovulation_test: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o370 = v;
    for (const k of Object.keys(o370)) if (!(["result"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v371 = o370["result"];
    if (v371 === undefined) out.push({ path: path + ".result", message: 'required' });
    else {
      if (typeof v371 !== 'string' || !["negative","positive","high","inconclusive"].includes(v371)) out.push({ path: path + ".result", message: "must be one of negative, positive, high, inconclusive" });
    }
  }
};
const check_oxygen_saturation: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o372 = v;
    for (const k of Object.keys(o372)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v373 = o372["percent"];
    if (v373 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v373 !== 'number' || Number.isNaN(v373)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v373 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v373 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_paddle_sports_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o374 = v;
    for (const k of Object.keys(o374)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v375 = o374["metersPerSecond"];
    if (v375 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v375 !== 'number' || Number.isNaN(v375)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v375 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_peak_expiratory_flow_rate: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o376 = v;
    for (const k of Object.keys(o376)) if (!(["litersPerMinute"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v377 = o376["litersPerMinute"];
    if (v377 === undefined) out.push({ path: path + ".litersPerMinute", message: 'required' });
    else {
      if (typeof v377 !== 'number' || Number.isNaN(v377)) out.push({ path: path + ".litersPerMinute", message: "must be a number" });
      else {
        if (v377 < 0) out.push({ path: path + ".litersPerMinute", message: "must be ≥ 0" });
      }
    }
  }
};
const check_peripheral_perfusion_index: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o378 = v;
    for (const k of Object.keys(o378)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v379 = o378["percent"];
    if (v379 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v379 !== 'number' || Number.isNaN(v379)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v379 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v379 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_persistent_intermenstrual_bleeding: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o380 = v;
    for (const k of Object.keys(o380)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_physical_effort: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o381 = v;
    for (const k of Object.keys(o381)) if (!(["metsEquivalent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v382 = o381["metsEquivalent"];
    if (v382 === undefined) out.push({ path: path + ".metsEquivalent", message: 'required' });
    else {
      if (typeof v382 !== 'number' || Number.isNaN(v382)) out.push({ path: path + ".metsEquivalent", message: "must be a number" });
      else {
        if (v382 < 0) out.push({ path: path + ".metsEquivalent", message: "must be ≥ 0" });
      }
    }
  }
};
const check_power: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o383 = v;
    for (const k of Object.keys(o383)) if (!(["watts"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v384 = o383["watts"];
    if (v384 === undefined) out.push({ path: path + ".watts", message: 'required' });
    else {
      if (typeof v384 !== 'number' || Number.isNaN(v384)) out.push({ path: path + ".watts", message: "must be a number" });
      else {
        if (v384 < 0) out.push({ path: path + ".watts", message: "must be ≥ 0" });
      }
    }
  }
};
const check_pregnancy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o385 = v;
    for (const k of Object.keys(o385)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_pregnancy_test: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o386 = v;
    for (const k of Object.keys(o386)) if (!(["result"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v387 = o386["result"];
    if (v387 === undefined) out.push({ path: path + ".result", message: 'required' });
    else {
      if (typeof v387 !== 'string' || !["negative","positive","indeterminate"].includes(v387)) out.push({ path: path + ".result", message: "must be one of negative, positive, indeterminate" });
    }
  }
};
const check_progesterone_test: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o388 = v;
    for (const k of Object.keys(o388)) if (!(["result"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v389 = o388["result"];
    if (v389 === undefined) out.push({ path: path + ".result", message: 'required' });
    else {
      if (typeof v389 !== 'string' || !["negative","positive","indeterminate"].includes(v389)) out.push({ path: path + ".result", message: "must be one of negative, positive, indeterminate" });
    }
  }
};
const check_prolonged_menstrual_periods: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o390 = v;
    for (const k of Object.keys(o390)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_respiratory_rate: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o391 = v;
    for (const k of Object.keys(o391)) if (!(["breathsPerMinute"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v392 = o391["breathsPerMinute"];
    if (v392 === undefined) out.push({ path: path + ".breathsPerMinute", message: 'required' });
    else {
      if (typeof v392 !== 'number' || Number.isNaN(v392)) out.push({ path: path + ".breathsPerMinute", message: "must be a number" });
      else {
        if (v392 < 0) out.push({ path: path + ".breathsPerMinute", message: "must be ≥ 0" });
        if (v392 > 100) out.push({ path: path + ".breathsPerMinute", message: "must be ≤ 100" });
      }
    }
  }
};
const check_resting_heart_rate: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o393 = v;
    for (const k of Object.keys(o393)) if (!(["bpm"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v394 = o393["bpm"];
    if (v394 === undefined) out.push({ path: path + ".bpm", message: 'required' });
    else {
      if (typeof v394 !== 'number' || Number.isNaN(v394)) out.push({ path: path + ".bpm", message: "must be a number" });
      else {
        if (v394 < 0) out.push({ path: path + ".bpm", message: "must be ≥ 0" });
        if (v394 > 300) out.push({ path: path + ".bpm", message: "must be ≤ 300" });
      }
    }
  }
};
const check_rowing_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o395 = v;
    for (const k of Object.keys(o395)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v396 = o395["metersPerSecond"];
    if (v396 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v396 !== 'number' || Number.isNaN(v396)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v396 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_running_ground_contact_time: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o397 = v;
    for (const k of Object.keys(o397)) if (!(["milliseconds"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v398 = o397["milliseconds"];
    if (v398 === undefined) out.push({ path: path + ".milliseconds", message: 'required' });
    else {
      if (typeof v398 !== 'number' || Number.isNaN(v398)) out.push({ path: path + ".milliseconds", message: "must be a number" });
      else {
        if (v398 < 0) out.push({ path: path + ".milliseconds", message: "must be ≥ 0" });
      }
    }
  }
};
const check_running_power: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o399 = v;
    for (const k of Object.keys(o399)) if (!(["watts"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v400 = o399["watts"];
    if (v400 === undefined) out.push({ path: path + ".watts", message: 'required' });
    else {
      if (typeof v400 !== 'number' || Number.isNaN(v400)) out.push({ path: path + ".watts", message: "must be a number" });
      else {
        if (v400 < 0) out.push({ path: path + ".watts", message: "must be ≥ 0" });
      }
    }
  }
};
const check_running_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o401 = v;
    for (const k of Object.keys(o401)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v402 = o401["metersPerSecond"];
    if (v402 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v402 !== 'number' || Number.isNaN(v402)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v402 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_running_stride_length: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o403 = v;
    for (const k of Object.keys(o403)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v404 = o403["meters"];
    if (v404 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v404 !== 'number' || Number.isNaN(v404)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v404 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_running_vertical_oscillation: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o405 = v;
    for (const k of Object.keys(o405)) if (!(["centimeters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v406 = o405["centimeters"];
    if (v406 === undefined) out.push({ path: path + ".centimeters", message: 'required' });
    else {
      if (typeof v406 !== 'number' || Number.isNaN(v406)) out.push({ path: path + ".centimeters", message: "must be a number" });
      else {
        if (v406 < 0) out.push({ path: path + ".centimeters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_sexual_activity: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o407 = v;
    for (const k of Object.keys(o407)) if (!(["protectionUsed"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v408 = o407["protectionUsed"];
    if (v408 !== undefined) {
      if (typeof v408 !== 'string' || !["protected","unprotected","unknown"].includes(v408)) out.push({ path: path + ".protectionUsed", message: "must be one of protected, unprotected, unknown" });
    }
  }
};
const check_six_minute_walk_distance: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o409 = v;
    for (const k of Object.keys(o409)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v410 = o409["meters"];
    if (v410 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v410 !== 'number' || Number.isNaN(v410)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v410 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_skin_temperature: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o411 = v;
    for (const k of Object.keys(o411)) if (!(["deltaCelsius","baselineCelsius","measurementLocation"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v412 = o411["deltaCelsius"];
    if (v412 === undefined) out.push({ path: path + ".deltaCelsius", message: 'required' });
    else {
      if (typeof v412 !== 'number' || Number.isNaN(v412)) out.push({ path: path + ".deltaCelsius", message: "must be a number" });
      else {
        if (v412 < -30) out.push({ path: path + ".deltaCelsius", message: "must be ≥ -30" });
        if (v412 > 30) out.push({ path: path + ".deltaCelsius", message: "must be ≤ 30" });
      }
    }
    const v413 = o411["baselineCelsius"];
    if (v413 !== undefined) {
      if (typeof v413 !== 'number' || Number.isNaN(v413)) out.push({ path: path + ".baselineCelsius", message: "must be a number" });
      else {
        if (v413 < 20) out.push({ path: path + ".baselineCelsius", message: "must be ≥ 20" });
        if (v413 > 50) out.push({ path: path + ".baselineCelsius", message: "must be ≤ 50" });
      }
    }
    const v414 = o411["measurementLocation"];
    if (v414 !== undefined) {
      if (typeof v414 !== 'string' || !["finger","toe","wrist","unknown"].includes(v414)) out.push({ path: path + ".measurementLocation", message: "must be one of finger, toe, wrist, unknown" });
    }
  }
};
const check_sleep_apnea_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o415 = v;
    for (const k of Object.keys(o415)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_sleep_session: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o416 = v;
    for (const k of Object.keys(o416)) if (!(["stages","title","notes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v417 = o416["stages"];
    if (v417 === undefined) out.push({ path: path + ".stages", message: 'required' });
    else {
      if (!Array.isArray(v417)) out.push({ path: path + ".stages", message: "must be an array" });
      else {
        const a418: unknown[] = v417;
        for (let i419 = 0; i419 < a418.length; i419++) {
          const v420 = a418[i419];
          if (!isObject(v420)) out.push({ path: path + ".stages" + '[' + i419 + ']', message: "must be an object" });
          else {
            const o421 = v420;
            for (const k of Object.keys(o421)) if (!(["stage","start","end"] as string[]).includes(k)) out.push({ path: path + ".stages" + '[' + i419 + ']' + '.' + k, message: 'unknown property' });
            const v422 = o421["stage"];
            if (v422 === undefined) out.push({ path: path + ".stages" + '[' + i419 + ']' + ".stage", message: 'required' });
            else {
              checkSleepStage(v422, path + ".stages" + '[' + i419 + ']' + ".stage", out);
            }
            const v423 = o421["start"];
            if (v423 === undefined) out.push({ path: path + ".stages" + '[' + i419 + ']' + ".start", message: 'required' });
            else {
              if (typeof v423 !== 'string') out.push({ path: path + ".stages" + '[' + i419 + ']' + ".start", message: "must be a string" });
              else if (!DATE_TIME_RE.test(v423)) out.push({ path: path + ".stages" + '[' + i419 + ']' + ".start", message: "must be an RFC 3339 date-time" });
            }
            const v424 = o421["end"];
            if (v424 === undefined) out.push({ path: path + ".stages" + '[' + i419 + ']' + ".end", message: 'required' });
            else {
              if (typeof v424 !== 'string') out.push({ path: path + ".stages" + '[' + i419 + ']' + ".end", message: "must be a string" });
              else if (!DATE_TIME_RE.test(v424)) out.push({ path: path + ".stages" + '[' + i419 + ']' + ".end", message: "must be an RFC 3339 date-time" });
            }
          }
        }
      }
    }
    const v425 = o416["title"];
    if (v425 !== undefined) {
      if (typeof v425 !== 'string') out.push({ path: path + ".title", message: "must be a string" });
    }
    const v426 = o416["notes"];
    if (v426 !== undefined) {
      if (typeof v426 !== 'string') out.push({ path: path + ".notes", message: "must be a string" });
    }
  }
};
const check_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o427 = v;
    for (const k of Object.keys(o427)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v428 = o427["metersPerSecond"];
    if (v428 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v428 !== 'number' || Number.isNaN(v428)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v428 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_stair_ascent_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o429 = v;
    for (const k of Object.keys(o429)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v430 = o429["metersPerSecond"];
    if (v430 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v430 !== 'number' || Number.isNaN(v430)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v430 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_stair_descent_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o431 = v;
    for (const k of Object.keys(o431)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v432 = o431["metersPerSecond"];
    if (v432 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v432 !== 'number' || Number.isNaN(v432)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v432 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_state_of_mind: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o433 = v;
    for (const k of Object.keys(o433)) if (!(["kind","valence","valenceClassification","labels","associations"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v434 = o433["kind"];
    if (v434 === undefined) out.push({ path: path + ".kind", message: 'required' });
    else {
      if (typeof v434 !== 'string' || !["momentary_emotion","daily_mood"].includes(v434)) out.push({ path: path + ".kind", message: "must be one of momentary_emotion, daily_mood" });
    }
    const v435 = o433["valence"];
    if (v435 === undefined) out.push({ path: path + ".valence", message: 'required' });
    else {
      if (typeof v435 !== 'number' || Number.isNaN(v435)) out.push({ path: path + ".valence", message: "must be a number" });
      else {
        if (v435 < -1) out.push({ path: path + ".valence", message: "must be ≥ -1" });
        if (v435 > 1) out.push({ path: path + ".valence", message: "must be ≤ 1" });
      }
    }
    const v436 = o433["valenceClassification"];
    if (v436 !== undefined) {
      if (typeof v436 !== 'string' || !["very_unpleasant","unpleasant","slightly_unpleasant","neutral","slightly_pleasant","pleasant","very_pleasant"].includes(v436)) out.push({ path: path + ".valenceClassification", message: "must be one of very_unpleasant, unpleasant, slightly_unpleasant, neutral, slightly_pleasant, pleasant, very_pleasant" });
    }
    const v437 = o433["labels"];
    if (v437 !== undefined) {
      if (!Array.isArray(v437)) out.push({ path: path + ".labels", message: "must be an array" });
      else {
        const a438: unknown[] = v437;
        for (let i439 = 0; i439 < a438.length; i439++) {
          const v440 = a438[i439];
          if (typeof v440 !== 'string' || !["amazed","amused","angry","anxious","ashamed","brave","calm","content","disappointed","discouraged","disgusted","embarrassed","excited","frustrated","grateful","guilty","happy","hopeless","irritated","jealous","joyful","lonely","passionate","peaceful","proud","relieved","sad","scared","stressed","surprised","worried","annoyed","confident","drained","hopeful","indifferent","overwhelmed","satisfied"].includes(v440)) out.push({ path: path + ".labels" + '[' + i439 + ']', message: "must be one of amazed, amused, angry, anxious, ashamed, brave, calm, content, disappointed, discouraged, disgusted, embarrassed, excited, frustrated, grateful, guilty, happy, hopeless, irritated, jealous, joyful, lonely, passionate, peaceful, proud, relieved, sad, scared, stressed, surprised, worried, annoyed, confident, drained, hopeful, indifferent, overwhelmed, satisfied" });
        }
      }
    }
    const v441 = o433["associations"];
    if (v441 !== undefined) {
      if (!Array.isArray(v441)) out.push({ path: path + ".associations", message: "must be an array" });
      else {
        const a442: unknown[] = v441;
        for (let i443 = 0; i443 < a442.length; i443++) {
          const v444 = a442[i443];
          if (typeof v444 !== 'string' || !["community","current_events","dating","education","family","fitness","friends","health","hobbies","identity","money","partner","self_care","spirituality","tasks","travel","work","weather"].includes(v444)) out.push({ path: path + ".associations" + '[' + i443 + ']', message: "must be one of community, current_events, dating, education, family, fitness, friends, health, hobbies, identity, money, partner, self_care, spirituality, tasks, travel, work, weather" });
        }
      }
    }
  }
};
const check_steps: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o445 = v;
    for (const k of Object.keys(o445)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v446 = o445["count"];
    if (v446 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v446 !== 'number' || Number.isNaN(v446)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (!Number.isInteger(v446)) out.push({ path: path + ".count", message: "must be an integer" });
        if (v446 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_steps_cadence: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o447 = v;
    for (const k of Object.keys(o447)) if (!(["stepsPerMinute"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v448 = o447["stepsPerMinute"];
    if (v448 === undefined) out.push({ path: path + ".stepsPerMinute", message: 'required' });
    else {
      if (typeof v448 !== 'number' || Number.isNaN(v448)) out.push({ path: path + ".stepsPerMinute", message: "must be a number" });
      else {
        if (v448 < 0) out.push({ path: path + ".stepsPerMinute", message: "must be ≥ 0" });
        if (v448 > 400) out.push({ path: path + ".stepsPerMinute", message: "must be ≤ 400" });
      }
    }
  }
};
const check_swimming_stroke_count: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o449 = v;
    for (const k of Object.keys(o449)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v450 = o449["count"];
    if (v450 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v450 !== 'number' || Number.isNaN(v450)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (v450 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_symptom_abdominal_cramps: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o451 = v;
    for (const k of Object.keys(o451)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v452 = o451["severity"];
    if (v452 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v452 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v452)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_acne: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o453 = v;
    for (const k of Object.keys(o453)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v454 = o453["severity"];
    if (v454 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v454 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v454)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_appetite_changes: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o455 = v;
    for (const k of Object.keys(o455)) if (!(["change"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v456 = o455["change"];
    if (v456 === undefined) out.push({ path: path + ".change", message: 'required' });
    else {
      if (typeof v456 !== 'string' || !["unspecified","no_change","decreased","increased"].includes(v456)) out.push({ path: path + ".change", message: "must be one of unspecified, no_change, decreased, increased" });
    }
  }
};
const check_symptom_bladder_incontinence: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o457 = v;
    for (const k of Object.keys(o457)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v458 = o457["severity"];
    if (v458 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v458 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v458)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_bloating: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o459 = v;
    for (const k of Object.keys(o459)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v460 = o459["severity"];
    if (v460 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v460 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v460)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_breast_pain: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o461 = v;
    for (const k of Object.keys(o461)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v462 = o461["severity"];
    if (v462 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v462 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v462)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_chest_tightness_or_pain: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o463 = v;
    for (const k of Object.keys(o463)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v464 = o463["severity"];
    if (v464 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v464 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v464)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_chills: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o465 = v;
    for (const k of Object.keys(o465)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v466 = o465["severity"];
    if (v466 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v466 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v466)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_constipation: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o467 = v;
    for (const k of Object.keys(o467)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v468 = o467["severity"];
    if (v468 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v468 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v468)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_coughing: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o469 = v;
    for (const k of Object.keys(o469)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v470 = o469["severity"];
    if (v470 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v470 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v470)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_diarrhea: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o471 = v;
    for (const k of Object.keys(o471)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v472 = o471["severity"];
    if (v472 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v472 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v472)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_dizziness: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o473 = v;
    for (const k of Object.keys(o473)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v474 = o473["severity"];
    if (v474 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v474 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v474)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_dry_skin: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o475 = v;
    for (const k of Object.keys(o475)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v476 = o475["severity"];
    if (v476 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v476 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v476)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_fainting: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o477 = v;
    for (const k of Object.keys(o477)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v478 = o477["severity"];
    if (v478 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v478 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v478)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_fatigue: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o479 = v;
    for (const k of Object.keys(o479)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v480 = o479["severity"];
    if (v480 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v480 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v480)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_fever: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o481 = v;
    for (const k of Object.keys(o481)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v482 = o481["severity"];
    if (v482 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v482 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v482)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_generalized_body_ache: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o483 = v;
    for (const k of Object.keys(o483)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v484 = o483["severity"];
    if (v484 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v484 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v484)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_hair_loss: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o485 = v;
    for (const k of Object.keys(o485)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v486 = o485["severity"];
    if (v486 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v486 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v486)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_headache: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o487 = v;
    for (const k of Object.keys(o487)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v488 = o487["severity"];
    if (v488 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v488 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v488)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_heartburn: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o489 = v;
    for (const k of Object.keys(o489)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v490 = o489["severity"];
    if (v490 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v490 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v490)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_hot_flashes: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o491 = v;
    for (const k of Object.keys(o491)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v492 = o491["severity"];
    if (v492 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v492 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v492)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_loss_of_smell: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o493 = v;
    for (const k of Object.keys(o493)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v494 = o493["severity"];
    if (v494 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v494 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v494)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_loss_of_taste: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o495 = v;
    for (const k of Object.keys(o495)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v496 = o495["severity"];
    if (v496 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v496 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v496)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_lower_back_pain: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o497 = v;
    for (const k of Object.keys(o497)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v498 = o497["severity"];
    if (v498 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v498 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v498)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_memory_lapse: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o499 = v;
    for (const k of Object.keys(o499)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v500 = o499["severity"];
    if (v500 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v500 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v500)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_mood_changes: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o501 = v;
    for (const k of Object.keys(o501)) if (!(["presence"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v502 = o501["presence"];
    if (v502 === undefined) out.push({ path: path + ".presence", message: 'required' });
    else {
      if (typeof v502 !== 'string' || !["present","not_present"].includes(v502)) out.push({ path: path + ".presence", message: "must be one of present, not_present" });
    }
  }
};
const check_symptom_nausea: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o503 = v;
    for (const k of Object.keys(o503)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v504 = o503["severity"];
    if (v504 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v504 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v504)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_night_sweats: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o505 = v;
    for (const k of Object.keys(o505)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v506 = o505["severity"];
    if (v506 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v506 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v506)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_pelvic_pain: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o507 = v;
    for (const k of Object.keys(o507)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v508 = o507["severity"];
    if (v508 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v508 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v508)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_rapid_pounding_or_fluttering_heartbeat: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o509 = v;
    for (const k of Object.keys(o509)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v510 = o509["severity"];
    if (v510 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v510 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v510)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_runny_nose: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o511 = v;
    for (const k of Object.keys(o511)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v512 = o511["severity"];
    if (v512 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v512 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v512)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_shortness_of_breath: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o513 = v;
    for (const k of Object.keys(o513)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v514 = o513["severity"];
    if (v514 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v514 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v514)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_sinus_congestion: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o515 = v;
    for (const k of Object.keys(o515)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v516 = o515["severity"];
    if (v516 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v516 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v516)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_skipped_heartbeat: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o517 = v;
    for (const k of Object.keys(o517)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v518 = o517["severity"];
    if (v518 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v518 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v518)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_sleep_changes: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o519 = v;
    for (const k of Object.keys(o519)) if (!(["presence"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v520 = o519["presence"];
    if (v520 === undefined) out.push({ path: path + ".presence", message: 'required' });
    else {
      if (typeof v520 !== 'string' || !["present","not_present"].includes(v520)) out.push({ path: path + ".presence", message: "must be one of present, not_present" });
    }
  }
};
const check_symptom_sore_throat: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o521 = v;
    for (const k of Object.keys(o521)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v522 = o521["severity"];
    if (v522 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v522 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v522)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_vaginal_dryness: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o523 = v;
    for (const k of Object.keys(o523)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v524 = o523["severity"];
    if (v524 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v524 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v524)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_vomiting: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o525 = v;
    for (const k of Object.keys(o525)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v526 = o525["severity"];
    if (v526 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v526 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v526)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_symptom_wheezing: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o527 = v;
    for (const k of Object.keys(o527)) if (!(["severity"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v528 = o527["severity"];
    if (v528 === undefined) out.push({ path: path + ".severity", message: 'required' });
    else {
      if (typeof v528 !== 'string' || !["unspecified","not_present","mild","moderate","severe"].includes(v528)) out.push({ path: path + ".severity", message: "must be one of unspecified, not_present, mild, moderate, severe" });
    }
  }
};
const check_time_in_daylight: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o529 = v;
    for (const k of Object.keys(o529)) if (!(["minutes"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v530 = o529["minutes"];
    if (v530 === undefined) out.push({ path: path + ".minutes", message: 'required' });
    else {
      if (typeof v530 !== 'number' || Number.isNaN(v530)) out.push({ path: path + ".minutes", message: "must be a number" });
      else {
        if (v530 < 0) out.push({ path: path + ".minutes", message: "must be ≥ 0" });
      }
    }
  }
};
const check_toothbrushing_event: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o531 = v;
    for (const k of Object.keys(o531)) if (!([] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
  }
};
const check_total_energy: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o532 = v;
    for (const k of Object.keys(o532)) if (!(["kilocalories"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v533 = o532["kilocalories"];
    if (v533 === undefined) out.push({ path: path + ".kilocalories", message: 'required' });
    else {
      if (typeof v533 !== 'number' || Number.isNaN(v533)) out.push({ path: path + ".kilocalories", message: "must be a number" });
      else {
        if (v533 < 0) out.push({ path: path + ".kilocalories", message: "must be ≥ 0" });
      }
    }
  }
};
const check_underwater_depth: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o534 = v;
    for (const k of Object.keys(o534)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v535 = o534["meters"];
    if (v535 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v535 !== 'number' || Number.isNaN(v535)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v535 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_uv_exposure: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o536 = v;
    for (const k of Object.keys(o536)) if (!(["uvIndex"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v537 = o536["uvIndex"];
    if (v537 === undefined) out.push({ path: path + ".uvIndex", message: 'required' });
    else {
      if (typeof v537 !== 'number' || Number.isNaN(v537)) out.push({ path: path + ".uvIndex", message: "must be a number" });
      else {
        if (v537 < 0) out.push({ path: path + ".uvIndex", message: "must be ≥ 0" });
        if (v537 > 20) out.push({ path: path + ".uvIndex", message: "must be ≤ 20" });
      }
    }
  }
};
const check_vo2_max: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o538 = v;
    for (const k of Object.keys(o538)) if (!(["mlPerKgPerMin","measurementMethod"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v539 = o538["mlPerKgPerMin"];
    if (v539 === undefined) out.push({ path: path + ".mlPerKgPerMin", message: 'required' });
    else {
      if (typeof v539 !== 'number' || Number.isNaN(v539)) out.push({ path: path + ".mlPerKgPerMin", message: "must be a number" });
      else {
        if (v539 < 0) out.push({ path: path + ".mlPerKgPerMin", message: "must be ≥ 0" });
        if (v539 > 100) out.push({ path: path + ".mlPerKgPerMin", message: "must be ≤ 100" });
      }
    }
    const v540 = o538["measurementMethod"];
    if (v540 !== undefined) {
      if (typeof v540 !== 'string' || !["metabolic_cart","heart_rate_ratio","cooper_test","multistage_fitness_test","rockport_fitness_test","other"].includes(v540)) out.push({ path: path + ".measurementMethod", message: "must be one of metabolic_cart, heart_rate_ratio, cooper_test, multistage_fitness_test, rockport_fitness_test, other" });
    }
  }
};
const check_waist_circumference: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o541 = v;
    for (const k of Object.keys(o541)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v542 = o541["meters"];
    if (v542 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v542 !== 'number' || Number.isNaN(v542)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v542 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
        if (v542 > 5) out.push({ path: path + ".meters", message: "must be ≤ 5" });
      }
    }
  }
};
const check_walking_asymmetry: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o543 = v;
    for (const k of Object.keys(o543)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v544 = o543["percent"];
    if (v544 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v544 !== 'number' || Number.isNaN(v544)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v544 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v544 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_walking_double_support: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o545 = v;
    for (const k of Object.keys(o545)) if (!(["percent"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v546 = o545["percent"];
    if (v546 === undefined) out.push({ path: path + ".percent", message: 'required' });
    else {
      if (typeof v546 !== 'number' || Number.isNaN(v546)) out.push({ path: path + ".percent", message: "must be a number" });
      else {
        if (v546 < 0) out.push({ path: path + ".percent", message: "must be ≥ 0" });
        if (v546 > 100) out.push({ path: path + ".percent", message: "must be ≤ 100" });
      }
    }
  }
};
const check_walking_heart_rate_average: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o547 = v;
    for (const k of Object.keys(o547)) if (!(["bpm"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v548 = o547["bpm"];
    if (v548 === undefined) out.push({ path: path + ".bpm", message: 'required' });
    else {
      if (typeof v548 !== 'number' || Number.isNaN(v548)) out.push({ path: path + ".bpm", message: "must be a number" });
      else {
        if (v548 < 0) out.push({ path: path + ".bpm", message: "must be ≥ 0" });
        if (v548 > 300) out.push({ path: path + ".bpm", message: "must be ≤ 300" });
      }
    }
  }
};
const check_walking_speed: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o549 = v;
    for (const k of Object.keys(o549)) if (!(["metersPerSecond"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v550 = o549["metersPerSecond"];
    if (v550 === undefined) out.push({ path: path + ".metersPerSecond", message: 'required' });
    else {
      if (typeof v550 !== 'number' || Number.isNaN(v550)) out.push({ path: path + ".metersPerSecond", message: "must be a number" });
      else {
        if (v550 < 0) out.push({ path: path + ".metersPerSecond", message: "must be ≥ 0" });
      }
    }
  }
};
const check_walking_step_length: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o551 = v;
    for (const k of Object.keys(o551)) if (!(["meters"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v552 = o551["meters"];
    if (v552 === undefined) out.push({ path: path + ".meters", message: 'required' });
    else {
      if (typeof v552 !== 'number' || Number.isNaN(v552)) out.push({ path: path + ".meters", message: "must be a number" });
      else {
        if (v552 < 0) out.push({ path: path + ".meters", message: "must be ≥ 0" });
      }
    }
  }
};
const check_water_temperature: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o553 = v;
    for (const k of Object.keys(o553)) if (!(["celsius"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v554 = o553["celsius"];
    if (v554 === undefined) out.push({ path: path + ".celsius", message: 'required' });
    else {
      if (typeof v554 !== 'number' || Number.isNaN(v554)) out.push({ path: path + ".celsius", message: "must be a number" });
      else {
        if (v554 < 0) out.push({ path: path + ".celsius", message: "must be ≥ 0" });
      }
    }
  }
};
const check_weight: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o555 = v;
    for (const k of Object.keys(o555)) if (!(["kilograms"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v556 = o555["kilograms"];
    if (v556 === undefined) out.push({ path: path + ".kilograms", message: 'required' });
    else {
      if (typeof v556 !== 'number' || Number.isNaN(v556)) out.push({ path: path + ".kilograms", message: "must be a number" });
      else {
        if (v556 <= 0) out.push({ path: path + ".kilograms", message: "must be > 0" });
        if (v556 > 1000) out.push({ path: path + ".kilograms", message: "must be ≤ 1000" });
      }
    }
  }
};
const check_wheelchair_pushes: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o557 = v;
    for (const k of Object.keys(o557)) if (!(["count"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v558 = o557["count"];
    if (v558 === undefined) out.push({ path: path + ".count", message: 'required' });
    else {
      if (typeof v558 !== 'number' || Number.isNaN(v558)) out.push({ path: path + ".count", message: "must be a number" });
      else {
        if (!Number.isInteger(v558)) out.push({ path: path + ".count", message: "must be an integer" });
        if (v558 < 0) out.push({ path: path + ".count", message: "must be ≥ 0" });
      }
    }
  }
};
const check_workout_effort_score: Check = (v, path, out) => {
  if (!isObject(v)) out.push({ path: path, message: "must be an object" });
  else {
    const o559 = v;
    for (const k of Object.keys(o559)) if (!(["score"] as string[]).includes(k)) out.push({ path: path + '.' + k, message: 'unknown property' });
    const v560 = o559["score"];
    if (v560 === undefined) out.push({ path: path + ".score", message: 'required' });
    else {
      if (typeof v560 !== 'number' || Number.isNaN(v560)) out.push({ path: path + ".score", message: "must be a number" });
      else {
        if (v560 < 1) out.push({ path: path + ".score", message: "must be ≥ 1" });
        if (v560 > 10) out.push({ path: path + ".score", message: "must be ≤ 10" });
      }
    }
  }
};

export const VALUE_CHECKS: Record<HealthType, Check> = {
  active_energy: check_active_energy,
  activity_summary: check_activity_summary,
  apple_exercise_time: check_apple_exercise_time,
  apple_move_time: check_apple_move_time,
  apple_sleeping_breathing_disturbances: check_apple_sleeping_breathing_disturbances,
  apple_sleeping_wrist_temperature: check_apple_sleeping_wrist_temperature,
  apple_stand_hour: check_apple_stand_hour,
  apple_stand_time: check_apple_stand_time,
  apple_walking_steadiness: check_apple_walking_steadiness,
  apple_walking_steadiness_event: check_apple_walking_steadiness_event,
  atrial_fibrillation_burden: check_atrial_fibrillation_burden,
  basal_body_temperature: check_basal_body_temperature,
  basal_energy: check_basal_energy,
  basal_metabolic_rate: check_basal_metabolic_rate,
  bleeding_after_pregnancy: check_bleeding_after_pregnancy,
  bleeding_during_pregnancy: check_bleeding_during_pregnancy,
  blood_alcohol_content: check_blood_alcohol_content,
  blood_glucose: check_blood_glucose,
  blood_pressure: check_blood_pressure,
  body_fat: check_body_fat,
  body_mass_index: check_body_mass_index,
  body_temperature: check_body_temperature,
  body_water_mass: check_body_water_mass,
  bone_mass: check_bone_mass,
  cervical_mucus: check_cervical_mucus,
  clinical_allergy: check_clinical_allergy,
  clinical_condition: check_clinical_condition,
  clinical_coverage: check_clinical_coverage,
  clinical_immunization: check_clinical_immunization,
  clinical_lab_result: check_clinical_lab_result,
  clinical_medication: check_clinical_medication,
  clinical_note: check_clinical_note,
  clinical_personal_details: check_clinical_personal_details,
  clinical_practitioner_details: check_clinical_practitioner_details,
  clinical_pregnancy: check_clinical_pregnancy,
  clinical_procedure: check_clinical_procedure,
  clinical_social_history: check_clinical_social_history,
  clinical_visit: check_clinical_visit,
  clinical_vital_sign: check_clinical_vital_sign,
  contraceptive: check_contraceptive,
  cross_country_skiing_speed: check_cross_country_skiing_speed,
  cycling_cadence: check_cycling_cadence,
  cycling_functional_threshold_power: check_cycling_functional_threshold_power,
  cycling_power: check_cycling_power,
  cycling_speed: check_cycling_speed,
  distance: check_distance,
  distance_cross_country_skiing: check_distance_cross_country_skiing,
  distance_cycling: check_distance_cycling,
  distance_downhill_snow_sports: check_distance_downhill_snow_sports,
  distance_paddle_sports: check_distance_paddle_sports,
  distance_rowing: check_distance_rowing,
  distance_skating_sports: check_distance_skating_sports,
  distance_swimming: check_distance_swimming,
  distance_wheelchair: check_distance_wheelchair,
  electrocardiogram: check_electrocardiogram,
  electrodermal_activity: check_electrodermal_activity,
  elevation_gained: check_elevation_gained,
  environmental_audio_exposure: check_environmental_audio_exposure,
  environmental_audio_exposure_event: check_environmental_audio_exposure_event,
  environmental_sound_reduction: check_environmental_sound_reduction,
  estimated_workout_effort_score: check_estimated_workout_effort_score,
  exercise_route: check_exercise_route,
  exercise_session: check_exercise_session,
  floors_climbed: check_floors_climbed,
  forced_expiratory_volume_1: check_forced_expiratory_volume_1,
  forced_vital_capacity: check_forced_vital_capacity,
  handwashing_event: check_handwashing_event,
  headphone_audio_exposure: check_headphone_audio_exposure,
  headphone_audio_exposure_event: check_headphone_audio_exposure_event,
  heart_rate: check_heart_rate,
  heart_rate_recovery_one_minute: check_heart_rate_recovery_one_minute,
  heartbeat_series: check_heartbeat_series,
  height: check_height,
  high_heart_rate_event: check_high_heart_rate_event,
  hrv_rmssd: check_hrv_rmssd,
  hrv_sdnn: check_hrv_sdnn,
  hydration: check_hydration,
  infrequent_menstrual_cycles: check_infrequent_menstrual_cycles,
  inhaler_usage: check_inhaler_usage,
  insulin_delivery: check_insulin_delivery,
  intermenstrual_bleeding: check_intermenstrual_bleeding,
  irregular_heart_rhythm_event: check_irregular_heart_rhythm_event,
  irregular_menstrual_cycles: check_irregular_menstrual_cycles,
  lactation: check_lactation,
  lean_body_mass: check_lean_body_mass,
  low_cardio_fitness_event: check_low_cardio_fitness_event,
  low_heart_rate_event: check_low_heart_rate_event,
  medication_dose: check_medication_dose,
  menstruation_flow: check_menstruation_flow,
  menstruation_period: check_menstruation_period,
  mindfulness_session: check_mindfulness_session,
  nike_fuel: check_nike_fuel,
  number_of_alcoholic_beverages: check_number_of_alcoholic_beverages,
  number_of_times_fallen: check_number_of_times_fallen,
  nutrition: check_nutrition,
  ovulation_test: check_ovulation_test,
  oxygen_saturation: check_oxygen_saturation,
  paddle_sports_speed: check_paddle_sports_speed,
  peak_expiratory_flow_rate: check_peak_expiratory_flow_rate,
  peripheral_perfusion_index: check_peripheral_perfusion_index,
  persistent_intermenstrual_bleeding: check_persistent_intermenstrual_bleeding,
  physical_effort: check_physical_effort,
  power: check_power,
  pregnancy: check_pregnancy,
  pregnancy_test: check_pregnancy_test,
  progesterone_test: check_progesterone_test,
  prolonged_menstrual_periods: check_prolonged_menstrual_periods,
  respiratory_rate: check_respiratory_rate,
  resting_heart_rate: check_resting_heart_rate,
  rowing_speed: check_rowing_speed,
  running_ground_contact_time: check_running_ground_contact_time,
  running_power: check_running_power,
  running_speed: check_running_speed,
  running_stride_length: check_running_stride_length,
  running_vertical_oscillation: check_running_vertical_oscillation,
  sexual_activity: check_sexual_activity,
  six_minute_walk_distance: check_six_minute_walk_distance,
  skin_temperature: check_skin_temperature,
  sleep_apnea_event: check_sleep_apnea_event,
  sleep_session: check_sleep_session,
  speed: check_speed,
  stair_ascent_speed: check_stair_ascent_speed,
  stair_descent_speed: check_stair_descent_speed,
  state_of_mind: check_state_of_mind,
  steps: check_steps,
  steps_cadence: check_steps_cadence,
  swimming_stroke_count: check_swimming_stroke_count,
  symptom_abdominal_cramps: check_symptom_abdominal_cramps,
  symptom_acne: check_symptom_acne,
  symptom_appetite_changes: check_symptom_appetite_changes,
  symptom_bladder_incontinence: check_symptom_bladder_incontinence,
  symptom_bloating: check_symptom_bloating,
  symptom_breast_pain: check_symptom_breast_pain,
  symptom_chest_tightness_or_pain: check_symptom_chest_tightness_or_pain,
  symptom_chills: check_symptom_chills,
  symptom_constipation: check_symptom_constipation,
  symptom_coughing: check_symptom_coughing,
  symptom_diarrhea: check_symptom_diarrhea,
  symptom_dizziness: check_symptom_dizziness,
  symptom_dry_skin: check_symptom_dry_skin,
  symptom_fainting: check_symptom_fainting,
  symptom_fatigue: check_symptom_fatigue,
  symptom_fever: check_symptom_fever,
  symptom_generalized_body_ache: check_symptom_generalized_body_ache,
  symptom_hair_loss: check_symptom_hair_loss,
  symptom_headache: check_symptom_headache,
  symptom_heartburn: check_symptom_heartburn,
  symptom_hot_flashes: check_symptom_hot_flashes,
  symptom_loss_of_smell: check_symptom_loss_of_smell,
  symptom_loss_of_taste: check_symptom_loss_of_taste,
  symptom_lower_back_pain: check_symptom_lower_back_pain,
  symptom_memory_lapse: check_symptom_memory_lapse,
  symptom_mood_changes: check_symptom_mood_changes,
  symptom_nausea: check_symptom_nausea,
  symptom_night_sweats: check_symptom_night_sweats,
  symptom_pelvic_pain: check_symptom_pelvic_pain,
  symptom_rapid_pounding_or_fluttering_heartbeat: check_symptom_rapid_pounding_or_fluttering_heartbeat,
  symptom_runny_nose: check_symptom_runny_nose,
  symptom_shortness_of_breath: check_symptom_shortness_of_breath,
  symptom_sinus_congestion: check_symptom_sinus_congestion,
  symptom_skipped_heartbeat: check_symptom_skipped_heartbeat,
  symptom_sleep_changes: check_symptom_sleep_changes,
  symptom_sore_throat: check_symptom_sore_throat,
  symptom_vaginal_dryness: check_symptom_vaginal_dryness,
  symptom_vomiting: check_symptom_vomiting,
  symptom_wheezing: check_symptom_wheezing,
  time_in_daylight: check_time_in_daylight,
  toothbrushing_event: check_toothbrushing_event,
  total_energy: check_total_energy,
  underwater_depth: check_underwater_depth,
  uv_exposure: check_uv_exposure,
  vo2_max: check_vo2_max,
  waist_circumference: check_waist_circumference,
  walking_asymmetry: check_walking_asymmetry,
  walking_double_support: check_walking_double_support,
  walking_heart_rate_average: check_walking_heart_rate_average,
  walking_speed: check_walking_speed,
  walking_step_length: check_walking_step_length,
  water_temperature: check_water_temperature,
  weight: check_weight,
  wheelchair_pushes: check_wheelchair_pushes,
  workout_effort_score: check_workout_effort_score,
};

/** Validate a type's `value` object. Empty array = valid. */
export function validateValue(type: HealthType, value: unknown, path = 'value'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  VALUE_CHECKS[type](value, path, out);
  return out;
}

/**
 * Validate a whole record: envelope, known type, value, and the time rules of SPEC §1.1
 * (end ≥ start; samples have start == end). Pass { partial: true } for records about to be written.
 */
export function validateRecord(record: unknown, options: EnvelopeOptions = {}, path = 'record'): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  checkEnvelope(record, path, out, options);
  if (out.length || !isObject(record)) return out;
  const type = record['type'] as HealthType;
  VALUE_CHECKS[type](record['value'], path + '.value', out);
  const start = Date.parse(String(record['start']));
  const end = Date.parse(String(record['end']));
  if (end < start) out.push({ path: path + '.end', message: 'must not be before start' });
  else if (TYPE_MAPPINGS[type].kind === 'sample' && end !== start) out.push({ path: path + '.end', message: 'samples must have end == start' });
  return out;
}
