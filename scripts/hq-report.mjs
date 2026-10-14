#!/usr/bin/env node
// 복사본 — 원본은 4growth-hq 저장소 scripts/hq-report.mjs (npm run dev:scripts:export, 2026-10-14, 87d480b). 여기서 고치지 말고 원본을 고쳐 다시 내보낸다.
// Claude Code → HQ 보고 (M6-6). 과제가 끝나 보고를 쓰기 전에 한 번 실행한다.
//
//   node scripts/hq-report.mjs --file report.json
//   node scripts/hq-report.mjs --summary "프로젝트 정리 비서 구현" --milestone M6-5 --done --commits 4f0ba43,bb561db --next "M6-6"
//   node scripts/hq-report.mjs --task <과제 ID> --summary "…" --commits …   (hq-next.mjs로 받은 과제면 — 그 과제가 보고됨으로, 보고가 카드에 붙는다)
//   … --pr https://github.com/…/pull/12   (클라우드 세션이 연 PR — 카드에 "PR 열기")
//
// report.json 모양: { project, milestone?, milestone_done?, summary, commits[], decisions?[{title, content, reason?}], next?, task_id?, pr_url? }
// 토큰은 .env(또는 .env.local)의 HQ_DEV_TOKEN, 주소는 HQ_URL(없으면 운영 서버). --url로 바꿀 수 있다.
// 보고 실패는 치명적이지 않다 — 결과 한 줄을 보고문에 적는다. 실패면 종료 코드 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://4growth-hq-production.up.railway.app';
const DEFAULT_PROJECT = '4growth HQ';
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

let report;
if (opt('file')) {
  report = JSON.parse(fs.readFileSync(opt('file'), 'utf8'));
} else {
  report = {
    project: opt('project') ?? DEFAULT_PROJECT,
    summary: opt('summary'),
    ...(opt('milestone') ? { milestone: opt('milestone'), milestone_done: has('done') } : {}),
    commits: (opt('commits') ?? '').split(',').map((c) => c.trim()).filter(Boolean),
    ...(opt('next') ? { next: opt('next') } : {}),
    ...(opt('decisions-file') ? { decisions: JSON.parse(fs.readFileSync(opt('decisions-file'), 'utf8')) } : {}),
  };
}
report.project ??= DEFAULT_PROJECT;
if (opt('task')) report.task_id = opt('task');
if (opt('pr')) report.pr_url = opt('pr');

if (!token) {
  console.log('HQ 보고 실패: HQ_DEV_TOKEN이 없음 (.env·.env.local)');
  process.exit(1);
}
if (!report.summary) {
  console.log('HQ 보고 실패: summary가 없음');
  process.exit(1);
}

try {
  const res = await fetch(`${url}/api/dev/report`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(report),
    signal: AbortSignal.timeout(20_000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log(`HQ 보고 실패: ${res.status} ${body.error ?? ''}`.trim());
    process.exit(1);
  }
  console.log(`HQ 보고 완료 (${url.replace(/^https?:\/\//, '')}): ${body.messages.join(' / ')}`);
  console.log(JSON.stringify({ report_id: body.report_id, milestone: body.milestone, work_log: body.work_log, decisions_proposed: body.decisions_proposed, task: body.task ?? null }));
} catch (err) {
  console.log(`HQ 보고 실패: ${err.name === 'TimeoutError' ? '시간 초과' : err.message}`);
  process.exit(1);
}
