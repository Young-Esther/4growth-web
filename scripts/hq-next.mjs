#!/usr/bin/env node
// 복사본 — 원본은 4growth-hq 저장소 scripts/hq-next.mjs (npm run dev:scripts:export, 2026-10-13, 3142786). 여기서 고치지 말고 원본을 고쳐 다시 내보낸다.
// 다음 과제 (M6-6b): 사용자가 "다음 과제"라고 하면 실행한다. 이 저장소(토큰이 묶인 저장소)의 다음 개발 과제를 HQ에서 받아(claim)
// 지시문과 참조 명세 전문을 출력한다. 출력된 지시문이 곧 이번 작업 지시다.
//
//   node scripts/hq-next.mjs              다음 과제 받기 (이미 받은 과제가 있으면 그것을 다시 보여 준다)
//   node scripts/hq-next.mjs --release <과제 ID>   받은 과제 내려놓기 (다시 ready로)
//   node scripts/hq-next.mjs --json       받은 그대로(JSON)
//
// 끝나면 보고에 과제 ID를 붙인다: node scripts/hq-report.mjs --task <과제 ID> --summary "…" --commits …
// 토큰은 .env(또는 .env.local)의 HQ_DEV_TOKEN(저장소마다 다르다), 주소는 HQ_URL(없으면 운영 서버). --url로 바꿀 수 있다.
// 의존성 없음 — 다른 저장소에도 그대로 복사해 쓴다 (HQ 저장소에서 npm run dev:scripts:export).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://4growth-hq-production.up.railway.app';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// .env와 .env.local을 의존성 없이 읽는다 (KEY=VALUE 줄만). 우선순위: 환경변수 > .env.local > .env
// (Next.js 저장소는 비밀값을 .env.local에 둔다)
function readEnv() {
  const env = {};
  for (const name of ['.env', '.env.local']) {
    try {
      for (const line of fs.readFileSync(path.join(root, name), 'utf8').split(/\r?\n/)) {
        const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
        if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
      }
    } catch {
      // 파일이 없으면 건너뛴다
    }
  }
  return { ...env, ...process.env };
}

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const env = readEnv();
const url = (opt('url') ?? env.HQ_URL ?? DEFAULT_URL).replace(/\/+$/, '');
const token = env.HQ_DEV_TOKEN;
const host = url.replace(/^https?:\/\//, '');

if (!token) {
  console.log('HQ 연결 실패: HQ_DEV_TOKEN이 없음 (.env·.env.local)');
  process.exit(1);
}

async function call(pathname, body) {
  const res = await fetch(`${url}${pathname}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body ?? {}),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${data.error ?? ''}`.trim());
  return data;
}

const STATUS = { draft: '초안', ready: '준비', in_progress: '진행 중', reported: '보고됨(완료 확인 전)', done: '완료', blocked: '멈춤', missing: '없음' };

function printTask(r) {
  const t = r.task;
  const head = r.status === 'in_progress' ? '이미 받은 과제 (진행 중)' : '다음 과제';
  console.log(`${head} — ${t.repo.name}(${t.repo.key}) #${t.order_no}: ${t.title}`);
  console.log(`과제 ID: ${t.id}`);
  if (t.design_document) console.log(`설계 문서: ${t.design_document}`);
  if (t.depends.length) console.log(`앞선 과제: ${t.depends.map((d) => `${d.title}(${STATUS[d.status] ?? d.status})`).join(', ')}`);
  console.log('');
  console.log('===== 지시문 =====');
  console.log(t.body);
  for (const s of t.specs) {
    console.log('');
    console.log(`===== 명세 ${s.key} v${s.version} — ${s.title} =====`);
    console.log(s.body);
  }
  console.log('');
  console.log('===== 끝나면 =====');
  console.log(`node scripts/hq-report.mjs --task ${t.id} --summary "…" --commits <해시,…>   (완료는 대표가 push·확인 뒤 HQ에서)`);
  console.log(`포기하려면: node scripts/hq-next.mjs --release ${t.id}`);
}

try {
  const releaseId = opt('release');
  if (has('release')) {
    if (!releaseId) throw new Error('--release 뒤에 과제 ID');
    const r = await call('/api/dev/release', { task_id: releaseId });
    console.log(`과제 내려놓음 (${host}): ${r.title} → 준비(ready)`);
    process.exit(0);
  }
  const r = await call('/api/dev/next');
  if (has('json')) {
    console.log(JSON.stringify(r, null, 2));
  } else if (r.status === 'claimed' || r.status === 'in_progress') {
    printTask(r);
  } else if (r.status === 'waiting') {
    const deps = r.waiting_for.map((d) => `「${d.title}」(${d.repo ?? '?'}, ${STATUS[d.status] ?? d.status})`).join(', ');
    console.log(`대기 중: ${deps} 과제가 끝나야 함 — ${r.repo.name}(${r.repo.key})의 다음 과제 「${r.task.title}」${r.ready_count > 1 ? ` 외 ${r.ready_count - 1}개` : ''}`);
  } else {
    console.log(`없음: ${r.repo.name}(${r.repo.key}) 저장소에 준비된 과제가 없습니다`);
  }
} catch (err) {
  console.log(`HQ 연결 실패 (${host}): ${err.name === 'TimeoutError' ? '시간 초과' : err.message}`);
  process.exit(1);
}
