# HealthSpec PRD (가칭)

> iOS HealthKit과 Android Health Connect를 하나의 스키마·권한 모델·API로 통합하는 **공개 스펙**과, 그 스펙의 **Expo/React Native 레퍼런스 SDK**.
> 한 줄 포지션: *OpenIAP가 결제에 한 일을 헬스 데이터에.*

| 항목 | 내용 |
|---|---|
| 상태 | Draft v0.1 |
| 작성일 | 2026-08-22 |
| 1차 타겟 | React Native + Expo (Expo Modules API, New Architecture 전용) |
| 아키텍처 | 스펙 우선 — JSON Schema 단일 원천 → TS/Swift/Kotlin/문서 코드젠 |
| 라이선스 | MIT (예정) |
| 작업명 | HealthSpec (가칭 — §15 네이밍 표 참조) |

---

## 1. 한 줄 요약

두 플랫폼의 헬스 데이터 스토어를 **하나의 타입 체계, 하나의 단위 체계, 하나의 권한 의미론, 하나의 동기화 모델**로 묶는 스펙을 만들고, 그 스펙을 구현하는 Expo 모듈을 출시한다. 스펙에는 처음부터 **Provider 슬롯**을 두어 삼성·폴라·가민 같은 벤더가 자기 기기를 1급 데이터 소스로 끼워 넣을 수 있게 한다. 지속가능성 모델은 개인 후원이 아니라 **"비기본 벤더에게 플랫폼 커버리지를 파는" 기업 스폰서십**이다.

---

## 2. 배경 — 왜 지금, 왜 이것인가

### 2.1 시장 증거: 체급은 IAP급인데 통합 제품이 없다

npm 주간 다운로드 (2026-08-15 ~ 08-21):

| 패키지 | 주간 다운로드 | 플랫폼 | 상태 |
|---|---:|---|---|
| `@kingstinct/react-native-healthkit` | 138,002 | iOS 전용 | 활발 (Nitro Modules, 707★, 이슈 20) |
| `react-native-health-connect` | 115,582 | Android 전용 | 유지 중 (414★, 이슈 47, Expo 플러그인 내장) |
| `react-native-health` | 44,954 | iOS 전용 | **기능 동결**, Obj-C→Swift 리라이트 중 (1.2k★, 이슈 122, PR 35 적체) |
| `react-native-google-fit` | 3,638 | Android (Google Fit) | 기반 API 2026년 말 종료 |
| `expo-health` | 399 | — | Expo 팀(tsapeta)이 2021년 예약한 0.0.0 플레이스홀더 |
| **RN 헬스 합계** | **≈ 302,600** | | |
| 비교: `expo-iap` + `react-native-iap` | ≈ 337,100 | | OpenIAP 생태계 |

RN 헬스 라이브러리 수요는 IAP와 같은 체급이다. 차이는 **iOS 전용 하나 + Android 전용 하나를 따로 설치하는 구조**라는 점이고, 크로스플랫폼 통합 제품은 RN 생태계에 **0개**다. (Flutter에는 `health` 패키지가 있다 — v13.3.2, 60+ 타입, 676 likes. 통합의 수요가 실재한다는 증거이자, 우리가 넘어야 할 기준선.)

### 2.2 개발자가 지금 겪는 것

1. **두 라이브러리, 두 API, 두 타입 체계.** 앱 코드에 `Platform.OS` 분기와 자체 정규화 레이어가 생긴다. 이 레이어를 모든 팀이 각자 다시 만든다.
2. **매핑 지식이 코드 주석에 흩어져 있다.** Flutter `health`의 문서에는 "on iOS this is CYCLING, but name changed here to fit with Android" 같은 주석이 있다. 매핑이 스펙이 아니라 구현 세부로 존재한다는 뜻이다.
3. **권한 모델이 근본적으로 다르다.** iOS는 읽기 권한 부여 여부를 *조회할 수 없고*(프라이버시 설계), Android는 조회 가능하며 백그라운드 읽기·30일 초과 히스토리가 **별도 런타임 권한**이다.
4. **기기 없이 개발이 불가능하다.** 시뮬레이터·Expo Go에서 동작하지 않고, 실기기에 실데이터가 있어야 한다. CI에서 테스트할 방법이 없다.
5. **스토어 설정 지옥.** iOS entitlement + 사용 설명 문자열, Android manifest 타입별 권한 선언 + 권한 근거(rationale) 액티비티 + Play Console 헬스 데이터 선언(승인 최대 7일 + 화이트리스트 전파 5–7 영업일). 틀리면 심사 단계에서 발견된다.
6. **가장 큰 iOS 라이브러리가 멈춰 있다.** `react-native-health`는 기능 동결 상태로 리라이트 중이며 이슈 122개가 적체되어 있다.

### 2.3 타이밍

- **Google Fit API 2026년 말 종료.** 2024-05-01부터 신규 가입 중단. `react-native-google-fit` 사용자는 지금 갈 곳이 필요하다.
- **Health Connect가 Android 14부터 프레임워크 내장.** "별도 설치" 마찰이 줄고 베이스라인이 안정됐다. 2025년 Jetpack SDK 베타에서 백그라운드 읽기·히스토리 읽기 권한이 추가됐다.
- **iOS 26**: `HKLiveWorkoutDataSource`가 iOS로 확장, Sleep Score 도입, 운동 존 API. 매년 바뀌는 API를 따라가는 비용이 곧 **스펙 + 코드젠**의 가치다.
- **Samsung Health SDK for Android 2025-07-31 폐기 → Samsung Health Data SDK로 이동.** 삼성이 개발자 생태계에 투자하는 시점이며, HC에 없는 타입(IHRN, 수면 무호흡)을 자체 SDK로만 제공한다. §11의 1순위 벤더 후보.
- **Expo가 헬스케어 버티컬을 상업적으로 공략 중.** expo.dev/solutions/expo-healthcare는 원격 모니터링·만성질환 관리·임상 연구·환자 포털을 사용 사례로 내세우지만, 1st-party 헬스 데이터 모듈은 없다(`expo-health`는 빈 예약 패키지). "PHI를 Expo 인프라 밖에 두라"는 그들의 아키텍처 논리는 우리 N4(온디바이스 전용)와 일치한다. 세일즈 대상이 P2와 정확히 겹침 — 유통 파트너 후보(§11)이자 자체 제작 리스크(§13).

---

## 3. 비전과 포지셔닝

### 3.1 비전

> 앱 개발자는 플랫폼을 모른 채 헬스 데이터를 읽고 쓴다. 기기 벤더는 스펙 하나를 구현해 모든 앱에 닿는다.

### 3.2 스펙과 구현의 분리 (OpenIAP 모델)

OpenIAP의 기여는 라이브러리가 아니라 **스펙**이었다. 스키마를 단일 원천으로 두고 언어별 타입을 생성하며, 구현체가 통과해야 할 conformance 테스트를 정의했다. 그 구조를 그대로 가져온다:

- `spec/` — 표준. JSON Schema + 플랫폼 매핑 메타데이터 + conformance 시나리오. **이게 제품이다.**
- `@healthspec/expo` — 레퍼런스 구현. Apple Health / Health Connect / Mock 세 provider.
- 향후 Flutter / KMP / 네이티브 구현은 같은 스펙과 conformance를 공유한다.

### 3.3 선행 표준과의 관계 — 새 표준을 만들지 않는다

이미 **IEEE 1752.1-2021**(Open mHealth: 메타데이터·수면·신체활동)과 **P1752.2**(심혈관·호흡)가 있고, HL7 **FHIR Observation / PGHD IG**가 있다. Health Connect의 Medical Records도 FHIR이다.

우리 스펙의 자리는 *의미론*이 아니라 *ergonomics와 플랫폼 매핑*이다:

- **의미론은 IEEE 1752 / Open mHealth에 정렬한다.** 타입 이름·단위·시간 모델을 가능한 한 그대로 따른다.
- Open mHealth 스키마는 교환용이라 장황하다. 우리는 **모바일 SDK가 쓰기 좋은 타입**을 정의하고, `toOpenMHealth()` / `toFHIRObservation()` 내보내기를 제공한다.
- 우리만의 기여는 **플랫폼 매핑 메타데이터**다: 각 타입이 HealthKit 어느 식별자·어느 단위, Health Connect 어느 레코드·어느 필드에 대응하는지를 스키마 안에 기계가 읽을 수 있게 기록한다.

한 줄로: **"IEEE 1752를 모바일 SDK에서 쓸 수 있게 만든 것."** 새 표준이라는 비판을 피하고, 벤더 제안 시 "업계 표준에 정렬된 스펙"이라는 명분이 생긴다.

### 3.4 생태계 지도 — 우리가 서는 자리

```
앱 (RN / Expo)
  │
  ▼
@healthspec/expo  ──────────  hooks · config plugin · doctor CLI
  │
  ▼
Provider 인터페이스 ═══════════ 스펙 (schema + conformance)
  │
  ├── Apple Health (HealthKit)          ┐
  ├── Health Connect                    │ 온디바이스 스토어 — v1 범위
  ├── Mock (순수 TS)                    ┘
  └── [벤더 슬롯] Samsung Health Data SDK · Polar BLE SDK · …   — v2+, 벤더 스폰서십 대상

(스펙만 공유, SDK 범위 밖)
  벤더 클라우드 API — Garmin Health API · Oura · WHOOP · Withings · Polar AccessLink (OAuth, 서버 필요)
  애그리게이터 — Terra · ROOK · Sahha · Thryve · Spike (상용) / Open Wearables (MIT, 셀프호스팅)
```

- **온디바이스 스토어**가 SDK의 v1 범위다. HealthKit과 Health Connect는 이미 여러 웨어러블이 데이터를 써 넣는 집계층이므로, 이 둘을 제대로 다루면 Garmin·Oura·WHOOP 데이터의 상당 부분이 *간접적으로* 들어온다.
- **벤더 클라우드 API**는 OAuth와 서버가 필요해 모바일 SDK 범위 밖이다. 스키마는 이들까지 표현할 수 있어야 한다(벤더 슬롯의 근거).
- **애그리게이터**는 경쟁자가 아니라 **스키마 채택 후보**다. 특히 Open Wearables(MIT, FastAPI, HealthKit/HC 모바일 SDK 포함)는 같은 철학의 서버 측 프로젝트로, 스키마를 공유하면 "기기 SDK ↔ 서버"가 한 타입으로 이어진다.

---

## 4. 목표 사용자

| 페르소나 | 지금의 고통 | 우리가 주는 것 |
|---|---|---|
| **P1. 인디·소규모 피트니스/웰니스 앱 (RN/Expo)** | 두 라이브러리 설치, `Platform.OS` 분기, 심사 설정 실패 | 한 번의 `install`, config plugin, `doctor`로 설정 검증, Expo Go에서 Mock으로 개발 |
| **P2. 디지털 헬스 스타트업 RN 팀** | 단위·출처(source)·중복 처리의 정확성, 증분 동기화, 백그라운드 수집 | 정준 단위·출처 보존·변경 커서가 스펙으로 보장, conformance 테스트로 검증 |
| **P3. 기기 벤더·애그리게이터** | 자기 데이터가 앱에 닿게 하려면 프레임워크마다 SDK를 따로 지원해야 함 | Provider 하나 구현 → 스펙을 쓰는 모든 앱에 도달 (스폰서 후보) |

---

## 5. 목표와 비목표

### Goals (v1)

- **G1.** 하나의 API로 iOS/Android 읽기·쓰기·집계·삭제.
- **G2.** 스펙이 단일 원천 — 타입, 단위, 플랫폼 매핑, 권한 의미론을 전부 스키마에서 생성.
- **G3.** 권한 모델의 *정직한* 통합 — `unknown`이 1급 상태.
- **G4.** 증분 동기화 1급 — HealthKit 앵커와 Health Connect 변경 토큰을 하나의 커서로.
- **G5.** 네이티브 설정 제로 — config plugin이 entitlement/usage string/manifest/rationale 전부 처리, `doctor` CLI가 검증.
- **G6.** 기기 없이 개발 — Mock provider가 Expo Go·시뮬레이터·CI에서 동작.
- **G7.** Provider 인터페이스 공개 — 벤더가 구현할 슬롯이 v1에 존재.
- **G8.** Conformance 테스트 공개 — 어느 provider든 같은 테스트를 통과해야 "호환"을 주장할 수 있음.

### Non-goals (v1)

- **N1.** 벤더 클라우드 API(OAuth) 통합 — 스키마만 정의.
- **N2.** ~~의료기록~~ → D12로 v1 편입 (`clinical_*` 타입).
- **N3.** 실시간 운동 세션(`HKLiveWorkout`, HC 라이브 ExerciseSession). ~~운동 경로~~ → D12로 v1 편입 (`readRoute`).
- **N4.** 서버·백엔드·데이터 저장 — 온디바이스만. 프라이버시 경계가 명확해야 벤더와 앱 양쪽이 쓴다.
- **N5.** Flutter / KMP 구현 — 스펙은 대비하되 구현은 후속 또는 커뮤니티.
- **N6.** 해석(점수·트렌드·추천) — 플랫폼처럼 *측정*만 전달한다.

---

## 6. 제품 범위

### 6.1 스펙 (`spec/`)

**형식.** JSON Schema 2020-12, 타입당 파일 하나. Open mHealth가 JSON Schema를 쓰므로 정렬이 자연스럽고, TS/Swift/Kotlin 코드젠 생태계가 가장 넓다.

**공통 레코드 봉투.**

```
HealthRecord {
  id: string                       // provider 고유 id
  type: HealthType                 // 'steps' | 'heart_rate' | …
  start: ISO-8601, end: ISO-8601   // 순간 측정은 start == end
  zoneOffset?: string              // 기록 당시 오프셋 (HC는 보존, HK는 메타데이터로)
  value: <타입별 스키마>            // 정준 단위로 정규화
  source: {
    app?: { bundleId | packageName, name? }
    device?: { manufacturer?, model?, type?: 'phone'|'watch'|'scale'|'chest_strap'|'unknown' }
    recordingMethod: 'manual' | 'automatic' | 'active' | 'unknown'
  }
  metadata?: Record<string, string>
}
```

**플랫폼 매핑 메타데이터.** 각 타입 스키마에 확장 필드로 기록한다. 이 필드가 곧 매핑표이며, 문서 사이트의 표는 여기서 생성된다.

```json
{
  "$id": "https://healthspec.dev/schema/heart_rate.json",
  "x-healthkit":      { "kind": "quantity", "identifier": "HKQuantityTypeIdentifierHeartRate", "unit": "count/min" },
  "x-healthconnect":  { "record": "HeartRateRecord", "field": "samples[].beatsPerMinute", "unit": "bpm", "series": true },
  "x-openmhealth":    { "schema": "omh:heart-rate:2.0" }
}
```

**권한 의미론.**

- `PermissionStatus = 'granted' | 'denied' | 'unknown'` — iOS 읽기 권한은 설계상 항상 `unknown`.
- 능력 플래그: `background`(HC: `READ_HEALTH_DATA_IN_BACKGROUND`, iOS: background delivery), `history`(HC: `READ_HEALTH_DATA_HISTORY`, iOS: 해당 없음 → 자동 `granted`).

**동기화 모델.** `Cursor`는 불투명 문자열. `changes(type, cursor)` → `{ upserts, deletes, cursor }`. 커서 만료(HC 토큰 30일)는 `CursorExpired` 에러로 구분되어 전체 재동기화 신호가 된다.

**Provider 인터페이스.**

```
Provider {
  id: string                                  // 'apple' | 'google' | 'mock' | 'samsung' …
  capabilities(): { types, write, background, history, changes, aggregate }
  availability(): 'available' | 'not_installed' | 'update_required' | 'not_supported'
  requestPermissions(req), getPermissions(types)
  read(type, query), aggregate(type, query), write(records), delete(ids | query)
  changes(type, cursor?), subscribe(types, handler)
}
```

**Conformance 시나리오(초안).** 단위 변환 왕복 무손실 · 시간대 경계(자정·DST) · 순간/구간 측정 구분 · `unknown` 권한 처리 · 커서 단조성과 만료 · 삭제 전파 · 출처 보존 · 시리즈(HC HeartRate) 평탄화 일관성 · 집계 중복 제거 의미론.

### 6.2 SDK — `@healthspec/expo`

**API 초안.**

```ts
import { HealthStore } from '@healthspec/expo';

// iOS → Apple Health, Android → Health Connect, Expo Go/테스트 → Mock
const store = HealthStore.default();

const perms = await store.requestPermissions({
  read: ['steps', 'heart_rate', 'sleep_session'],
  write: ['weight'],
  background: true,
  history: true,
});
perms.read.steps; // 'granted' | 'denied' | 'unknown'  (iOS는 항상 'unknown')

const steps = await store.read('steps', {
  start: new Date('2026-08-01'),
  end: new Date(),
  source: { excludeManual: true },
});
// steps[0] → { type: 'steps', start, end, value: { count: 1234 }, source: { device: { type: 'watch' } } }

const daily = await store.aggregate('steps', { start, end, bucket: 'day', fn: 'sum' });

await store.write([{ type: 'weight', start: now, end: now, value: { kilograms: 72.4 } }]);

const { upserts, deletes, cursor } = await store.changes('heart_rate', { cursor: saved });
const unsubscribe = store.subscribe(['heart_rate'], () => syncNow());
```

**Hooks.** `useHealthPermissions(req)`, `useHealthQuery(type, query)`, `useHealthChanges(type, cursor)`.

**Config plugin이 처리하는 것.**

| 플랫폼 | 항목 |
|---|---|
| iOS | HealthKit entitlement, `NSHealthShareUsageDescription` / `NSHealthUpdateUsageDescription`, background delivery 모드, (옵션) clinical records entitlement |
| Android | 요청 타입별 `android.permission.health.READ_*` / `WRITE_*` 선언, `READ_HEALTH_DATA_IN_BACKGROUND` / `READ_HEALTH_DATA_HISTORY`, `ACTION_SHOW_PERMISSIONS_RATIONALE` 인텐트 필터, Android 14 `ViewPermissionUsageActivity`, `com.google.android.apps.healthdata` 패키지 가시성, `minSdkVersion ≥ 26` 검증 |

플러그인 입력은 `app.json`의 타입 목록 하나다. 타입 목록 → 권한 선언이 스키마에서 생성되므로 누락이 구조적으로 불가능하다.

**Mock provider.** 순수 TS. 시드 기반 결정적 데이터 생성(수면 세션·심박 시리즈·걸음 일중 패턴), 권한 시나리오 시뮬레이션(거부·unknown·백그라운드 불가), 커서 만료 시뮬레이션. Expo Go·Jest·CI에서 동작.

### 6.3 툴링 — `@healthspec/cli`

- `healthspec doctor` — 빌드된 프로젝트의 entitlement·usage string·manifest 선언·rationale 액티비티·minSdk를 검사하고, Play Console 헬스 선언 체크리스트를 출력. *설정 실수는 심사에서가 아니라 터미널에서 발견돼야 한다.*
- `healthspec codegen` — `spec/` → `@healthspec/schema`(TS 타입 + 런타임 검증), Swift(struct/enum), Kotlin(data class/sealed), 문서 매핑표(Markdown).
- `healthspec mapping <type>` — 타입 하나의 양 플랫폼 매핑과 주의사항을 터미널에 출력.

### 6.4 문서 사이트

자동 생성 매핑표 · 플랫폼 차이 가이드(§8) · 심사 체크리스트(App Review 5.1.3, Play Console 헬스 선언) · 마이그레이션 가이드 3종(`@kingstinct/react-native-healthkit`, `react-native-health-connect`, `react-native-health`) · conformance 배지.

---

## 7. v1 데이터 타입 범위

기준: 양 플랫폼이 모두 지원하는 타입을 우선하되, 한쪽만 지원하는 타입도 `capabilities()`로 노출되면 포함한다(아래 ◐). 정준 단위는 SI 기반.

| 타입 ID | HealthKit | Health Connect | 정준 단위 | 비고 |
|---|---|---|---|---|
| `steps` | `stepCount` | `StepsRecord` | count | |
| `distance` | `distanceWalkingRunning` | `DistanceRecord` | m | HK는 활동별 분리(cycling 등 별도), HC는 단일 — 매핑 주의 |
| `active_energy` | `activeEnergyBurned` | `ActiveCaloriesBurnedRecord` | kcal | |
| `total_energy` | *(파생: active + basal)* | `TotalCaloriesBurnedRecord` | kcal | HK 측은 파생값임을 `source.recordingMethod`로 표기 |
| `floors_climbed` | `flightsClimbed` | `FloorsClimbedRecord` | count | |
| `wheelchair_pushes` | `pushCount` | `WheelchairPushesRecord` | count | |
| `exercise_session` | `HKWorkout` | `ExerciseSessionRecord` | — | 활동 유형 enum 매핑표(HK ≈ 80종, HC ≈ 60종) 별도 |
| `vo2_max` | `vo2Max` | `Vo2MaxRecord` | mL/kg/min | |
| `heart_rate` | `heartRate` | `HeartRateRecord` | bpm | HC는 시리즈(샘플 배열) → 샘플 단위로 평탄화 |
| `resting_heart_rate` | `restingHeartRate` | `RestingHeartRateRecord` | bpm | |
| `hrv_sdnn` ◐ | `heartRateVariabilitySDNN` | — | ms | **`hrv_rmssd`와 절대 매핑하지 않음** — 다른 지표 |
| `hrv_rmssd` ◐ | — | `HeartRateVariabilityRmssdRecord` | ms | 위와 동일 |
| `oxygen_saturation` | `oxygenSaturation` | `OxygenSaturationRecord` | % | |
| `respiratory_rate` | `respiratoryRate` | `RespiratoryRateRecord` | breaths/min | |
| `body_temperature` | `bodyTemperature` | `BodyTemperatureRecord` | °C | |
| `skin_temperature` ◐ | — | `SkinTemperatureRecord` | °C (delta) | HC는 기준선 대비 델타 |
| `blood_pressure` | correlation `bloodPressure` | `BloodPressureRecord` | mmHg | HK는 systolic/diastolic 두 샘플의 correlation |
| `blood_glucose` | `bloodGlucose` | `BloodGlucoseRecord` | mmol/L | mg/dL 변환 헬퍼 제공(×18.0182) |
| `weight` | `bodyMass` | `WeightRecord` | kg | |
| `height` | `height` | `HeightRecord` | m | |
| `body_fat` | `bodyFatPercentage` | `BodyFatRecord` | % | |
| `lean_body_mass` | `leanBodyMass` | `LeanBodyMassRecord` | kg | |
| `sleep_session` | `sleepAnalysis` (단계별 category 샘플) | `SleepSessionRecord` (세션 + 단계) | — | HK에는 세션 개념이 없음 → 연속 샘플을 세션으로 파생. 단계 매핑: core↔light, deep↔deep, rem↔rem, inBed→in_bed(별도 단계) |
| `hydration` | `dietaryWater` | `HydrationRecord` | L | |
| `nutrition` | `dietary*` (영양소별 개별 quantity) | `NutritionRecord` (단일 레코드, 다중 필드) | 영양소별 | 구조가 정반대. v1은 energy·protein·carbohydrate·fat·fiber·sugar·sodium |
| `mindfulness_session` | `mindfulSession` | `MindfulnessSessionRecord` | — | |

**v1.1** — 생리 주기 7종(`menstruation_flow`, `menstruation_period`, `ovulation_test`, `cervical_mucus`, `intermenstrual_bleeding`, `sexual_activity`, `basal_body_temperature`), 케이던스·속도·파워 계열, 체수분·골량, BMR.
**v2** — 운동 경로, 실시간 운동 세션, 의료기록(FHIR), 활동 강도(HC `ActivityIntensityRecord`), 계획된 운동 세션.

참고 규모: Health Connect는 공식 문서 기준 42개 레코드 타입(+ Medical Records), HealthKit은 quantity 100여 종·category 60여 종·correlation·workout·series·clinical. v1은 교집합 중심 26종으로 출발하고, 나머지는 스키마에 매핑 메타데이터만 먼저 채운 뒤 구현을 따라가게 한다.

---

## 8. 플랫폼 차이와 통합 설계 — 핵심 결정 5가지

### 8.1 권한 상태: `unknown`을 1급으로

iOS는 사용자가 읽기 권한을 거부했는지 알려주지 않는다(거부 사실 자체가 민감 정보라는 설계). 기존 라이브러리들은 이를 `denied`나 `granted`로 뭉개거나 문서에만 적어 둔다. 우리는 `unknown`을 타입에 넣고, `read()`가 빈 결과를 돌려줄 때 "데이터 없음"과 "권한 없음일 수 있음"을 구분하지 *못한다는* 사실을 API가 드러내게 한다. Android에서는 `getPermissions()`가 실제 상태를 돌려준다.

### 8.2 가용성: 설치·버전·지원 여부를 하나의 enum으로

Health Connect는 Android 13 이하에서 별도 앱(미설치 가능), 14부터 프레임워크 내장, SDK 26 미만 미지원, 구버전이면 업데이트 필요. iOS는 `isHealthDataAvailable`(iPad는 iPadOS 17부터). `store.availability()`가 `'available' | 'not_installed' | 'update_required' | 'not_supported'`를 돌려주고, `not_installed`/`update_required`에는 스토어로 보내는 `openInstaller()`를 붙인다.

### 8.3 히스토리와 백그라운드: capability 기반 요청

HC는 권한 최초 부여 시점 기준 30일 이전 데이터를 기본 차단하고, `READ_HEALTH_DATA_HISTORY`로 해제한다. 백그라운드 읽기는 `READ_HEALTH_DATA_IN_BACKGROUND`. iOS는 히스토리 제한이 없고 백그라운드는 background delivery + 앱 background modes로 구성된다. `requestPermissions({ history, background })`가 플랫폼별로 올바른 권한을 요청하고, 결과에 capability별 상태를 돌려준다.

### 8.4 동기화 커서: 앵커와 토큰을 하나로

HK `HKQueryAnchor`와 HC changes token은 둘 다 "마지막으로 본 지점"이지만 수명이 다르다(HC 토큰은 30일 만료). `Cursor`를 불투명 문자열로 통일하고, 만료는 `CursorExpired`로 구분해 앱이 전체 재동기화로 넘어가게 한다. 삭제 이벤트는 양쪽 모두 전달되므로 `deletes`를 1급으로 둔다.

### 8.5 출처와 중복: `read`는 raw, `aggregate`는 플랫폼 dedup

iPhone과 Watch가 같은 시간의 걸음을 각각 기록하면 단순 합산은 두 배가 된다. HK는 통계 쿼리에서 source 우선순위로, HC는 aggregate API에서 중복을 제거한다. 스펙은 `aggregate()`가 항상 플랫폼 dedup 결과를 돌려주고, `read()`는 raw 레코드를 `source`와 함께 돌려준다고 명시한다. "합계가 왜 다르냐"는 이슈의 절반은 이 문서 한 단락으로 막힌다.

---

## 9. 아키텍처

### 9.1 모노레포

```
healthspec/
  spec/
    schema/            # JSON Schema (타입당 1파일) + 매핑 메타데이터  ← 단일 원천
    conformance/       # provider 공통 테스트 시나리오
  packages/
    schema/            # 생성: TS 타입 + 런타임 검증기
    core/              # Provider 인터페이스, 단위 변환, 커서, Mock provider (순수 TS)
    expo/              # Expo 모듈: ios/(Swift, HealthKit) android/(Kotlin, connect-client) src/ plugin/
    cli/               # doctor · codegen · mapping
  tools/codegen/       # JSON Schema → TS / Swift / Kotlin / Markdown
  docs/                # 문서 사이트 (매핑표는 빌드 시 생성)
  example/             # Expo 예제 앱 (실기기 + Mock 양쪽 동작)
```

### 9.2 코드젠 파이프라인

```
spec/schema/*.json
   ├─► packages/schema/src/*.ts        (타입, enum, 단위, 검증기)
   ├─► packages/expo/ios/Generated/*.swift     (HKObjectType 매핑 테이블, 단위 테이블)
   ├─► packages/expo/android/…/Generated/*.kt  (Record 클래스 매핑, 권한 문자열)
   ├─► packages/expo/plugin/permissions.json   (타입 → 권한 선언)
   └─► docs/mapping/*.md                       (매핑표, 주의사항)
```

스키마를 바꾸면 네 언어와 문서가 같이 바뀐다. 플랫폼이 새 타입을 추가하면 JSON 파일 하나로 대응한다.

### 9.3 기술 선택

| 항목 | 선택 | 대안과 기각 사유 |
|---|---|---|
| 브릿지 | **Expo Modules API** | Nitro Modules(kingstinct 사용) — 성능 우위는 있으나 Expo-first 포지션, config plugin 통합, Expo Go Mock 경로에 Expo Modules가 자연스러움. 스펙이 브릿지 독립이므로 Nitro 구현체는 나중에 공존 가능 |
| 아키텍처 | New Architecture 전용 | 레거시 브릿지 지원은 유지 비용만 큼 |
| 지원 버전 | 최신 Expo SDK 2개 / 대응 RN 버전 | |
| iOS | Swift, StoreKit 아닌 HealthKit 직접 | Obj-C 배제 |
| Android | Kotlin, `androidx.health.connect:connect-client` | Google Fit 미지원(종료) |
| 스키마 | JSON Schema 2020-12 | GraphQL SDL(OpenIAP 방식) — 제약·단위 표현 불가, Swift/Kotlin 코드젠은 어차피 자작. TypeSpec — 저작 레이어로 후일 검토 |
| 테스트 | Jest(Mock) + conformance 러너 + 예제앱 실기기 수동 체크리스트 | E2E(Maestro)는 v1 이후 |

---

## 10. 성공 지표

| 시점 (v1.0 기준) | 채택 | 품질 | 생태계 |
|---|---|---|---|
| +3개월 | 주간 5,000 DL, 공개 앱 10개 | conformance 100% (Apple/Google/Mock), 이슈 중앙 응답 48h | 마이그레이션 가이드 3종 게시 |
| +6개월 | 주간 25,000 DL | 심사 설정 관련 이슈 비율 < 10% | 외부 provider 구현 1개, 첫 벤더 대화 |
| +12개월 | 주간 100,000 DL (현 분절 시장의 1/3) | 플랫폼 연례 업데이트를 2주 내 반영 | 벤더 스폰서 1곳, Flutter 또는 KMP 구현 착수 |

선행 지표(매주 확인): 예제앱 클론 수, `doctor` 실행 수(옵트인 텔레메트리 없이는 추정), 마이그레이션 가이드 페이지뷰, Discussions의 "Who is using" 스레드.

---

## 11. 지속가능성 — 스폰서십 전략

### 11.1 근거 데이터

OpenIAP/expo-iap은 주간 33만 다운로드에도 **개인 후원은 6년 누적 $3,153(최근 연 $90)** 에 그쳤고, 그중 절반은 메인테이너 본인 회사 기여다. 실제 후원은 **Meta(Horizon Store)와 Amazon(Appstore)** — 둘 다 라이브러리를 *쓰는* 회사가 아니라, 자기 스토어가 *지원되기를 원하는* 벤더다. Apple과 Google은 기본값이라 후원할 이유가 없다.

> 후원은 1등이 아니라 **기본값이 아닌 벤더**가 낸다. 그들에게 파는 것은 코드가 아니라 **도달 범위**다.

### 11.2 후보 벤더

| 벤더 | 통합 형태 | 후원 동기 | 우선순위 |
|---|---|---|---|
| **Samsung** | Samsung Health Data SDK (온디바이스, Android). HC에 없는 타입(IHRN, 수면 무호흡) 보유 | Galaxy Watch 데이터를 RN 앱에 1급으로. 구 SDK 폐기 후 전환기라 DevRel 투자 활발 | **1** |
| **Polar** | Polar BLE SDK (오픈소스, 기기 직접 연결) | 기기 판매. 오픈소스 친화적 | 2 |
| **Garmin** | Health API(클라우드) / Enterprise Health SDK(라이선스 필요) | 생태계 커버리지 | 3 — SDK 라이선스가 장벽 |
| Withings · Oura · WHOOP | 클라우드 API | 스키마 채택 → 서버 측 파트너 경유 | 4 |
| Expo | 플랫폼 (RN 프레임워크·EAS) — 헬스케어 버티컬 세일즈 중 | 고객에게 줄 헬스 데이터 모듈이 없음. 공식 가이드 등재·공동 마케팅 (IAP 가이드가 expo-iap을 안내하는 방식) | 유통 파트너 — 자금보다 도달 범위 |
| Open Wearables | 서버 (MIT) | 상호 스키마 채택 | 파트너 |

### 11.3 실행 순서

1. **v1 완성 + 채택 확보** — 이 단계에 스폰서는 없다. 주간 2–3만 DL이 제안의 전제 조건.
2. **Provider 슬롯을 v1 코드에 실재시킨다** — Mock이 세 번째 구현체로서 인터페이스를 검증한다. "끼워 넣을 자리"가 문서가 아니라 코드로 존재해야 제안이 구체적이다.
3. **벤더 Developer Relations / Partner Engineering에 접촉** — 마케팅이 아니다. 제안 형태: *"귀사 기기를 스펙의 1급 provider로. 통합·유지보수·conformance 비용을 지원해 달라."* 인보이스 가능한 채널(Open Collective 또는 법인)을 준비한다.
4. **Open core는 후순위 옵션** — 호스팅 conformance 대시보드, 우선 지원 계약. v1 범위 밖.

개인 후원(GitHub Sponsors / Open Collective)은 열어 두되 **지표로 삼지 않는다.**

---

## 12. 로드맵 (1인 기준 추정)

| 단계 | 기간 | 산출물 | 완료 기준 |
|---|---|---|---|
| **Phase 0 — 스펙 v0** | 1–2주 | 봉투 스키마, v1 26타입 JSON Schema + 매핑 메타데이터, 권한·커서 의미론 문서, 코드젠 스켈레톤(TS만) | `codegen`이 TS 타입과 매핑표 MD를 생성 |
| **Phase 1 — SDK 코어** | 3–8주 | Expo 모듈 iOS/Android: 권한·가용성·read·aggregate·write·delete, config plugin, Mock provider, 예제앱 | 예제앱이 실기기 양 플랫폼 + Expo Go(Mock)에서 동일 화면 |
| **Phase 2 — 동기화·툴링·출시** | 9–12주 | `changes`/`subscribe`, 백그라운드, `doctor` CLI, conformance 러너 공개, 문서 사이트, 마이그레이션 가이드 3종 | **v1.0 태그**, conformance Apple/Google/Mock 통과 |
| **Phase 3 — 생태계** | 채택 지표 달성 후 | Samsung provider(벤더 협의 병행), FHIR/OmH 내보내기, v1.1 타입, Flutter/KMP 스펙 대응 | 외부 provider 1개, 벤더 대화 1건 |

첫 주의 일은 Phase 0의 **매핑표**다. 코드보다 먼저 공개해도 되는 유일한 산출물이며, 그 자체로 커뮤니티 기여가 된다.

---

## 13. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| **kingstinct가 크로스플랫폼으로 확장** — 가장 강한 현역, Nitro 스택 보유 | 바인딩 경쟁에서 불리 | 우리 해자는 바인딩이 아니라 **스펙·conformance·provider 슬롯**. 스펙을 먼저 공개해 그들조차 채택하게 만드는 것이 최선 |
| **Expo가 1st-party 헬스 모듈을 만듦** — 헬스케어 버티컬 세일즈 중, `expo-health` 이름 예약 | 공식 모듈로 채택이 쏠림 | 스펙 선공개로 공식 모듈이 생겨도 스펙을 채택하게 함. Expo 헬스 가이드 등재를 목표로 관계 선점 |
| 패키지명 — `expo-health`는 Expo 예약, `react-native-health`는 사용 중 | 발견성 | 스코프 `@healthspec/*`로 통일. Expo 팀에 `expo-health` 양도 문의는 미결(§15) |
| 스토어 심사 — App Review 5.1.3(헬스 데이터 광고 사용 금지 등), Play Console 헬스 선언 | 사용자 앱 반려 → 라이브러리 탓 | 심사 체크리스트를 문서 1급으로, `doctor`가 선언 누락 검출 |
| 1인 버스 팩터 | 유지보수 중단 | 스펙·코드젠이 기여 장벽을 낮춤. 타입 추가 = JSON 1파일 |
| 플랫폼 연례 변경(iOS 매년, HC Jetpack 베타) | 깨짐 | 코드젠으로 변경 비용 최소화, 예제앱이 회귀 테스트 |
| 규제(HIPAA/GDPR) 오해 | 도입 주저 | 온디바이스 전용·서버 없음을 README 첫 줄에. 데이터가 라이브러리를 떠나지 않음 |
| 상표 — "HealthKit", "Health Connect" 명칭 | 법적 | 설명적(nominative) 사용만, 제품명에 포함 금지 |
| 벤더가 응답하지 않음 | 수익 0 | 라이브러리 자체는 벤더 없이도 성립. 스폰서는 결과지 전제가 아님 |

---

## 14. 결정 기록

| # | 결정 | 근거 |
|---|---|---|
| D1 | 1차 타겟 RN + Expo | 가장 빠른 채택 속도, 벤더에게 보여줄 지표 확보 (사용자 결정, 2026-08-22) |
| D2 | 스펙 우선, 처음부터 | 벤더 슬롯·멀티플랫폼 확장이 공짜, "표준" 포지션이 스폰서 명분 (사용자 결정) |
| D3 | JSON Schema 2020-12 | Open mHealth 정렬, 코드젠 생태계, 제약·단위 표현 가능 |
| D4 | Expo Modules API, New Architecture 전용 | Expo-first, config plugin·Expo Go Mock 경로 통합 |
| D5 | 새 표준을 만들지 않음 — IEEE 1752/OmH 정렬, FHIR 내보내기 | 신뢰·명분, "yet another standard" 비판 회피 |
| D6 | 권한 상태에 `unknown` 1급 | iOS 설계를 존중하고 거짓 확신을 API에서 제거 |
| D7 | Provider 인터페이스 v1 포함, Mock이 3번째 구현체 | 벤더 슬롯을 코드로 실재시키고 기기 없는 개발 가능 |
| D8 | v1은 온디바이스 스토어만, 클라우드 벤더는 스키마만 | 서버 없음 = 프라이버시 경계 명확, 범위 통제 |
| D9 | MIT | 벤더·기업 채택 장벽 최소 |
| D10 | 스코프 패키지 `@healthspec/*` | 이름 선점 회피, 패키지 패밀리 일관성 |
| D11 | 처음부터 자체 네이티브 모듈 — 기존 라이브러리 래핑 안 함 | `@kingstinct/react-native-healthkit`·`react-native-health-connect`가 앵커/변경 토큰·집계·백그라운드 등 필요한 프리미티브를 전부 노출해 래핑도 가능했으나 기각. 의존성 1개·config plugin 1개·브릿지 1종, 코드젠이 네이티브 매핑 테이블까지 생성, 벤더 provider용 네이티브 인프라 확보. 대가는 첫 동작까지 6–8주 (사용자 결정, 2026-08-23) |
| D12 | **공통 기능뿐 아니라 플랫폼 특수 기능도 전부 제공** — 기준은 kingstinct · react-native-health · react-native-health-connect의 합집합 | 기존 라이브러리 사용자가 기능 손실 없이 이동할 수 있어야 채택이 일어남. 구조는 유지: 단일 플랫폼 타입(◐)으로 스키마에 추가, 레코드가 아닌 데이터(신체 특성)는 `getProfile()`, 세션별 동의가 필요한 경로는 `readRoute()`, 임상 기록은 `clinical_*` 타입으로 HK↔HC 매핑 (사용자 결정, 2026-08-23) |

---

## 15. 미결 사항

### 15.1 네이밍 (2026-08-22 확인)

| 후보 | npm | npm 스코프 | GitHub 조직 | 충돌 |
|---|---|---|---|---|
| **HealthSpec** | 비어 있음 | 비어 있음 | **비어 있음** | 상표 미확인 |
| OpenVitals | 비어 있음 | 비어 있음 | 선점(조직, 공개 저장소 0 — 휴면) | 상표 미확인. "vitals"가 활동·수면·영양보다 좁음 |
| OpenHealthData | 비어 있음 | 비어 있음 | 선점(CCR-Validator, 휴면) | — |
| OpenHealth | 비어 있음 | 미확인 | 선점(개인) | 프랑스 OpenHealth Company(상표 9건), OpenHealthForAll/open-health(활성), openhealth.org — **탈락** |

가칭은 **HealthSpec**. DNS 확인(2026-08-22): `healthspec.dev`·`healthspec.io`는 A 레코드 없음(미등록 가능성 높음), `openvitals.dev`는 이미 사용 중. 상표는 미확인.

### 15.2 기타

- 거버넌스: 개인 저장소 vs 조직. CLA 여부.
- Expo 팀에 `expo-health` 패키지명 양도 문의 여부.
- Flutter / KMP 구현 시점과 주체.
- 의료기록(FHIR) 범위를 v2에 넣을지, 영구 비목표로 둘지.
- 예제앱의 실기기 테스트 매트릭스(iPhone + Watch, Pixel + Galaxy Watch).

---

## 부록 A. 경쟁 현황 상세

- **`@kingstinct/react-native-healthkit`** — iOS 전용, Nitro Modules로 v9에서 재작성, 707★, 이슈 20, 회사(Kingstinct)가 엔터프라이즈 지원 판매. 가장 강한 현역.
- **`react-native-health-connect`** — Android 전용, 414★, 이슈 47, v4부터 Expo 플러그인 내장, 구/신 아키텍처 모두 지원. README가 Play Console 선언 절차(승인 7일 + 화이트리스트 5–7 영업일)를 명시.
- **`react-native-health`** (AE Studio) — iOS 전용, 1.2k★, 이슈 122·PR 35 적체, 기능 동결 + Obj-C→Swift 리라이트. README가 Android는 `react-native-health-connect`로 가라고 안내.
- **`react-native-google-fit`** — 기반 API 2026년 말 종료.
- **Flutter `health`** (carp.dk, DTU) — v13.3.2, 60+ 타입, 676 likes, 160 pub points. 유일한 크로스플랫폼 통합 구현. 매핑이 코드·주석 수준에 존재.

## 부록 B. 출처

- npm 다운로드: `api.npmjs.org/downloads/point/last-week/*` (2026-08-15 ~ 08-21)
- OpenIAP 재정: opencollective.com/openiap · github.com/sponsors/hyochan · github.com/sponsors/hyodotdev · hyodotdev/openiap README
- RevenueCat 가격: revenuecat.com/pricing (MTR $2,500 초과분의 1%)
- Health Connect 데이터 타입·권한: developer.android.com/health-and-fitness/health-connect/{data-types, read-data}
- Google Fit 종료: spikeapi.com, mindbowser.com, fitmesh.fit 마이그레이션 가이드
- HealthKit iOS 26: sahha.ai WWDC 2026 정리, developer.apple.com/documentation/healthkit
- Samsung Health Data SDK: developer.samsung.com/health (2025-10 Dev Insight, Health Connect 연동 블로그)
- 벤더·애그리게이터: tryterra.co, tryrook.io, sahha.ai, thryve.health, openwearables.io
- 표준: openmhealth.org, IEEE 1752.1-2021, HL7 PGHD IG, OmH-to-FHIR IG
