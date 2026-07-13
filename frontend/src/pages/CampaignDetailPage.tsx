import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { campaignsApi } from "@/api/campaigns";
import { applicationsApi } from "@/api/applications";
import { extractErrorMessage } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";
import { FullPageSpinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/Field";
import { StatusPill } from "@/components/StatusPill";
import { useToast } from "@/components/Toast";

const schema = z.object({
  pitchMessage: z.string().min(20, "Tell them a bit more — at least 20 characters").max(4000),
});
type FormValues = z.infer<typeof schema>;

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });
const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function CampaignDetailPage() {
  const { id } = useParams();
  const campaignId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => campaignsApi.getById(campaignId),
    enabled: Number.isFinite(campaignId),
  });

  const { data: myApplications } = useQuery({
    queryKey: ["applications", "me", "all"],
    queryFn: () => applicationsApi.mine(0, 200),
    enabled: user?.role === "CREATOR",
  });

  const existingApplication = myApplications?.content.find((a) => a.campaignId === campaignId);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const applyMutation = useMutation({
    mutationFn: (values: FormValues) => applicationsApi.create({ campaignId, pitchMessage: values.pitchMessage }),
    onSuccess: () => {
      push("Application sent! You'll be notified once it's reviewed.", "success");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => setSubmitError(extractErrorMessage(err, "Could not submit your application")),
  });

  if (isLoading) return <FullPageSpinner />;
  if (!campaign) return <p className="text-ink-500">Campaign not found.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-surface mb-6 flex items-start gap-5 p-7">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-signal-50 font-display text-2xl font-semibold text-signal-700">
          {campaign.businessCompanyName[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink-900">{campaign.title}</h1>
          <p className="text-sm uppercase tracking-wide text-ink-400">{campaign.businessCompanyName}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-600">
            <span>
              <span className="text-ink-400">Runs</span>{" "}
              {dateFormatter.format(new Date(campaign.startDate))} – {dateFormatter.format(new Date(campaign.endDate))}
            </span>
            <span className="font-semibold text-gold-700">
              {inrFormatter.format(campaign.ratePerThousandViewsInr)} / 1,000 views
            </span>
          </div>
        </div>
        {campaign.acceptingApplications ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Open
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Closed
          </span>
        )}
      </div>

      {campaign.description && (
        <div className="card-surface mb-6 p-7">
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-800">About this campaign</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">{campaign.description}</p>
        </div>
      )}

      {user?.role === "CREATOR" && (
        <div className="card-surface p-7">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Apply to this campaign</h2>
          {existingApplication ? (
            <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-paper-100 px-4 py-3">
              <StatusPill status={existingApplication.status} />
              <p className="text-sm text-ink-500">
                {existingApplication.status === "PENDING" && "Your application is awaiting review."}
                {existingApplication.status === "APPROVED" && "You're approved! Head to My Submissions to upload content."}
                {existingApplication.status === "REJECTED" && "This application was not approved."}
              </p>
            </div>
          ) : !campaign.acceptingApplications ? (
            <p className="text-sm text-ink-500">This campaign is not currently accepting applications.</p>
          ) : (
            <form
              onSubmit={handleSubmit((values) => {
                setSubmitError(null);
                applyMutation.mutate(values);
              })}
              className="flex flex-col gap-4"
            >
              {submitError && (
                <div className="rounded-lg border border-alert-200 bg-alert-50 px-3 py-2 text-sm text-alert-700">
                  {submitError}
                </div>
              )}
              <TextArea
                label="Pitch message"
                placeholder="Introduce yourself and explain why you'd be a great fit for this campaign…"
                rows={5}
                error={errors.pitchMessage?.message}
                {...register("pitchMessage")}
              />
              <Button type="submit" isLoading={isSubmitting} className="self-start">
                Submit application
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
