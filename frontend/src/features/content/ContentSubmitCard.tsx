import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/api/content";
import { extractErrorMessage } from "@/api/client";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/Field";
import { MediaUploadField } from "./MediaUploadField";
import type { ApplicationRecord, MediaType } from "@/types";

export function ContentSubmitCard({ application }: { application: ApplicationRecord }) {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<{ url: string; mediaType: MediaType } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { push } = useToast();

  const mutation = useMutation({
    mutationFn: () => {
      if (!media) throw new Error("Please upload media first");
      return contentApi.submit(application.id, { caption, mediaUrl: media.url, mediaType: media.mediaType });
    },
    onSuccess: () => {
      push("Content submitted for review!", "success");
      queryClient.invalidateQueries({ queryKey: ["content", "me"] });
    },
    onError: (err) => setError(extractErrorMessage(err, "Could not submit content")),
  });

  return (
    <div className="card-surface flex flex-col gap-4 border-signal-200/70 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-signal-600">Approved partnership</p>
        <h3 className="font-display text-lg font-semibold text-ink-900">{application.businessCompanyName}</h3>
        <p className="text-sm text-ink-400">Upload your first piece of content for this partnership.</p>
      </div>

      {error && <div className="rounded-lg border border-alert-200 bg-alert-50 px-3 py-2 text-sm text-alert-700">{error}</div>}

      <MediaUploadField value={media} onChange={setMedia} />
      <TextArea
        label="Caption"
        placeholder="Write the caption you'd post alongside this content…"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button
        onClick={() => mutation.mutate()}
        isLoading={mutation.isPending}
        disabled={!media || caption.trim().length === 0}
        className="self-start"
      >
        Submit for review
      </Button>
    </div>
  );
}
