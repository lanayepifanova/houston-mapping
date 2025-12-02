import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createFirm } from "@services/firms";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  website: "",
  description: "",
  tags: "",
  fundSize: "",
  stageFocus: "",
  latitude: "",
  longitude: "",
  address: ""
};

export const AddFirmForm = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const mutation = useMutation({
    mutationFn: createFirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firms"] });
      setForm(initialState);
      setTouched({});
      toast.success("Firm added");
    },
    onError: () => {
      toast.error("Failed to add firm");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latitude = parseFloat(form.latitude);
    const longitude = parseFloat(form.longitude);
    if (!form.name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setTouched({
        name: true,
        latitude: true,
        longitude: true
      });
      return;
    }

    mutation.mutate({
      name: form.name,
      website: form.website || undefined,
      description: form.description || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      fundSize: form.fundSize || undefined,
      stageFocus: form.stageFocus || undefined,
      latitude,
      longitude,
      address: form.address || undefined
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-xl font-semibold">Add firm</h2>
      <p className="text-xs text-slate-500">Tags: use commas to separate (e.g., energy, seed).</p>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Name*"
          value={form.name}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        {touched.name && !form.name && <p className="text-xs text-red-600">Name is required</p>}
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Fund size"
          value={form.fundSize}
          onChange={(e) => setForm({ ...form, fundSize: e.target.value })}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Stage focus"
          value={form.stageFocus}
          onChange={(e) => setForm({ ...form, stageFocus: e.target.value })}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Latitude*"
          value={form.latitude}
          onBlur={() => setTouched((t) => ({ ...t, latitude: true }))}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          required
        />
        {touched.latitude && Number.isNaN(parseFloat(form.latitude)) && (
          <p className="text-xs text-red-600">Latitude must be a number</p>
        )}
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Longitude*"
          value={form.longitude}
          onBlur={() => setTouched((t) => ({ ...t, longitude: true }))}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          required
        />
        {touched.longitude && Number.isNaN(parseFloat(form.longitude)) && (
          <p className="text-xs text-red-600">Longitude must be a number</p>
        )}
        <input
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <textarea
          className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2 md:col-span-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700 sm:col-span-2 md:col-span-3"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving…" : "Add firm"}
        </button>
      </form>
    </div>
  );
};
