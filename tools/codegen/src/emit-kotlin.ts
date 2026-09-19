import type { SpecBundle } from './load.js';

/** type id → Health Connect record class + permission suffix, for the Android module. */
export function emitKotlinTypes(b: SpecBundle): string {
  const rows = b.types
    .filter((t) => {
      const hc = t.json['x-healthspec'].platforms?.healthconnect;
      return hc && !hc.special && !hc.medicalResourceType;
    })
    .map((t) => {
      const hc = t.json['x-healthspec'].platforms.healthconnect;
      const primary = Object.keys(t.json.properties ?? {}).find((k) => t.json.properties[k]?.['x-unit']);
      const feature = hc.feature ? `HealthConnectFeatures.FEATURE_${hc.feature}` : 'null';
      return `    "${t.json.title}" to TypeSpec(${hc.record}::class, "${hc.permission}", ${hc.read}, ${hc.write}, ${hc.series ? 'true' : 'false'}, ${primary ? `"${primary}"` : 'null'}, ${feature}),`;
    });
  return `// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with \`pnpm codegen\`.
@file:OptIn(ExperimentalMindfulnessSessionApi::class)

package dev.healthspec.generated

import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.feature.ExperimentalMindfulnessSessionApi
import androidx.health.connect.client.records.*
import kotlin.reflect.KClass

data class TypeSpec(
  val recordClass: KClass<out Record>,
  val permissionSuffix: String,
  val read: Boolean,
  val write: Boolean,
  /** Record holds a series of samples that the provider flattens into one record per sample. */
  val series: Boolean,
  /** First numeric value field — what aggregate() operates on unless a field is named. */
  val primaryField: String?,
  /** HealthConnectFeatures.FEATURE_* the device must report available, or null when every device has the type. */
  val feature: Int?,
) {
  val readPermission get() = "android.permission.health.READ_$permissionSuffix"
  val writePermission get() = "android.permission.health.WRITE_$permissionSuffix"
}

object HealthSpecTypes {
  val byId: Map<String, TypeSpec> = mapOf(
${rows.join('\n')}
  )

  fun require(id: String): TypeSpec = byId[id] ?: throw IllegalArgumentException("Health Connect does not support type '$id'")
}
`;
}

/** Owner class of each spec enum's Health Connect constants. */
const ENUM_OWNERS: Record<string, string> = {
  ExerciseType: 'ExerciseSessionRecord',
  SleepStage: 'SleepSessionRecord',
  MealType: 'MealType',
  DeviceType: 'Device',
  RecordingMethod: 'Metadata',
};

/** Spec enum value ↔ Health Connect Int constant maps, for the Android serializers. */
export function emitKotlinEnums(b: SpecBundle): string {
  const blocks: string[] = [];
  for (const e of b.enums) {
    const title: string = e.json.title;
    const owner = ENUM_OWNERS[title];
    const mapping = e.json['x-healthspec']?.mapping;
    if (!owner || !mapping) continue;
    const name = title[0]!.toLowerCase() + title.slice(1);
    const rows = (e.json.enum as string[])
      .filter((v) => typeof mapping[v]?.healthconnect === 'string' && /^[A-Z0-9_]+$/.test(mapping[v].healthconnect))
      .map((v) => `    "${v}" to ${owner}.${mapping[v].healthconnect},`);
    blocks.push(`  /** ${title} → ${owner} constants */\n  val ${name}: Map<String, Int> = mapOf(\n${rows.join('\n')}\n  )\n  val ${name}ById: Map<Int, String> = ${name}.entries.associate { (k, v) -> v to k }`);
  }
  return `// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with \`pnpm codegen\`.
package dev.healthspec.generated

import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.MealType
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.metadata.Device
import androidx.health.connect.client.records.metadata.Metadata

object HealthSpecEnums {
${blocks.join('\n\n')}
}
`;
}

/** Kotlin string literal — escapes quotes, backslashes and `$` template starts. */
const kotlinLit = (s: string): string => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;

const KOTLIN_UNIT_ACCESSOR: Record<string, { ctor: string; getter: string }> = {
  kcal: { ctor: 'Energy.kilocalories', getter: 'inKilocalories' },
  g: { ctor: 'Mass.grams', getter: 'inGrams' },
  mg: { ctor: 'Mass.milligrams', getter: 'inMilligrams' },
  mcg: { ctor: 'Mass.micrograms', getter: 'inMicrograms' },
};

/** NutritionRecord ↔ spec value, generated so the nutrient list lives only in spec/schema/types/nutrition.json. */
export function emitKotlinNutrition(b: SpecBundle): string {
  const t = b.types.find((x) => x.json.title === 'nutrition');
  if (!t) throw new Error('nutrition type missing');
  const hc = t.json['x-healthspec'].platforms.healthconnect;
  const fields: Array<[string, string]> = Object.entries(hc.fields ?? {});
  const unitOf = (field: string): string => t.json.properties[field]?.['x-unit'] ?? '';
  const toJson = fields.map(([field, prop]) => {
    const acc = KOTLIN_UNIT_ACCESSOR[unitOf(field)];
    if (!acc) throw new Error(`nutrition field ${field}: no Kotlin accessor for unit "${unitOf(field)}"`);
    return `    "${field}" to r.${prop}?.${acc.getter},`;
  });
  const fromJson = fields.map(([field, prop]) => {
    const acc = KOTLIN_UNIT_ACCESSOR[unitOf(field)] as { ctor: string };
    return `    ${prop} = (value["${field}"] as? Number)?.toDouble()?.let { ${acc.ctor}(it) },`;
  });
  return `// GENERATED FILE — do not edit. Source of truth: spec/schema/types/nutrition.json. Regenerate with \`pnpm codegen\`.
package dev.healthspec.generated

import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.units.Energy
import androidx.health.connect.client.units.Mass
import java.time.Instant
import java.time.ZoneOffset

object HealthSpecNutrition {
  /** Nutrient fields only — mealType and name are added by the caller. */
  fun nutrients(r: NutritionRecord): Map<String, Any?> = mapOf(
${toJson.join('\n')}
  ).filterValues { it != null }

  fun record(
    start: Instant,
    startOffset: ZoneOffset?,
    end: Instant,
    endOffset: ZoneOffset?,
    value: Map<String, Any?>,
    name: String?,
    mealType: Int,
    metadata: Metadata,
  ): NutritionRecord = NutritionRecord(
    startTime = start,
    startZoneOffset = startOffset,
    endTime = end,
    endZoneOffset = endOffset,
${fromJson.join('\n')}
    name = name,
    mealType = mealType,
    metadata = metadata,
  )
}
`;
}

/** Spec type id → Health Connect MedicalResourceType constant, for the Personal Health Record path. */
export function emitKotlinMedicalTypes(b: SpecBundle): string {
  const rows = b.types
    .filter((t) => t.json['x-healthspec'].platforms?.healthconnect?.medicalResourceType)
    .map((t) => `    "${t.json.title}" to MedicalResource.MEDICAL_RESOURCE_TYPE_${t.json['x-healthspec'].platforms.healthconnect.medicalResourceType},`);
  const permissions = b.types
    .filter((t) => t.json['x-healthspec'].platforms?.healthconnect?.medicalResourceType)
    .map((t) => `    "${t.json.title}" to "android.permission.health.READ_${t.json['x-healthspec'].platforms.healthconnect.permission}",`);
  return `// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with \`pnpm codegen\`.
@file:OptIn(ExperimentalPersonalHealthRecordApi::class)

package dev.healthspec.generated

import androidx.health.connect.client.feature.ExperimentalPersonalHealthRecordApi
import androidx.health.connect.client.records.MedicalResource

/**
 * Personal Health Record resources. These are not [androidx.health.connect.client.records.Record]s: they are
 * read through readMedicalResources and carry a FHIR JSON payload rather than typed fields.
 */
object HealthSpecMedicalTypes {
  val byId: Map<String, Int> = mapOf(
${rows.join('\n')}
  )

  val permissionById: Map<String, String> = mapOf(
${permissions.join('\n')}
  )

  fun require(id: String): Int = byId[id] ?: throw IllegalArgumentException("'$id' is not a Health Connect medical resource type")
}
`;
}
