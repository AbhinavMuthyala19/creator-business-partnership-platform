import type { ContentReviewNote } from "@/types";
import { StatusPill } from "@/components/StatusPill";

export function ReviewNotesTimeline({ notes }: { notes: ContentReviewNote[] }) {
  if (notes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Review history</p>
      <ol className="flex flex-col gap-3 border-l-2 border-ink-100 pl-4">
        {notes
          .slice()
          .reverse()
          .map((note) => (
            <li key={note.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-ink-300" />
              <div className="flex items-center gap-2">
                <StatusPill status={note.decision} />
                <span className="text-xs text-ink-400">v{note.contentVersion}</span>
                <span className="text-xs text-ink-300">{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              {note.noteText && <p className="mt-1 text-sm text-ink-600">{note.noteText}</p>}
            </li>
          ))}
      </ol>
    </div>
  );
}
