import UniversityCard from "./UniversityCard";

export default function UniversityGrid({ universidades }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {universidades.map((u) => (
        <UniversityCard key={u._id} uni={u} />
      ))}
    </div>
  );
}
