import { redirect } from "next/navigation";

import { MyProjects } from "@/components/my-projects";

export default async function ProjectsPage() {
  const { ok, projects } = { ok: true, projects: [] };

  if (!ok) {
    redirect("/");
  }

  return <MyProjects projects={projects} />;
}
