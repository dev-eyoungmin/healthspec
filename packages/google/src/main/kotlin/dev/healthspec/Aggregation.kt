package dev.healthspec

import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.aggregate.AggregateMetric
import androidx.health.connect.client.aggregate.AggregationResult
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.BasalMetabolicRateRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.CyclingPedalingCadenceRecord
import androidx.health.connect.client.records.ElevationGainedRecord
import androidx.health.connect.client.records.PowerRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.records.StepsCadenceRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.FloorsClimbedRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeightRecord
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.records.WheelchairPushesRecord
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.request.AggregateGroupByDurationRequest
import androidx.health.connect.client.request.AggregateGroupByPeriodRequest
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.health.connect.client.units.Energy
import androidx.health.connect.client.units.Length
import androidx.health.connect.client.units.Mass
import androidx.health.connect.client.units.Power
import androidx.health.connect.client.units.Pressure
import androidx.health.connect.client.units.Velocity
import androidx.health.connect.client.units.Volume
import dev.healthspec.generated.TypeSpec
import java.time.DayOfWeek
import java.time.Duration
import java.time.Instant
import java.time.Period
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAdjusters

/**
 * SPEC §6 on Health Connect. Native AggregateMetrics where they exist (de-duplicated by the platform, §6.3);
 * otherwise records are read and reduced here, mirroring @healthspec/core's aggregateRecords.
 */
object Aggregation {
  class Bucket(val start: Instant, val end: Instant, var value: Double? = null)

  /** Serialised records in [start, end) honouring the origin / manual filters. */
  fun interface Reader {
    suspend fun read(start: Instant, end: Instant, origins: Set<DataOrigin>, excludeManual: Boolean): List<Map<String, Any?>>
  }

  fun metric(type: String, fn: String, field: String?): AggregateMetric<*>? = when (type) {
    "steps" -> StepsRecord.COUNT_TOTAL.takeIf { fn == "sum" }
    "distance" -> DistanceRecord.DISTANCE_TOTAL.takeIf { fn == "sum" }
    "active_energy" -> ActiveCaloriesBurnedRecord.ACTIVE_CALORIES_TOTAL.takeIf { fn == "sum" }
    "total_energy" -> TotalCaloriesBurnedRecord.ENERGY_TOTAL.takeIf { fn == "sum" }
    "floors_climbed" -> FloorsClimbedRecord.FLOORS_CLIMBED_TOTAL.takeIf { fn == "sum" }
    "wheelchair_pushes" -> WheelchairPushesRecord.COUNT_TOTAL.takeIf { fn == "sum" }
    "exercise_session" -> ExerciseSessionRecord.EXERCISE_DURATION_TOTAL.takeIf { fn == "duration" }
    "sleep_session" -> SleepSessionRecord.SLEEP_DURATION_TOTAL.takeIf { fn == "duration" }
    "hydration" -> HydrationRecord.VOLUME_TOTAL.takeIf { fn == "sum" }
    "heart_rate" -> when (fn) {
      "avg" -> HeartRateRecord.BPM_AVG
      "min" -> HeartRateRecord.BPM_MIN
      "max" -> HeartRateRecord.BPM_MAX
      "count" -> HeartRateRecord.MEASUREMENTS_COUNT
      else -> null
    }
    "resting_heart_rate" -> when (fn) {
      "avg" -> RestingHeartRateRecord.BPM_AVG
      "min" -> RestingHeartRateRecord.BPM_MIN
      "max" -> RestingHeartRateRecord.BPM_MAX
      else -> null
    }
    "weight" -> when (fn) {
      "avg" -> WeightRecord.WEIGHT_AVG
      "min" -> WeightRecord.WEIGHT_MIN
      "max" -> WeightRecord.WEIGHT_MAX
      else -> null
    }
    "height" -> when (fn) {
      "avg" -> HeightRecord.HEIGHT_AVG
      "min" -> HeightRecord.HEIGHT_MIN
      "max" -> HeightRecord.HEIGHT_MAX
      else -> null
    }
    "blood_pressure" -> when (field ?: "systolicMmHg") {
      "systolicMmHg" -> when (fn) {
        "avg" -> BloodPressureRecord.SYSTOLIC_AVG
        "min" -> BloodPressureRecord.SYSTOLIC_MIN
        "max" -> BloodPressureRecord.SYSTOLIC_MAX
        else -> null
      }
      "diastolicMmHg" -> when (fn) {
        "avg" -> BloodPressureRecord.DIASTOLIC_AVG
        "min" -> BloodPressureRecord.DIASTOLIC_MIN
        "max" -> BloodPressureRecord.DIASTOLIC_MAX
        else -> null
      }
      else -> null
    }
    "elevation_gained" -> ElevationGainedRecord.ELEVATION_GAINED_TOTAL.takeIf { fn == "sum" }
    "speed" -> when (fn) {
      "avg" -> SpeedRecord.SPEED_AVG
      "min" -> SpeedRecord.SPEED_MIN
      "max" -> SpeedRecord.SPEED_MAX
      else -> null
    }
    "power" -> when (fn) {
      "avg" -> PowerRecord.POWER_AVG
      "min" -> PowerRecord.POWER_MIN
      "max" -> PowerRecord.POWER_MAX
      else -> null
    }
    "cycling_cadence" -> when (fn) {
      "avg" -> CyclingPedalingCadenceRecord.RPM_AVG
      "min" -> CyclingPedalingCadenceRecord.RPM_MIN
      "max" -> CyclingPedalingCadenceRecord.RPM_MAX
      else -> null
    }
    "steps_cadence" -> when (fn) {
      "avg" -> StepsCadenceRecord.RATE_AVG
      "min" -> StepsCadenceRecord.RATE_MIN
      "max" -> StepsCadenceRecord.RATE_MAX
      else -> null
    }
    "nutrition" -> if (fn != "sum") null else when (field ?: "kilocalories") {
      "kilocalories" -> NutritionRecord.ENERGY_TOTAL
      "proteinGrams" -> NutritionRecord.PROTEIN_TOTAL
      "carbohydrateGrams" -> NutritionRecord.TOTAL_CARBOHYDRATE_TOTAL
      "fatGrams" -> NutritionRecord.TOTAL_FAT_TOTAL
      "fiberGrams" -> NutritionRecord.DIETARY_FIBER_TOTAL
      "sugarGrams" -> NutritionRecord.SUGAR_TOTAL
      "sodiumMilligrams" -> NutritionRecord.SODIUM_TOTAL
      else -> null
    }
    else -> null
  }

  @Suppress("UNCHECKED_CAST")
  private fun valueOf(result: AggregationResult, metric: AggregateMetric<*>): Double? {
    val value = result[metric as AggregateMetric<Any>] ?: return null
    return when (value) {
      is Long -> value.toDouble()
      is Double -> value
      is Length -> value.inMeters
      is Energy -> value.inKilocalories
      is Mass -> value.inKilograms
      is Volume -> value.inLiters
      is Pressure -> value.inMillimetersOfMercury
      is Duration -> value.seconds.toDouble()
      is Velocity -> value.inMetersPerSecond
      is Power -> value.inWatts
      else -> null
    }
  }

  private fun alignStart(start: Instant, bucket: String, zone: ZoneId): ZonedDateTime {
    val z = start.atZone(zone)
    return when (bucket) {
      "hour" -> z.truncatedTo(ChronoUnit.HOURS)
      "day" -> z.truncatedTo(ChronoUnit.DAYS)
      "week" -> z.truncatedTo(ChronoUnit.DAYS).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
      else -> z.truncatedTo(ChronoUnit.DAYS).withDayOfMonth(1)
    }
  }

  private fun next(start: ZonedDateTime, bucket: String): ZonedDateTime = when (bucket) {
    "hour" -> start.plusHours(1)
    "day" -> start.plusDays(1)
    "week" -> start.plusWeeks(1)
    else -> start.plusMonths(1)
  }

  /** Aligned buckets covering [start, end) — empty ones stay present with value null (SPEC §6.2). */
  fun buckets(start: Instant, end: Instant, bucket: String?, zone: ZoneId): List<Bucket> {
    if (bucket == null) return listOf(Bucket(start, end))
    val out = mutableListOf<Bucket>()
    var s = alignStart(start, bucket, zone)
    while (s.toInstant() < end) {
      val e = next(s, bucket)
      out += Bucket(s.toInstant(), e.toInstant())
      s = e
    }
    return out
  }

  suspend fun aggregate(client: HealthConnectClient, type: String, spec: TypeSpec, options: Map<String, Any?>, reader: Reader): List<Map<String, Any?>> {
    val start = Serialization.instant(options["start"])
    val end = Serialization.instant(options["end"])
    val fn = options["fn"] as? String ?: "sum"
    val field = options["field"] as? String
    val bucket = options["bucket"] as? String
    val zone = (options["zone"] as? String)?.let { ZoneId.of(it) } ?: ZoneId.systemDefault()
    val origins = (options["apps"] as? List<*>)?.map { DataOrigin(it.toString()) }?.toSet() ?: emptySet()
    val excludeManual = options["excludeManual"] as? Boolean ?: false
    val buckets = buckets(start, end, bucket, zone)
    val metric = metric(type, fn, field)

    // Period slicing resolves LocalDateTime in the device zone; other zones need the fallback path.
    val nativeOk = metric != null && !excludeManual && (bucket == null || bucket == "hour" || zone == ZoneId.systemDefault())
    if (nativeOk && metric != null) {
      val metrics: Set<AggregateMetric<*>> = setOf(metric)
      when (bucket) {
        null -> buckets[0].value = valueOf(client.aggregate(AggregateRequest(metrics, TimeRangeFilter.between(start, end), origins)), metric)
        "hour" -> {
          val results = client.aggregateGroupByDuration(
            AggregateGroupByDurationRequest(metrics, TimeRangeFilter.between(buckets.first().start, buckets.last().end), Duration.ofHours(1), origins),
          )
          for (r in results) buckets.find { it.start == r.startTime }?.value = valueOf(r.result, metric)
        }
        else -> {
          val period = when (bucket) {
            "day" -> Period.ofDays(1)
            "week" -> Period.ofWeeks(1)
            else -> Period.ofMonths(1)
          }
          val first = buckets.first().start.atZone(zone).toLocalDateTime()
          val last = buckets.last().end.atZone(zone).toLocalDateTime()
          val results = client.aggregateGroupByPeriod(AggregateGroupByPeriodRequest(metrics, TimeRangeFilter.between(first, last), period, origins))
          for (r in results) {
            val s = r.startTime.atZone(zone).toInstant()
            buckets.find { it.start == s }?.value = valueOf(r.result, metric)
          }
        }
      }
    } else {
      val records = reader.read(buckets.first().start, end, origins, excludeManual)
      val numericField = field ?: spec.primaryField
      for (b in buckets) {
        val inBucket = records.filter { r ->
          val s = Serialization.instant(r["start"])
          s >= b.start && s < b.end
        }
        if (inBucket.isEmpty()) continue
        b.value = when (fn) {
          "count" -> inBucket.size.toDouble()
          "duration" -> inBucket.sumOf { Duration.between(Serialization.instant(it["start"]), Serialization.instant(it["end"])).toMillis() } / 1000.0
          else -> {
            if (numericField == null) throw NotSupportedException("\"$type\" has no numeric field to aggregate")
            val nums = inBucket.mapNotNull { Serialization.numericField(it, numericField) }
            if (nums.isEmpty()) null else when (fn) {
              "sum" -> nums.sum()
              "avg" -> nums.average()
              "min" -> nums.min()
              "max" -> nums.max()
              else -> throw NotSupportedException("unknown aggregate \"$fn\"")
            }
          }
        }
      }
    }
    return buckets.map { mapOf("start" to it.start.toString(), "end" to it.end.toString(), "value" to it.value) }
  }
}
