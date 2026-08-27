# 기존 라이브러리 대비 기능 검토 (2026-08-23)

비교 대상은 실제 소스 기준이다 — `@kingstinct/react-native-healthkit` v9(Nitro), `react-native-health` v1.x(AE Studio), `react-native-health-connect` v4 — 각 저장소 main/master 브랜치를 받아 export·타입·네이티브 파일을 추출해 대조했다.

## 1. 결론 요약

- **핵심 동작(권한·읽기·쓰기·삭제·집계·증분 동기화·구독)은 동일하게 제공하고, 플랫폼 간에 통합되어 있다.** 세 라이브러리 중 어느 것도 두 플랫폼을 하나의 API로 제공하지 않는다.
- **타입 커버리지는 우리가 좁다.** iOS: kingstinct는 HK quantity 120종·category 44종 전부를 일반 API로 노출하고, 우리는 22종. Android: react-native-health-connect는 HC 레코드 40종, 우리는 25종. 이것이 마이그레이션 시 가장 먼저 부딪힐 차이다.
- **HealthKit 특수 기능(ECG·심박 시리즈·운동 경로·신체 특성·State of Mind·임상 기록·활동 요약·복약)은 의도적으로 v1 범위 밖**이며 kingstinct/react-native-health에는 있다.
- **편의 API 몇 개가 빠져 있다** — id 단건 조회, 설정 화면 열기, 권한 철회(Android), 열린 시간 범위, 소스별 통계. 작게 추가 가능.
- 우리만 제공하는 것: 단일 크로스플랫폼 API, Expo Go/CI용 Mock provider, 스펙 기반 쓰기 검증, `unknown` 권한 상태, 만료 의미론이 있는 통합 커서, 스펙에서 생성되는 config plugin, 정규화된 에러 코드.

## 2. 기능 비교표

| 기능 | kingstinct (iOS) | react-native-health (iOS) | rn-health-connect (Android) | HealthSpec iOS / Android |
|---|---|---|---|---|
| 단일 크로스플랫폼 API | — | — | — | **✔** |
| 브릿지 | Nitro Modules | 구 브릿지(Obj-C, 콜백) | TurboModule + 구 아키텍처 | Expo Modules (New Arch) |
| Expo config plugin | ✔ | — | ✔ | ✔ (스펙에서 권한 자동 생성) |
| Expo Go / CI에서 동작 | — | — | — | **✔ MockProvider** |
| 권한 요청 | `requestAuthorization` | `initHealthKit` | `requestPermission` (+background, history, exercise route) | `requestPermissions({read, write, background, history})` |
| 권한 상태 조회 | 쓰기 상태만 (`authorizationStatusFor`) | `getAuthStatus` | `getGrantedPermissions` ✔ | iOS `unknown` 1급 / Android 실제 상태 |
| 권한 철회 | — | — | `revokeAllPermissions` | **없음** → 추가 권장 (§4) |
| 가용성 / 설치 유도 | `isHealthDataAvailable`, `isProtectedDataAvailable` | `isAvailable` | `getSdkStatus`, `openHealthConnectSettings`, `openHealthConnectDataManagement` | `availability()`, `openInstaller()` — **설정/데이터관리 화면 없음** |
| 샘플 읽기 (범위·limit·정렬) | ✔ | ✔ (타입별 메서드 89개) | ✔ (`between/after/before`, 페이지네이션) | ✔ — 범위는 start·end 필수 (열린 범위 없음) |
| 소스/앱 필터 | 메타데이터 반환 → 앱에서 필터 | 메타데이터 반환 | `dataOriginFilter` | `sources.apps`, `sources.excludeManual` (양쪽) |
| id 단건 조회 | hooks(`useQuantitySampleById`) | — | `readRecord` | **없음** → 추가 권장 |
| 집계 | `queryStatisticsForQuantity` (+collection, separateBySource) | 일별 합계 메서드 일부 | `aggregateRecord`, `groupByDuration`, `groupByPeriod` (타입별 metric) | 통합 `aggregate(fn, bucket, zone, field)` — 네이티브 metric 없는 타입은 레코드 폴백; **소스별 분리 없음** |
| 쓰기 | quantity/category/correlation/workout(+route) | `save*` 다수 | `insertRecords` 전 타입 | 26타입, 쓰기 전 스키마 검증, workout은 `HKWorkoutBuilder` |
| 삭제 | `deleteObjects`/`deleteSamples` | 3종만 | `deleteRecordsByUuids`, `ByTimeRange` | id·범위 양쪽 (iOS 파생 타입 제외) |
| 증분 동기화 | `*WithAnchor` (quantity/category/correlation/workout/ECG/heartbeat/state-of-mind) | `getAnchoredWorkouts`만 | `getChanges` (token) | 통합 커서 + `CURSOR_EXPIRED` + 수면 세션 재파생 |
| 구독 / 백그라운드 | `subscribeToChanges`, `enableBackgroundDelivery` | `setObserver` | — (HC에 푸시 없음) | iOS observer+background delivery / Android 폴링 |
| 신체 특성(성별·생년월일·혈액형·휠체어) | ✔ | ✔ | (HC에 없음) | **없음** |
| 선호 단위 | `getPreferredUnits` | — | 단위 객체 반환 | 정준 단위 고정 (설계) |
| 운동 경로 | `getWorkoutRoute`, `saveWorkoutRoute` | `getWorkoutRouteSamples` | `requestExerciseRoute` | **없음 (v2)** |
| 심박 시리즈 / ECG | ✔ / ✔ | ✔ / ✔ | — | **없음** |
| State of Mind / 복약 / 임상 기록 | ✔ / ✔ / — | — / — / ✔ | — | **없음** |
| 활동 요약(링)·운동시간·서기시간 | — | ✔ | — | **없음** |
| React hooks | 14개 | — | — | 5개 |
| 에러 모델 | 네이티브 에러 그대로 | 콜백 err | 문자열 코드 12종 | `HealthError` 코드 7종 (정규화) |
| 스펙 / conformance | — | — | — | **✔** |

## 3. 타입 커버리지 차이

### iOS (HealthKit)
- kingstinct: quantity 120·category 44·correlation·workout 전부(식별자 문자열을 그대로 받는 일반 API). react-native-health: 약 40개 타입을 타입별 메서드로.
- HealthSpec: 22종. 없는 것 중 수요가 높은 것(react-native-health의 메서드 수가 수요 신호): `distanceCycling`, `distanceSwimming`, `appleExerciseTime`, `appleStandTime`, `basalEnergyBurned`(독립 타입), `bodyMassIndex`, `waistCircumference`, `walkingHeartRateAverage`, `bloodAlcoholContent`, `insulinDelivery`, `peakExpiratoryFlowRate`, 영양소 세부(탄수화물 외 비타민·미네랄), 환경/헤드폰 소음, 월경 관련 category.

### Android (Health Connect)
- react-native-health-connect: 40종 전부.
- HealthSpec: 25종. **빠진 16종**: BasalBodyTemperature, BasalMetabolicRate, BodyWaterMass, BoneMass, CervicalMucus, CyclingPedalingCadence, ElevationGained, ExerciseRoute, IntermenstrualBleeding, MenstruationFlow, MenstruationPeriod, OvulationTest, Power, SexualActivity, Speed, StepsCadence.

## 4. 의미론 차이 (기능이 "있다"고 해서 같지 않은 것)

| 항목 | 기존 | HealthSpec | 비고 |
|---|---|---|---|
| 단위 | kingstinct: 호출자가 단위 지정 / HC lib: `{value, unit}` 객체 | 정준 단위의 숫자 (`kilograms`, `mmol/L`, %는 0–100) | 변환은 소비자 몫(`units` 헬퍼) |
| 심박 시리즈(Android) | 레코드 1개에 `samples[]` | 샘플당 레코드 1개, id `<id>#<index>` | 레코드 수 증가 vs 플랫폼 간 동일한 모양 |
| 수면 | kingstinct: raw category 샘플 / HC: 세션+단계 | 양쪽 다 세션+단계 (HK는 60분 갭으로 파생) | iOS `in_bed` 별도 단계 |
| HRV | SDNN(iOS) / RMSSD(Android) 각각 | `hrv_sdnn`, `hrv_rmssd` 별개 타입 | 절대 상호 변환 안 함 |
| iOS 읽기 권한 | 알 수 없음 (라이브러리도 동일 한계) | `unknown`을 API에 명시 | 거짓 `granted` 제거 |
| 집계 버킷 | HC lib: 요청 시작 시각부터 슬라이스 | 버킷 경계 정렬(자정·월요일·1일), 빈 버킷 `null` | 존 오버라이드는 기기 존만 지원 |
| 쓰기 검증 | 없음 (네이티브 예외) | 스키마·범위·시간 규칙을 TS에서 먼저 검사 | 부분 쓰기 없음 |
| 커서 | 플랫폼별 앵커/토큰 노출 | 불투명 문자열 + provider 검증 + 만료 코드 | HC 토큰 30일 만료 처리 내장 |
| 시간대 | HC lib: `zoneOffset {id,totalSeconds}` | `zoneOffset: "+09:00"` 문자열 (HK는 `HKTimeZone`에서 파생) | |

## 5. 검증된 사실 (기존 라이브러리 생성 파일과 대조)

- `HKWorkoutActivityType` raw 값 표 — kingstinct 헤더 생성 enum과 **동일** (1–84, 81 없음, other=3000).
- `HKCategoryValueSleepAnalysis` 값 — 동일.
- HK 메타데이터 키 문자열(`HKIndoorWorkout`, `HKSwimmingLocationType`, `HKWasUserEntered`, `HKTimeZone`) — 동일.
- HC 에러 매핑: rn-health-connect는 `SecurityException→PERMISSION_ERROR`, `IllegalStateException→SERVICE_UNAVAILABLE` 등 12종. 우리는 `SecurityException→E_PERMISSION_DENIED`, `IllegalArgumentException→E_INVALID_ARGUMENT`까지만 — `IllegalStateException`(클라이언트 미초기화/서비스 불가)을 `E_NOT_AVAILABLE`로 추가 매핑하는 것이 맞다.

## 6. 조치 결과 (2026-08-25)

D12(공통 + 특수 기능 전부 제공) 결정에 따라 §2·§3의 격차를 대부분 메웠다.

| 항목 | 상태 |
|---|---|
| Android 전 타입 | **완료** — Health Connect 40종 전부 (생리 주기 7종, BMR, 체수분, 골량, 케이던스·속도·파워, 고도 포함) |
| iOS 고수요/특수 타입 | **완료** — HK quantity 60여 종 추가, 증상·이벤트·생식건강 category 60여 종, ECG·심박 시리즈·State of Mind·활동 요약·복약 |
| 영양소 | **완료** — 42종 (양 플랫폼 합집합), Kotlin 직렬화는 스펙에서 생성 |
| 임상 기록 | **완료** — HK Clinical Records ↔ HC Personal Health Record, 14개 `clinical_*` 타입 |
| 운동 경로 | **완료** — `readRoute(sessionId)` 전용 연산, HC 세션별 동의 흐름 포함 |
| 신체 특성 | **완료** — `getProfile()` (iOS 전용, Android는 `capabilities().profile = false`) |
| id 단건 조회 · 설정 화면 · 권한 철회 · 선호 단위 | **완료** — `readById` / `openSettings` / `revokePermissions` / `preferredUnits` |
| HC 에러 매핑 보강 | **완료** — `IllegalStateException → NOT_AVAILABLE`, `UnsupportedOperationException → NOT_SUPPORTED`, `RemoteException → PLATFORM_ERROR` |
| 소스별 통계 분리 | **미착수** (v2) — kingstinct의 `queryStatisticsForQuantitySeparateBySource` |
| 실시간 운동 세션 | **미착수** (v2) — `HKLiveWorkoutDataSource`, HC 라이브 세션 |

**타입 커버리지 최종:** 182종 (양 플랫폼 38 / iOS 129 / Android 15). 기존 라이브러리 세 개의 합집합을 넘어선다.

**정확도 (2026-08-25 갱신).** 매핑을 세 개의 외부 라이브러리와 대조 검증했다 — HealthKit 159/167, Health Connect 41/53. 미검증 138개 → **20개**로 줄었고, 남은 것은 비교 대상 라이브러리가 아예 구현하지 않은 영역(ECG·심박 시리즈·State of Mind·활동 요약·복약·PHR)이라 출처가 없다. 검증 과정에서 **실제 버그 5개**를 잡았다: HealthKit이 쓰기를 허용하지 않는 quantity 타입 5종이 `write: true`로 선언되어 있었다. 자세한 내역은 `docs/VERIFICATION.md`, 남은 항목은 `docs/NATIVE-VERIFICATION.md` 참조.

## 7. 이전 권장 조치 (기록)

1. **Android 16종 추가** — 스키마 JSON + Kotlin 직렬화만으로 가능. 생리 주기 7종은 PRD v1.1이었으나 HC 라이브러리 이탈 사용자가 바로 필요로 하므로 v1로 당긴다.
2. **iOS 고수요 타입 추가** — `distance_cycling`, `distance_swimming`, `basal_energy`, `apple_exercise_time`, `apple_stand_time`, `body_mass_index`, `waist_circumference` 정도를 1차로. HC 대응이 없는 타입은 단일 플랫폼(◐)으로 선언.
3. **Provider 선택 API 추가** — `readById(type, id)`, `openSettings()`(HC 설정/데이터 관리, iOS는 Health 앱), `revokePermissions()`(Android 전용, iOS는 `NOT_SUPPORTED`). `ReadQuery.end` 기본값 `now`로 열린 범위 허용.
4. **신체 특성** — `profile` 읽기 전용 타입(성별·생년월일·혈액형·휠체어 사용)을 iOS 단일 플랫폼으로 스펙에 추가할지 결정.
5. **HC 에러 매핑 보강** — `IllegalStateException → E_NOT_AVAILABLE`, `UnsupportedOperationException → E_NOT_SUPPORTED`.
6. **v2로 유지** — 운동 경로, 심박 시리즈, ECG, State of Mind, 복약, 임상 기록, 활동 요약, 소스별 통계 분리.
