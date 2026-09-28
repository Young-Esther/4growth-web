import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** 로케일 접두사를 자동으로 붙이는 Link·router. 앱 안의 내부 링크는 모두 이것을 쓴다. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
