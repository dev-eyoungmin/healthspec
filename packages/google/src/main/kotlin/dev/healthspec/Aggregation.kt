package dev.healthspec

import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.aggregate.AggregateMetric
import androidx.health.connect.client.aggregate.AggregationResult
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.CyclingPedalingCadenceRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ElevationGainedRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.FloorsClimbedRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeightRecord
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.PowerRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.records.StepsCadenceRecord
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
 * SPEC §6 on Health Connect.
 *
 * Buckets are aligned to calendar boundaries in the query zone (§6.2), but a bucket's value only covers the part
 * of it inside [start, end). Where Health Connect has a native AggregateMetric the platform de-duplicates across
 * sources (§6.3); otherwise records are read and reduced here, mirroring @healthspec/core's aggregateRecords,
 * and no de-duplication is possible.
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

  /**
   * A native aggregate value in the canonical unit of [field]. Mass is the one unit whose canonical form depends on
   * the field — body mass is in kilograms, nutrients in grams, milligrams or micrograms — so the field name decides.
   */
  fun canonical(value: Any, field: String?): Double? = when (value) {
    is Long -> value.toDouble()
    is Double -> value
    is Length -> value.inMeters
    is Energy -> value.inKilocalories
    is Mass -> when {
      field == null || field == "kilograms" -> value.inKilograms
      field.endsWith("Micrograms") -> value.inMicrograms
      field.endsWith("Milligrams") -> value.inMilligrams
      field.endsWith("Grams") -> value.inGrams
      else -> value.inKilograms
    }
    is Volume -> value.inLiters
    is Pressure -> value.inMillimetersOfMercury
    is Duration -> value.toMillis() / 1000.0
    is Velocity -> value.inMetersPerSecond
    is Power -> value.inWatts
    else -> null
  }

  @Suppress("UNCHECKED_CAST")
  private fun valueOf(result: AggregationResult, metric: AggregateMetric<*>, field: String?): Double? {
    val value = result[metric as AggregateMetric<Any>] ?: return null
    return canonical(value, field)
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

  private fun maxOf(a: Instant, b: Instant) = if (a.isAfter(b)) a else b
  private fun minOf(a: Instant, b: Instant) = if (a.isBefore(b)) a else b

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
    val numericField = field ?: spec.primaryField

    // Health Connect aggregates cannot filter by recording method, so excludeManual needs the record path.
    if (metric != null && !excludeManual) {
      nativeAggregate(client, metric, numericField, buckets, start, end, bucket, zone, origins)
    } else {
      reduceRecords(type, fn, numericField, buckets, reader.read(start, end, origins, excludeManual), start, end)
    }
    return buckets.map { mapOf("start" to it.start.toString(), "end" to it.end.toString(), "value" to it.value) }
  }

  private suspend fun nativeAggregate(
    client: HealthConnectClient,
    metric: AggregateMetric<*>,
    field: String?,
    buckets: List<Bucket>,
    start: Instant,
    end: Instant,
    bucket: String?,
    zone: ZoneId,
    origins: Set<DataOrigin>,
  ) {
    val metrics: Set<AggregateMetric<*>> = setOf(metric)
    suspend fun single(from: Instant, to: Instant): Double? =
      valueOf(client.aggregate(AggregateRequest(metrics, TimeRangeFilter.between(from, to), origins)), metric, field)

    // Buckets that lie wholly inside [start, end) can be sliced by the platform in one call; the first and last
    // bucket usually straddle the range and are aggregated over their clipped part instead.
    val full = buckets.filter { !it.start.isBefore(start) && !it.end.isAfter(end) }
    val periodSlicing = bucket == "day" || bucket == "week" || bucket == "month"
    // Period slicing resolves LocalDateTime in the device zone; any other zone is sliced bucket by bucket.
    val sliceNatively = bucket != null && full.size > 1 && (bucket == "hour" || zone == ZoneId.systemDefault())

    if (sliceNatively) {
      val first = full.first().start
      val last = full.last().end
      if (bucket == "hour") {
        val results = client.aggregateGroupByDuration(AggregateGroupByDurationRequest(metrics, TimeRangeFilter.between(first, last), Duration.ofHours(1), origins))
        for (r in results) full.find { it.start == r.startTime }?.value = valueOf(r.result, metric, field)
      } else if (periodSlicing) {
        val period = when (bucket) {
          "day" -> Period.ofDays(1)
          "week" -> Period.ofWeeks(1)
          else -> Period.ofMonths(1)
        }
        val from = first.atZone(zone).toLocalDateTime()
        val to = last.atZone(zone).toLocalDateTime()
        val results = client.aggregateGroupByPeriod(AggregateGroupByPeriodRequest(metrics, TimeRangeFilter.between(from, to), period, origins))
        for (r in results) {
          val s = r.startTime.atZone(zone).toInstant()
          full.find { it.start == s }?.value = valueOf(r.result, metric, field)
        }
      }
    }
    for (b in buckets) {
      if (sliceNatively && b in full) continue
      val from = maxOf(b.start, start)
      val to = minOf(b.end, end)
      if (from.isBefore(to)) b.value = single(from, to)
    }
  }

  private fun reduceRecords(type: String, fn: String, field: String?, buckets: List<Bucket>, records: List<Map<String, Any?>>, start: Instant, end: Instant) {
    for (b in buckets) {
      val from = maxOf(b.start, start)
      val to = minOf(b.end, end)
      val inBucket = records.filter { r ->
        val s = Serialization.instant(r["start"])
        !s.isBefore(from) && s.isBefore(to)
      }
      if (inBucket.isEmpty()) continue
      b.value = when (fn) {
        "count" -> inBucket.size.toDouble()
        "duration" -> inBucket.sumOf { Duration.between(Serialization.instant(it["start"]), Serialization.instant(it["end"])).toMillis() } / 1000.0
        else -> {
          if (field == null) throw NotSupportedException("\"$type\" has no numeric field to aggregate")
          val nums = inBucket.mapNotNull { Serialization.numericField(it, field) }
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
}
