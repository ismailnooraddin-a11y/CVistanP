import { WorkspaceRouter } from "@/features/workspace-router";

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <WorkspaceRouter path={`/${slug.join("/")}`} />;
}
