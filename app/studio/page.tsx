import ScriptList from "@/components/studio/ScriptList";

export default function StudioDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-pri mb-6">
        Todos los guiones
      </h1>
      <ScriptList />
    </div>
  );
}
