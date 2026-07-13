import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "@/api/applications";
import { contentApi } from "@/api/content";
import { FullPageSpinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { ImageStackIcon } from "@/components/icons";
import { ContentSubmitCard } from "@/features/content/ContentSubmitCard";
import { ContentCard } from "@/features/content/ContentCard";

export function CreatorContentPage() {
  const { data: applications, isLoading: loadingApps } = useQuery({
    queryKey: ["applications", "me", "all"],
    queryFn: () => applicationsApi.mine(0, 200),
  });

  const { data: content, isLoading: loadingContent } = useQuery({
    queryKey: ["content", "me"],
    queryFn: () => contentApi.mine(0, 200),
  });

  if (loadingApps || loadingContent) return <FullPageSpinner />;

  const approvedWithoutContent = (applications?.content ?? []).filter(
    (app) => app.status === "APPROVED" && !(content?.content ?? []).some((c) => c.applicationId === app.id),
  );

  const hasNothing = approvedWithoutContent.length === 0 && (content?.content.length ?? 0) === 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">My submissions</h1>
        <p className="mt-1.5 text-ink-500">Upload content for approved partnerships and track review feedback.</p>
      </div>

      {hasNothing ? (
        <EmptyState
          icon={<ImageStackIcon className="h-10 w-10" />}
          title="Nothing to submit yet"
          description="Once a business approves your application, it will show up here for content upload."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {approvedWithoutContent.map((app) => (
            <ContentSubmitCard key={app.id} application={app} />
          ))}
          {(content?.content ?? []).map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </div>
  );
}
