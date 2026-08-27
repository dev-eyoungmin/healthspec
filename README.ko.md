# HealthSpec

[English](README.md) · [한국어](README.ko.md)

> Apple HealthKit, Android Health Connect, 그리고 벤더 SDK를 가로지르는 온디바이스 헬스 데이터의 단일 스키마 · 단일 권한 모델 · 단일 동기화 모델.

**상태: pre-alpha.** Phase 0(스펙 + 코드젠)은 완료됐고, Phase 1(레퍼런스 SDK)을 진행 중입니다. 아직 npm에 배포된 것은 없습니다.

## 왜 만드는가

오늘날 헬스 데이터를 다루는 React Native 앱은 iOS 전용 라이브러리 하나와 Android 전용 라이브러리 하나를 설치한 뒤, 그 위에 자체 정규화 레이어를 다시 씁니다. 두 플랫폼은 타입·단위·권한 의미론·동기화 모델이 전부 다르고, 그 지식은 스펙이 아니라 앱 코드와 라이브러리 주석 속에 흩어져 있습니다.

HealthSpec은 *스펙이 먼저*입니다. [`spec/schema`](spec/schema)의 JSON Schema가 단일 원천이며, TypeScript 타입·런타임 검증기·플랫폼 매핑표·네이티브 매핑 테이블·문서가 전부 여기서 생성됩니다. React Native / Expo용 레퍼런스 SDK(`@healthspec/expo`)가 이 스펙을 구현하고, 다른 라이브러리나 벤더 SDK도 같은 스펙을 구현한 뒤 conformance 스위트로 증명할 수 있습니다.

의미론은 [IEEE 1752 / Open mHealth](https://www.openmhealth.org/)가 정의한 범위에서는 그에 정렬합니다. HealthSpec이 추가하는 것은 모바일 SDK에 필요하지만 그 표준들이 비워둔 부분입니다 — 플랫폼 매핑 메타데이터, 권한 의미론(iOS는 읽기 권한 부여 여부를 알려주지 않으므로 `unknown`이 1급 상태), 가용성, 그리고 불투명 커서 기반 증분 동기화 모델.

## 패키지

| 패키지 | 설명 | 상태 |
|---|---|---|
| [`spec/`](spec) | 스펙 — [`SPEC.md`](spec/SPEC.md)(동작)와 JSON Schema(데이터) | draft 0.1 |
| [`@healthspec/schema`](packages/schema) | 생성된 타입·검증기·매핑 테이블·단위 변환 — 런타임 의존성 없음 | Phase 0 ✔ |
| [`@healthspec/core`](packages/core) | `Provider` 계약, `HealthStore`, `MockProvider`, 커서, 시간 버킷 — 순수 TS | Phase 1 |
| [`@healthspec/expo`](packages/expo) | Expo 모듈: Apple Health + Health Connect provider, config plugin, hooks | Phase 1 (아직 미컴파일) |
| [`docs/mapping`](docs/mapping/README.md) | 생성된 HealthKit ↔ Health Connect 매핑표 | 생성물 |

## 패키지

| 패키지 | 내용 | 사용자 |
|---|---|---|
| [`spec/`](spec) | 스펙 — [`SPEC.md`](spec/SPEC.md)와 JSON Schema | 전부 |
| [`@healthspec/schema`](packages/schema) | 생성된 TS 타입·검증기·매핑 테이블 | TypeScript |
| [`@healthspec/core`](packages/core) | `Provider` 계약, `HealthStore`, `MockProvider` | TypeScript |
| [`@healthspec/conformance`](packages/conformance) | 모든 provider가 통과해야 하는 conformance 스위트 | 구현자 |
| [`HealthSpec`](packages/apple) | Swift Package + CocoaPod — HealthKit 매핑, RN 불필요 | Swift / iOS |
| [`dev.healthspec:healthspec`](packages/google) | Android 라이브러리 — Health Connect 매핑·직렬화·집계 | Kotlin / Android |
| [`healthspec`](packages/dart) | Dart 패키지 — 타입 체계와 매핑 | Dart / Flutter |
| [`@healthspec/expo`](libraries/expo-health) | Expo 모듈: 두 provider, config plugin, hooks | Expo / React Native |

플랫폼 패키지에는 프레임워크 의존성이 없습니다. 순수 Swift·Kotlin·Flutter 프로젝트도 React Native 없이
스펙을 채택할 수 있습니다.

## 플랫폼 차이

스펙은 각 플랫폼이 실제로 저장하는 것을 다루므로, 차이는 숨기지 않고 명시합니다:

- **타입 가용성** — 빌드 타임에는 `CROSS_PLATFORM_TYPES` / `IOS_ONLY_TYPES` / `ANDROID_ONLY_TYPES`, 런타임에는 `store.support(type)`.
- **필드 가용성** — 양쪽에 있는 타입이라도 한쪽에만 있는 필드가 있습니다. `support(type).missingFields`가 알려줍니다.
- **대응 타입(counterpart)** — `hrv_sdnn`(iOS)과 `hrv_rmssd`(Android)는 관련이 있지만 **교환 가능하지 않으며**, 스펙이 그 사실을 명시합니다. `NOT_SUPPORTED` 에러가 대응 타입과 그 차이를 함께 알려줍니다.

생성된 [플랫폼 차이표](docs/mapping/README.md#platform-differences)를 참고하세요.

## 개발

```sh
pnpm install
pnpm codegen        # 스펙 → 생성 코드 + 문서
pnpm verify         # 코드젠 최신 여부 + 빌드 + 타입체크 + 테스트
```

헬스 타입 추가 = `spec/schema/types/`에 JSON 파일 하나 추가 후 `pnpm codegen`. `packages/*/src/generated`는 절대 직접 수정하지 않습니다.

## 검증

플랫폼 매핑은 실제 SDK로 컴파일되는 라이브러리들과 대조 검증합니다 — [VERIFICATION.md](docs/VERIFICATION.md)
참조 (HealthKit 식별자 159/167, Health Connect 레코드 41/53 확인. 나머지는 비교 대상 라이브러리가
구현하지 않은 API입니다).

```sh
HEALTHSPEC_SOURCES=/path/to/sources pnpm verify:mappings
```

식별자가 존재한다는 것과 동작이 맞다는 것은 다릅니다. 실기기 빌드가 필요한 항목은
[NATIVE-VERIFICATION.md](docs/NATIVE-VERIFICATION.md)에서 추적합니다.

## 문서

- [스펙](spec/SPEC.md) (영문, 규범)
- [플랫폼 매핑표](docs/mapping/README.md) (생성물)
- [PRD](docs/PRD.md) (한국어)

## 감사의 말

런타임 의존성은 플랫폼 SDK뿐입니다. 개발 과정에서 MIT 라이선스 라이브러리 세 개
(`@kingstinct/react-native-healthkit`, `react-native-health`, `react-native-health-connect`)를
검증 대조군이자 선행 연구로 참고했습니다. 각각의 기여는 [NOTICE.md](NOTICE.md)에 밝혀두었습니다.

## 라이선스

MIT
