// GENERATED FILE — do not edit. Source of truth: spec/schema/**. Regenerate with `pnpm codegen`.
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
    "clinical_allergy" to MedicalResource.MEDICAL_RESOURCE_TYPE_ALLERGIES_INTOLERANCES,
    "clinical_condition" to MedicalResource.MEDICAL_RESOURCE_TYPE_CONDITIONS,
    "clinical_immunization" to MedicalResource.MEDICAL_RESOURCE_TYPE_VACCINES,
    "clinical_lab_result" to MedicalResource.MEDICAL_RESOURCE_TYPE_LABORATORY_RESULTS,
    "clinical_medication" to MedicalResource.MEDICAL_RESOURCE_TYPE_MEDICATIONS,
    "clinical_personal_details" to MedicalResource.MEDICAL_RESOURCE_TYPE_PERSONAL_DETAILS,
    "clinical_practitioner_details" to MedicalResource.MEDICAL_RESOURCE_TYPE_PRACTITIONER_DETAILS,
    "clinical_pregnancy" to MedicalResource.MEDICAL_RESOURCE_TYPE_PREGNANCY,
    "clinical_procedure" to MedicalResource.MEDICAL_RESOURCE_TYPE_PROCEDURES,
    "clinical_social_history" to MedicalResource.MEDICAL_RESOURCE_TYPE_SOCIAL_HISTORY,
    "clinical_visit" to MedicalResource.MEDICAL_RESOURCE_TYPE_VISITS,
    "clinical_vital_sign" to MedicalResource.MEDICAL_RESOURCE_TYPE_VITAL_SIGNS,
  )

  val permissionById: Map<String, String> = mapOf(
    "clinical_allergy" to "android.permission.health.READ_MEDICAL_DATA_ALLERGIES_INTOLERANCES",
    "clinical_condition" to "android.permission.health.READ_MEDICAL_DATA_CONDITIONS",
    "clinical_immunization" to "android.permission.health.READ_MEDICAL_DATA_VACCINES",
    "clinical_lab_result" to "android.permission.health.READ_MEDICAL_DATA_LABORATORY_RESULTS",
    "clinical_medication" to "android.permission.health.READ_MEDICAL_DATA_MEDICATIONS",
    "clinical_personal_details" to "android.permission.health.READ_MEDICAL_DATA_PERSONAL_DETAILS",
    "clinical_practitioner_details" to "android.permission.health.READ_MEDICAL_DATA_PRACTITIONER_DETAILS",
    "clinical_pregnancy" to "android.permission.health.READ_MEDICAL_DATA_PREGNANCY",
    "clinical_procedure" to "android.permission.health.READ_MEDICAL_DATA_PROCEDURES",
    "clinical_social_history" to "android.permission.health.READ_MEDICAL_DATA_SOCIAL_HISTORY",
    "clinical_visit" to "android.permission.health.READ_MEDICAL_DATA_VISITS",
    "clinical_vital_sign" to "android.permission.health.READ_MEDICAL_DATA_VITAL_SIGNS",
  )

  fun require(id: String): Int = byId[id] ?: throw IllegalArgumentException("'$id' is not a Health Connect medical resource type")
}
