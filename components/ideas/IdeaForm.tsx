"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  problem: z.string().min(10, "Problem must be at least 10 characters"),
  solution: z.string().min(10, "Solution must be at least 10 characters"),
  targetMarket: z.string().min(5, "Target market must be at least 5 characters"),
  stage: z.enum(["CONCEPT", "BUILDING", "LAUNCHED"]),
  tags: z.string().min(1, "Add at least one tag"),
  secretDetails: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function IdeaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stage: "CONCEPT" },
  });

  async function onSubmit(data: FormData, publish: boolean) {
    setLoading(true);
    setError("");

    const tags = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const response = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        tags,
        isPublished: publish,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Idea Title <span className="text-red-400">*</span>
        </Label>
        <Input
          {...register("title")}
          placeholder="e.g. AI-powered meal planner for busy parents"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.title && (
          <p className="text-red-400 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Tagline <span className="text-red-400">*</span>
        </Label>
        <Input
          {...register("tagline")}
          placeholder="e.g. Save 2 hours every week on meal planning"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.tagline && (
          <p className="text-red-400 text-sm">{errors.tagline.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Description <span className="text-red-400">*</span>
        </Label>
        <textarea
          {...register("description")}
          placeholder="Describe your idea in detail..."
          rows={4}
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="text-red-400 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Problem */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Problem you're solving <span className="text-red-400">*</span>
        </Label>
        <textarea
          {...register("problem")}
          placeholder="What problem does this solve?"
          rows={3}
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.problem && (
          <p className="text-red-400 text-sm">{errors.problem.message}</p>
        )}
      </div>

      {/* Solution */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Your solution <span className="text-red-400">*</span>
        </Label>
        <textarea
          {...register("solution")}
          placeholder="How does your idea solve this problem?"
          rows={3}
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.solution && (
          <p className="text-red-400 text-sm">{errors.solution.message}</p>
        )}
      </div>

      {/* Target Market */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Target Market <span className="text-red-400">*</span>
        </Label>
        <Input
          {...register("targetMarket")}
          placeholder="e.g. Working parents aged 25-45"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.targetMarket && (
          <p className="text-red-400 text-sm">{errors.targetMarket.message}</p>
        )}
      </div>

      {/* Stage */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Stage <span className="text-red-400">*</span>
        </Label>
        <select
          {...register("stage")}
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="CONCEPT">💡 Concept — just an idea</option>
          <option value="BUILDING">🔨 Building — actively working on it</option>
          <option value="LAUNCHED">🚀 Launched — already live</option>
        </select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Tags <span className="text-red-400">*</span>
        </Label>
        <Input
          {...register("tags")}
          placeholder="e.g. AI, SaaS, Health, B2C (comma separated)"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        {errors.tags && (
          <p className="text-red-400 text-sm">{errors.tags.message}</p>
        )}
      </div>

      {/* Secret Details */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Secret Details{" "}
          <span className="text-slate-500 text-xs">(optional — only visible after match)</span>
        </Label>
        <textarea
          {...register("secretDetails")}
          placeholder="Any confidential details you only want to share after matching..."
          rows={3}
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-slate-700 text-slate-300"
          disabled={loading}
          onClick={handleSubmit((data) => onSubmit(data, false))}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
          disabled={loading}
          onClick={handleSubmit((data) => onSubmit(data, true))}
        >
          {loading ? "Publishing..." : "Publish Idea"}
        </Button>
      </div>
    </form>
  );
}