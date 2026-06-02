import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";
import {
  useNutritionLogs,
  useCreateNutritionLog,
  useDeleteNutritionLog,
  NutritionLog,
} from "../../api/nutrition/use-nutrition-logs";

export const Route = createFileRoute("/nutrition/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: logs, isLoading } = useNutritionLogs();
  const createLog = useCreateNutritionLog();
  const deleteLog = useDeleteNutritionLog();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLog.mutate(
      {
        date: form.date,
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ date: today, calories: "", protein: "", carbs: "", fat: "", notes: "" });
        },
      }
    );
  };

  return (
    <PageWrapper pageName="Nutrition">
      <div className="flex flex-col gap-4 mt-4">
        <button
          className="self-start px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Log Nutrition"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded max-w-md">
            <label className="flex flex-col gap-1 text-sm">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="border rounded p-1"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Calories
              <input
                type="number"
                min={0}
                value={form.calories}
                onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                className="border rounded p-1"
                placeholder="e.g. 2000"
                required
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex flex-col gap-1 text-sm">
                Protein (g)
                <input
                  type="number"
                  min={0}
                  value={form.protein}
                  onChange={(e) => setForm((f) => ({ ...f, protein: e.target.value }))}
                  className="border rounded p-1"
                  placeholder="0"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Carbs (g)
                <input
                  type="number"
                  min={0}
                  value={form.carbs}
                  onChange={(e) => setForm((f) => ({ ...f, carbs: e.target.value }))}
                  className="border rounded p-1"
                  placeholder="0"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Fat (g)
                <input
                  type="number"
                  min={0}
                  value={form.fat}
                  onChange={(e) => setForm((f) => ({ ...f, fat: e.target.value }))}
                  className="border rounded p-1"
                  placeholder="0"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              Notes (optional)
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="border rounded p-1"
                placeholder="e.g. cheat day, high protein day"
              />
            </label>
            <button
              type="submit"
              disabled={createLog.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {createLog.isPending ? "Saving..." : "Save"}
            </button>
          </form>
        )}

        {isLoading && <div>Loading...</div>}

        <div className="flex flex-col gap-2">
          {logs?.map((log) => (
            <NutritionCard key={log._id} log={log} onDelete={() => deleteLog.mutate(log._id)} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function NutritionCard({ log, onDelete }: { log: NutritionLog; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between border p-3 rounded gap-4">
      <div className="flex gap-4 flex-wrap">
        <div className="font-medium">{new Date(log.date).toLocaleDateString()}</div>
        <div>{log.calories} kcal</div>
        <div className="text-sm text-gray-600">P: {log.protein}g</div>
        <div className="text-sm text-gray-600">C: {log.carbs}g</div>
        <div className="text-sm text-gray-600">F: {log.fat}g</div>
        {log.notes && <div className="text-gray-500 text-sm">{log.notes}</div>}
      </div>
      <button onClick={onDelete} className="text-red-400 text-sm">Delete</button>
    </div>
  );
}
