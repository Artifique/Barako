import { listRecruitmentNeedsAction } from "@/controllers/recruitment.controller";
import { AdminBesoinsClient } from "./client";

export default async function AdminBesoinsPage() {
  const res = await listRecruitmentNeedsAction();
  const needs = res.ok ? res.data : [];
  return <AdminBesoinsClient initialNeeds={needs} />;
}
