package dev.healthspec

import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.metadata.Device
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.units.Mass
import dev.healthspec.generated.HealthSpecTypes
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.doubleOrNull
import kotlinx.serialization.json.longOrNull
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import java.io.File
import java.time.Duration
import java.time.Instant
import java.time.ZoneId

/**
 * Serialization against the specification itself: every type Health Connect can write must survive
 * spec value → Record → spec value using the example its JSON Schema declares.
 */
class SerializationTest {
  private val types = File("../../spec/schema/types")

  /** Interval types whose Health Connect record is instantaneous. */
  private val INSTANT_ON_HEALTH_CONNECT = setOf("menstruation_flow")

  private fun plain(e: JsonElement): Any? = when (e) {
    is JsonNull -> null
    is JsonObject -> e.mapValues { plain(it.value) }
    is JsonArray -> e.map { plain(it) }
    is JsonPrimitive -> if (e.isString) e.content else e.booleanOrNull ?: e.longOrNull ?: e.doubleOrNull
  }

  @Suppress("UNCHECKED_CAST")
  private fun schema(type: String): Map<String, Any?> =
    plain(Json.parseToJsonElement(File(types, "$type.json").readText())) as Map<String, Any?>

  private fun assertSameValue(type: String, path: String, expected: Any?, actual: Any?) {
    when (expected) {
      is Number -> {
        if (actual !is Number) fail("$type.$path: expected $expected, got $actual")
        assertEquals("$type.$path", expected.toDouble(), (actual as Number).toDouble(), 1e-6)
      }
      is Map<*, *> -> expected.forEach { (k, v) -> assertSameValue(type, "$path.$k", v, (actual as? Map<*, *>)?.get(k)) }
      is List<*> -> {
        val list = actual as? List<*> ?: return fail("$type.$path: expected a list, got $actual")
        assertEquals("$type.$path length", expected.size, list.size)
        expected.forEachIndexed { i, v -> assertSameValue(type, "$path[$i]", v, list[i]) }
      }
      else -> assertEquals("$type.$path", expected, actual)
    }
  }

  @Test
  @Suppress("UNCHECKED_CAST")
  fun everyWritableTypeRoundTripsItsSpecExample() {
    val start = "2026-08-21T14:00:00Z"
    var checked = 0
    for ((type, spec) in HealthSpecTypes.byId) {
      if (!spec.write) continue
      val json = schema(type)
      val x = json["x-healthspec"] as Map<String, Any?>
      val properties = json["properties"] as Map<String, Map<String, Any?>>
      val sample = x["kind"] == "sample"
      val end = if (sample) start else "2026-08-21T17:00:00Z"
      for (example in json["examples"] as List<Map<String, Any?>>) {
        val input = mapOf("start" to start, "end" to end, "value" to example, "recordingMethod" to "manual")
        val out = Serialization.toJson(Serialization.fromJson(type, input))
        assertEquals("$type flattens to one record", 1, out.size)
        val record = out[0]
        assertEquals("$type.start", Instant.parse(start), Instant.parse(record["start"] as String))
        // Instantaneous records keep only their start, even for an interval type (see the type's notes).
        val storedEnd = if (type in INSTANT_ON_HEALTH_CONNECT) start else end
        assertEquals("$type.end", Instant.parse(storedEnd), Instant.parse(record["end"] as String))
        // Fields only HealthKit persists are absent on Health Connect by design (SPEC §2.1).
        val expected = example.filterKeys { properties[it]?.get("x-platform") != "healthkit" }
        assertSameValue(type, "value", expected, record["value"])
        checked++
      }
    }
    assertTrue("sanity: examples were found", checked >= 38)
  }

  @Test
  fun seriesSamplesAreClippedOrderedAndKeepTheirIndex() {
    val t0 = Instant.parse("2026-08-21T10:00:00Z")
    val record = HeartRateRecord(
      startTime = t0,
      startZoneOffset = null,
      endTime = t0.plusSeconds(300),
      endZoneOffset = null,
      samples = (0 until 5).map { HeartRateRecord.Sample(t0.plusSeconds(it * 60L), 60L + it) },
      metadata = Metadata.manualEntry(),
    )
    val window = Serialization.Window(t0.plusSeconds(60), t0.plusSeconds(240))
    val asc = Serialization.toJson(record, window)
    assertEquals(listOf("#1", "#2", "#3"), asc.map { it["id"] })
    assertEquals(listOf("#3", "#2", "#1"), Serialization.toJson(record, window, ascending = false).map { it["id"] })
    for (r in asc) assertEquals(r["start"], r["end"])

    val remaining = Serialization.withoutSamples(record, setOf(0, 2)) as HeartRateRecord
    assertEquals(listOf(61L, 63L, 64L), remaining.samples.map { it.beatsPerMinute })
    assertNull(Serialization.withoutSamples(record, (0 until 5).toSet()))
  }

  @Test
  fun seriesIdsParse() {
    assertEquals("abc" to 3, Serialization.parseSeriesId("abc#3"))
    assertEquals("abc" to null, Serialization.parseSeriesId("abc"))
    assertEquals("a#b" to null, Serialization.parseSeriesId("a#b"))
  }

  @Test
  fun writtenSeriesSamplesSpanANonEmptyInterval() {
    val input = mapOf("start" to "2026-08-21T10:00:00Z", "end" to "2026-08-21T10:00:00Z", "value" to mapOf("deltaCelsius" to 0.4))
    val out = Serialization.toJson(Serialization.fromJson("skin_temperature", input))
    assertEquals("2026-08-21T10:00:00Z", out[0]["start"])
    assertEquals("2026-08-21T10:00:00Z", out[0]["end"])
  }

  @Test
  @Suppress("UNCHECKED_CAST")
  fun sourceAndClientRecordIdSurviveAWrite() {
    val input = mapOf(
      "start" to "2026-08-21T10:00:00Z",
      "end" to "2026-08-21T10:00:00Z",
      "value" to mapOf("kilograms" to 72.4),
      "recordingMethod" to "automatic",
      "device" to mapOf("type" to "scale", "manufacturer" to "Acme", "model" to "S1"),
      "metadata" to mapOf(Serialization.CLIENT_RECORD_ID to "weight-1", Serialization.CLIENT_RECORD_VERSION to "7"),
    )
    val record = Serialization.fromJson("weight", input)
    assertEquals(Device.TYPE_SCALE, record.metadata.device?.type)
    val out = Serialization.toJson(record)[0]
    val source = out["source"] as Map<String, Any?>
    assertEquals("automatic", source["recordingMethod"])
    assertEquals(mapOf("manufacturer" to "Acme", "model" to "S1", "type" to "scale"), source["device"])
    val metadata = out["metadata"] as Map<String, String>
    assertEquals("weight-1", metadata[Serialization.CLIENT_RECORD_ID])
    assertEquals("7", metadata[Serialization.CLIENT_RECORD_VERSION])
  }

  @Test
  fun aggregateValuesUseTheFieldsCanonicalUnit() {
    assertEquals(72.0, Aggregation.canonical(Mass.kilograms(72.0), "kilograms")!!, 1e-9)
    assertEquals(32.0, Aggregation.canonical(Mass.grams(32.0), "proteinGrams")!!, 1e-9)
    assertEquals(900.0, Aggregation.canonical(Mass.milligrams(900.0), "sodiumMilligrams")!!, 1e-9)
    assertEquals(15.0, Aggregation.canonical(Mass.micrograms(15.0), "vitaminDMicrograms")!!, 1e-9)
    assertEquals(90.5, Aggregation.canonical(Duration.ofMillis(90_500), null)!!, 1e-9)
  }

  @Test
  fun bucketsAlignInTheQueryZone() {
    val zone = ZoneId.of("America/New_York")
    // 2026-03-08 is the spring-forward day in New York: that day bucket lasts 23 hours.
    val days = Aggregation.buckets(Instant.parse("2026-03-07T12:00:00Z"), Instant.parse("2026-03-09T12:00:00Z"), "day", zone)
    assertEquals(3, days.size)
    assertEquals(Duration.ofHours(23), Duration.between(days[1].start, days[1].end))
    val weeks = Aggregation.buckets(Instant.parse("2026-08-20T12:00:00Z"), Instant.parse("2026-08-21T12:00:00Z"), "week", ZoneId.of("Asia/Seoul"))
    assertEquals(Instant.parse("2026-08-16T15:00:00Z"), weeks[0].start) // Monday 17 Aug, 00:00 KST
  }

  @Test
  fun fhirVersionsUseReleaseNames() {
    assertEquals("R4", Serialization.fhirRelease(4, 0, 1))
    assertEquals("R4B", Serialization.fhirRelease(4, 3, 0))
    assertEquals("3.0.2", Serialization.fhirRelease(3, 0, 2))
  }
}
