import { useState } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentTable } from "@/components/admin/ContentTable";
import { TutorialEditor } from "@/components/admin/TutorialEditor";
import { AITutorialGenerator } from "@/components/admin/AITutorialGenerator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTutorials, useTutorialMutations, type Tutorial } from "@/hooks/useTutorials";
import { useAuth } from "@/contexts/AuthContext";

interface GeneratedTutorial {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  estimated_minutes: number;
  tags: string[];
  steps: Array<{
    title: string;
    content: string;
    code_example: string;
  }>;
}

export default function AdminTutorials() {
  const { user } = useAuth();
  const { data: tutorials, isLoading } = useTutorials({ authorId: user?.id });
  const { createTutorial, updateTutorial, deleteTutorial, upsertSteps } = useTutorialMutations();

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState<Tutorial | null>(null);
  const [aiGeneratedData, setAiGeneratedData] = useState<GeneratedTutorial | null>(null);

  const handleCreate = () => {
    setSelectedTutorial(null);
    setAiGeneratedData(null);
    setEditorOpen(true);
  };

  const handleAIGenerated = (data: GeneratedTutorial) => {
    setSelectedTutorial(null);
    setAiGeneratedData(data);
    setEditorOpen(true);
  };

  const handleEdit = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setEditorOpen(true);
  };

  const handleDelete = (tutorial: Tutorial) => {
    setTutorialToDelete(tutorial);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tutorialToDelete) {
      deleteTutorial.mutate(tutorialToDelete.id);
      setDeleteDialogOpen(false);
      setTutorialToDelete(null);
    }
  };

  const handleTogglePublish = (tutorial: Tutorial) => {
    updateTutorial.mutate({ id: tutorial.id, published: !tutorial.published });
  };

  const handleSave = async (
    data: { title: string; slug: string; description?: string; difficulty: "beginner" | "intermediate" | "advanced"; estimated_minutes: number; featured_image?: string; external_link?: string; is_paid: boolean; price?: number; upi_id?: string; qr_code_url?: string; published: boolean; tags: string[] },
    steps: { title: string; content: string; code_example: string }[]
  ) => {
    if (selectedTutorial) {
      updateTutorial.mutate({ id: selectedTutorial.id, ...data }, {
        onSuccess: (updatedTutorial) => {
          if (steps.length > 0) {
            upsertSteps.mutate({
              tutorialId: selectedTutorial.id,
              steps: steps.map((s, i) => ({
                tutorial_id: selectedTutorial.id,
                step_order: i + 1,
                title: s.title,
                content: s.content,
                code_example: s.code_example || null,
              })),
            });
          }
          setEditorOpen(false);
        },
      });
    } else {
      createTutorial.mutate(data, {
        onSuccess: (newTutorial) => {
          if (steps.length > 0 && newTutorial) {
            upsertSteps.mutate({
              tutorialId: newTutorial.id,
              steps: steps.map((s, i) => ({
                tutorial_id: newTutorial.id,
                step_order: i + 1,
                title: s.title,
                content: s.content,
                code_example: s.code_example || null,
              })),
            });
          }
          setEditorOpen(false);
        },
      });
    }
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
    intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <AdminLayout title="Tutorials" description="Create step-by-step learning content">
      <div className="flex justify-end gap-2 mb-6">
        <AITutorialGenerator onGenerated={handleAIGenerated} />
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Tutorial
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <ContentTable
          items={tutorials || []}
          columns={[
            {
              key: "difficulty",
              label: "Difficulty",
              render: (tutorial) => (
                <Badge className={difficultyColors[tutorial.difficulty]}>
                  {tutorial.difficulty}
                </Badge>
              ),
            },
            {
              key: "estimated_minutes",
              label: "Duration",
              render: (tutorial) => `${tutorial.estimated_minutes} min`,
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          emptyMessage="No tutorials yet. Create your first one!"
        />
      )}

      <TutorialEditor
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setAiGeneratedData(null);
        }}
        tutorial={selectedTutorial || (aiGeneratedData ? {
          id: "",
          author_id: user?.id || "",
          title: aiGeneratedData.title,
          slug: aiGeneratedData.slug,
          description: aiGeneratedData.description,
          difficulty: aiGeneratedData.difficulty as "beginner" | "intermediate" | "advanced",
          estimated_minutes: aiGeneratedData.estimated_minutes,
          featured_image: null,
          external_link: null,
          is_paid: false,
          price: null,
          upi_id: null,
          qr_code_url: null,
          published: false,
          published_at: null,
          tags: aiGeneratedData.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          steps: aiGeneratedData.steps.map((s, i) => ({
            id: `temp-${i}`,
            tutorial_id: "",
            step_order: i + 1,
            title: s.title,
            content: s.content,
            code_example: s.code_example,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
        } : null)}
        onSave={handleSave}
        isLoading={createTutorial.isPending || updateTutorial.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tutorial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tutorialToDelete?.title}"? This will also delete all steps. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
