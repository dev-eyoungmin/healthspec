<div align="center">

# HealthSpec

**모든 플랫폼의 온디바이스 헬스 데이터를 위한 표준 명세**

[English](README.md) · [한국어](README.ko.md)

</div>

## 개요

HealthSpec은 Apple HealthKit과 Android Health Connect를 한자리에 기술합니다 — 182개 헬스 타입, 각 플랫폼이
그 타입에 쓰는 식별자와 단위, 그리고 클라이언트가 구현해야 할 동작(권한·가용성·증분 동기화·집계·중복 제거).

**스펙이 제품입니다.** [`spec/schema`](spec/schema)가 단일 원천이고, 타입·검증기·매핑 테이블·네이티브
패키지가 전부 여기서 생성됩니다. 어떤 라이브러리든 이 스펙을 구현하고 conformance 스위트로 증명할 수 있습니다.

타입 의미론은 [IEEE 1752 / Open mHealth](https://www.openmhealth.org/)가 정의한 범위에서 그에 정렬합니다.

> **Pre-release.** 아직 배포되지 않았고, 실기기에서 실행된 적이 없습니다.
> [NATIVE-VERIFICATION.md](docs/NATIVE-VERIFICATION.md) 참조.

## 패키지

| 패키지 | 언어 | 내용 |
|---|---|---|
| [`spec`](spec) | — | [`SPEC.md`](spec/SPEC.md)와 182개 JSON Schema |
| [`@healthspec/schema`](packages/schema) | TypeScript | 타입·검증기·플랫폼 테이블 |
| [`@healthspec/core`](packages/core) | TypeScript | `Provider` 계약, `HealthStore`, `MockProvider` |
| [`@healthspec/conformance`](packages/conformance) | TypeScript | conformance 스위트 |
| [`HealthSpec`](packages/apple) | Swift | HealthKit 매핑 — SPM·CocoaPods |
| [`dev.healthspec:healthspec`](packages/google) | Kotlin | Health Connect 매핑·직렬화·집계 |
| [`healthspec`](packages/dart) | Dart | 타입 체계와 매핑 |

플랫폼 패키지에는 프레임워크 의존성이 없어, 순수 Swift·Kotlin·Flutter 프로젝트도 스펙을 바로 쓸 수 있습니다.

## 라이브러리

| 프레임워크 | 플랫폼 | 패키지 | 상태 |
|---|---|---|---|
| [Expo · React Native](libraries/expo-health) | iOS, Android | `@healthspec/expo` | 미배포 |
| Flutter | iOS, Android | — | 예정 |
| Kotlin Multiplatform | iOS, Android | — | 예정 |
| .NET MAUI | iOS, Android | — | 예정 |

## 사용법

```ts
import { HealthStore } from '@healthspec/expo';

const store = HealthStore.default();          // Apple Health · Health Connect · Expo Go와 테스트에서는 Mock

await store.requestSupportedPermissions({ read: ['steps', 'heart_rate', 'sleep_session'], write: ['weight'] });

const daily = await store.aggregate('steps', { start, end, fn: 'sum', bucket: 'day' });
const [latest] = await store.read('heart_rate', { start, end, order: 'desc', limit: 1 });
await store.write([{ type: 'weight', start: now, end: now, value: { kilograms: 72.4 } }]);
```

`app.json`에 타입만 선언하면 config plugin이 네이티브 권한·entitlement·사용 설명 문자열을 스펙에서 만들어냅니다:

```json
["@healthspec/expo", { "read": ["steps", "heart_rate", "sleep_session"], "write": ["weight"], "background": true }]
```

## 헬스 타입

182개 — 양 플랫폼 **38** · Apple 전용 **129** · Android 전용 **15**.
생성된 [매핑표](docs/mapping/README.md)를 참고하세요.

차이는 발견하는 게 아니라 선언되어 있습니다:

```ts
store.support('hrv_sdnn').read;            // Android에서는 false
store.support('hrv_sdnn').counterparts;    // [{ type: 'hrv_rmssd', interchangeable: false, reason: … }]
store.support('cervical_mucus').missingFields;  // iOS에서는 ['sensation']
```

`interchangeable: false`는 두 타입이 서로 다른 것을 측정하므로 **절대 변환하면 안 된다**는 뜻입니다.

## Conformance

```ts
import { runConformanceSuite } from '@healthspec/conformance';

const report = await runConformanceSuite(myProvider);
report.conformant;   // 모든 시나리오가 자신이 강제하는 SPEC 조항을 명시합니다
```

## 문서

| | |
|---|---|
| [스펙](spec/SPEC.md) | 규범적 동작 |
| [플랫폼 매핑](docs/mapping/README.md) | 생성물 — 타입별·필드별 |
| [검증](docs/VERIFICATION.md) | 무엇이 어느 증거 등급으로 확인됐는가 |
| [네이티브 검증](docs/NATIVE-VERIFICATION.md) | 실기기가 필요한 항목 |
| [기존 라이브러리 비교](docs/PARITY.md) | 기능 대조 |

## 개발

```sh
pnpm install
pnpm codegen        # 스펙 → 생성 코드·문서
pnpm verify         # 코드젠 최신성 + 빌드 + 타입체크 + 테스트 + Swift 런타임 검사
```

헬스 타입 추가 = `spec/schema/types/`에 JSON 파일 하나 + `pnpm codegen`.
[CONTRIBUTING.md](CONTRIBUTING.md) 참조.

## 감사의 말

서드파티 런타임 의존성은 없습니다. 개발 과정에서 MIT 라이선스 라이브러리 세 개를 검증 대조군이자 선행
연구로 참고했습니다 — 각각의 기여는 [NOTICE.md](NOTICE.md)에 밝혀두었습니다.

## 라이선스

MIT
