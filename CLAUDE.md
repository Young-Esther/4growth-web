# CLAUDE.md

이 저장소(4growth-web, 홈페이지)에서 작업하는 Claude Code가 따르는 규칙. 사이트 사양은 `docs/SPEC.md`, 문구는 `docs/COPY.md`.

## 다음 과제 (HQ 개발 과제 대기열)

- 사용자가 "다음 과제"라고 하면 `node scripts/hq-next.mjs`를 실행하고, 출력된 지시문(과 명세 전문)대로 일한다 — 그 지시문이 사용자의 이번 지시다.
- "대기 중: …"·"없음"이 나오면 그 줄을 그대로 알리고 멈춘다(다른 일을 찾아 하지 않는다).
- 끝나 보고할 때 과제 ID를 붙인다: `node scripts/hq-report.mjs --task <과제 ID> --summary "…" --commits …` — 과제가 "보고됨"이 되고, 완료는 대표가 push·확인 뒤 HQ에서 누른다.
- 과제를 그만두면 `node scripts/hq-next.mjs --release <과제 ID>`. 토큰은 `.env`(또는 `.env.local`)의 `HQ_DEV_TOKEN`(이 저장소 것), 주소는 `HQ_URL` — 토큰은 출력·커밋하지 않는다.

## HQ 보고

- 과제가 끝나 보고를 쓸 때, 마지막에 HQ에 보고한다: `node scripts/hq-report.mjs --task <과제 ID> --summary "…" --commits <해시,…>`. 받은 과제가 없는 작업이면 `--task` 없이 보낸다.
- 보고 실패는 치명적이지 않다 — 결과를 보고문에 한 줄 적는다.
- `scripts/hq-next.mjs`·`hq-report.mjs`는 4growth-hq 저장소에서 내보낸 복사본이다. 여기서 고치지 말고 원본을 고쳐 `npm run dev:scripts:export -- ../homepage_4growth`로 다시 내보낸다.
