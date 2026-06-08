import IdeaForm from "@/components/ideas/IdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Post your idea</h1>
          <p className="text-slate-400 mt-2">
            Share your startup idea and find people who want to build it with you.
          </p>
        </div>
        <IdeaForm />
      </div>
    </div>
  );
}