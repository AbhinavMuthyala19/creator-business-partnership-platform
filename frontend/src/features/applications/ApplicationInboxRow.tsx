import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import type { ApplicationRecord } from "@/types";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/Field";
import { applicationsApi } from "@/api/applications";
import { extractErrorMessage } from "@/api/client";
import { useToast } from "@/components/Toast";
import { CreatorProfileInline } from "./CreatorProfileInline";
import { KycReviewPanel } from "@/features/kyc/KycReviewPanel";

export function ApplicationInboxRow({ application }: { application: ApplicationRecord }) {
  const [expanded, setExpanded] = useState(false);
  const [reviewing, setReviewing] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();
  const { push } = useToast();

  const mutation = useMutation({
    mutationFn: (status: "APPROVED" | "REJECTED") =>
      applicationsApi.updateStatus(application.id, { status, reviewNote: note || undefined }),
    onSuccess: (_, status) => {
      push(`Application ${status === "APPROVED" ? "approved" : "rejected"}.`, "success");
      queryClient.invalidateQueries({ queryKey: ["applications", "inbox"] });
      setReviewing(null);
      setNote("");
    },
    onError: (err) => push(extractErrorMessage(err), "error"),
  });

  return (
    <div className="card-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="focus-ring flex items-center gap-2 font-display text-base font-semibold text-ink-900 hover:text-signal-700"
          >
            {application.creatorDisplayName}
            <span className={clsx("text-xs text-ink-300 transition-transform", expanded && "rotate-180")}>▾</span>
          </button>
          <p className="mt-1 text-sm text-ink-500">{application.pitchMessage}</p>
        </div>
        <StatusPill status={application.status} className="shrink-0" />
      </div>

      {expanded && (
        <div className="mt-4 flex flex-col gap-4">
          <CreatorProfileInline creatorId={application.creatorId} />
          <KycReviewPanel creatorId={application.creatorId} />
        </div>
      )}

      {application.status === "PENDING" && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          {reviewing ? (
            <div className="flex flex-col gap-3">
              <TextArea
                label={`Note (optional) — ${reviewing === "APPROVED" ? "welcome them" : "explain why"}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={reviewing === "APPROVED" ? "primary" : "danger"}
                  isLoading={mutation.isPending}
                  onClick={() => mutation.mutate(reviewing)}
                >
                  Confirm {reviewing === "APPROVED" ? "approval" : "rejection"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReviewing(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setReviewing("APPROVED")}>
                Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => setReviewing("REJECTED")}>
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
