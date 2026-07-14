import { useEffect } from "react";
import { useFieldArray, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creatorsApi } from "@/api/creators";
import { extractErrorMessage } from "@/api/client";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Input, TextArea } from "@/components/Field";
import { FullPageSpinner } from "@/components/Spinner";
import { TickMeter } from "@/components/TickMeter";

const linkSchema = z.object({ value: z.string().url("Must be a valid URL") });
const schema = z.object({
  displayName: z.string().min(2).max(120),
  bio: z.string().max(4000).optional().or(z.literal("")),
  niche: z.string().max(80).optional().or(z.literal("")),
  followerCount: z.coerce.number().int().min(0),
  socialLinks: z.array(linkSchema).max(20),
  portfolioLinks: z.array(linkSchema).max(30),
});
type FormValues = z.infer<typeof schema>;

export function CreatorProfilePage() {
  const { data, isLoading } = useQuery({ queryKey: ["creator", "me"], queryFn: creatorsApi.getMine });
  const queryClient = useQueryClient();
  const { push } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", bio: "", niche: "", followerCount: 0, socialLinks: [], portfolioLinks: [] },
  });

  const socialFields = useFieldArray({ control, name: "socialLinks" });
  const portfolioFields = useFieldArray({ control, name: "portfolioLinks" });
  const followerCount = watch("followerCount");

  useEffect(() => {
    if (data) {
      reset({
        displayName: data.displayName,
        bio: data.bio ?? "",
        niche: data.niche ?? "",
        followerCount: data.followerCount,
        socialLinks: data.socialLinks.map((v) => ({ value: v })),
        portfolioLinks: data.portfolioLinks.map((v) => ({ value: v })),
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      creatorsApi.updateMine({
        displayName: values.displayName,
        bio: values.bio ?? "",
        niche: values.niche ?? "",
        followerCount: values.followerCount,
        socialLinks: values.socialLinks.map((l) => l.value),
        portfolioLinks: values.portfolioLinks.map((l) => l.value),
      }),
    onSuccess: () => {
      push("Profile updated", "success");
      queryClient.invalidateQueries({ queryKey: ["creator", "me"] });
    },
    onError: (err) => push(extractErrorMessage(err), "error"),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900">My profile</h1>
      <p className="mt-1.5 mb-6 text-ink-500">This is what businesses see when reviewing your applications.</p>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="card-surface flex flex-col gap-5 p-7">
        <Input label="Display name" error={errors.displayName?.message} {...register("displayName")} />
        <Input label="Niche / category" placeholder="e.g. Beauty, Fitness, Tech" error={errors.niche?.message} {...register("niche")} />
        <TextArea label="Bio" rows={4} error={errors.bio?.message} {...register("bio")} />

        <div>
          <Input
            label="Follower count (self-reported)"
            type="number"
            min={0}
            error={errors.followerCount?.message}
            {...register("followerCount")}
          />
          <TickMeter value={Number(followerCount) || 0} max={100000} className="mt-3" accent="gold" />
        </div>

        <FieldArraySection
          title="Social handles"
          fields={socialFields.fields}
          onAdd={() => socialFields.append({ value: "" })}
          onRemove={socialFields.remove}
          register={register}
          name="socialLinks"
          errors={errors.socialLinks}
        />

        <FieldArraySection
          title="Portfolio links"
          fields={portfolioFields.fields}
          onAdd={() => portfolioFields.append({ value: "" })}
          onRemove={portfolioFields.remove}
          register={register}
          name="portfolioLinks"
          errors={errors.portfolioLinks}
        />

        <Button type="submit" isLoading={isSubmitting || mutation.isPending} className="self-start">
          Save changes
        </Button>
      </form>
    </div>
  );
}

function FieldArraySection({
  title,
  fields,
  onAdd,
  onRemove,
  register,
  name,
  errors,
}: {
  title: string;
  fields: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  register: ReturnType<typeof useForm<FormValues>>["register"];
  name: "socialLinks" | "portfolioLinks";
  errors?: FieldErrors<FormValues>["socialLinks"] | FieldErrors<FormValues>["portfolioLinks"];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">{title}</span>
        <button type="button" onClick={onAdd} className="focus-ring text-xs font-semibold text-signal-600 hover:text-signal-700">
          + Add link
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {fields.length === 0 && <p className="text-xs text-ink-400">No links added yet.</p>}
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="https://…"
              error={errors?.[index]?.value?.message}
              {...register(`${name}.${index}.value` as const)}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="focus-ring shrink-0 rounded-lg px-2 text-sm text-ink-400 hover:bg-danger-soft hover:text-danger-deep"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
