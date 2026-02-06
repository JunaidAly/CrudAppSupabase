"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Item = {
  id: string;
  title: string;
  created_at: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("items")
      .select("id,title,created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from("items")
      .insert({ title: title.trim() });

    if (insertError) {
      setError(insertError.message);
    } else {
      setTitle("");
      await loadItems();
    }

    setLoading(false);
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditingTitle(item.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleUpdate = async () => {
    if (!editingId || !editingTitle.trim()) return;

    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("items")
      .update({ title: editingTitle.trim() })
      .eq("id", editingId);

    if (updateError) {
      setError(updateError.message);
    } else {
      cancelEditing();
      await loadItems();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    const { error: deleteError } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      await loadItems();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Supabase CRUD</h1>
          <p className="text-sm text-slate-300">
            Add, edit, and delete items stored in your Supabase table.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h2 className="text-lg font-medium">Create item</h2>
          <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Item title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-400/60"
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Items</h2>
            <button
              className="text-xs text-slate-400 hover:text-slate-200"
              type="button"
              onClick={loadItems}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          {loading && items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No items yet. Add one above.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  {editingId === item.id ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={loading}
                          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-400/60"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:border-slate-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                          className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-400/60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-xs text-slate-500">
          {isEditing
            ? "Editing item. Save or cancel to continue."
            : "Supabase CRUD demo with Next.js + Tailwind CSS."}
        </footer>
      </main>
    </div>
  );
}
