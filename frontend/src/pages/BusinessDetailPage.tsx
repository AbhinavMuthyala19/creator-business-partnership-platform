import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { businessesApi } from "@/api/businesses";
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

export function BusinessDetailPage() {
  const { id } = useParams();
  const businessId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const { data: business, isLoading } = useQuery({
    queryKey: ["business", businessId],
    queryFn: () => businessesApi.getById(businessId),
    enabled: Number.isFinite(businessId),
  });

  const { data: myApplications } = useQuery({
    queryKey: ["applications", "me", "all"],
    queryFn: () => applicationsApi.mine(0, 200),
    enabled: user?.role === "CREATOR",
  });

  const existingApplication = myApplications?.content.find((a) => a.businessId === businessId);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const applyMutation = useMutation({
    mutationFn: (values: FormValues) => applicationsApi.create({ businessId, pitchMessage: values.pitchMessage }),
    onSuccess: () => {
      push("Application sent! You'll be notified once it's reviewed.", "success");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => setSubmitError(extractErrorMessage(err, "Could not submit your application")),
  });

  if (isLoading) return <FullPageSpinner />;
  if (!business) return <p className="text-ink-500">Business not found.</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-surface mb-6 flex items-start gap-5 p-7">
        {business.logoUrl ? (
          <img src={business.logoUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-signal-50 font-display text-2xl font-semibold text-signal-700">
            {business.companyName[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold text-ink-900">{business.companyName}</h1>
          {business.industry && <p className="text-sm uppercase tracking-wide text-ink-400">{business.industry}</p>}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm font-medium text-signal-600 hover:text-signal-700"
            >
              {business.website}
            </a>
          )}
        </div>
      </div>

      {business.description && (
        <div className="card-surface mb-6 p-7">
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-800">About</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-600">{business.description}</p>
        </div>
      )}

      {user?.role === "CREATOR" && (
        <div className="card-surface p-7">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Apply to partner</h2>
          {existingApplication ? (
            <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-paper-100 px-4 py-3">
              <StatusPill status={existingApplication.status} />
              <p className="text-sm text-ink-500">
                {existingApplication.status === "PENDING" && "Your application is awaiting review."}
                {existingApplication.status === "APPROVED" && "You're approved! Head to My Submissions to upload content."}
                {existingApplication.status === "REJECTED" && "This application was not approved."}
              </p>
            </div>
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
                placeholder="Introduce yourself and explain why you'd be a great fit for this brand…"
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
