import UniversityCard from "./UniversityCard";

export default function UniversityGrid({ universidades }) {
  return (
    <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 px-4">
      {universidades.map((u) => (
        <UniversityCard key={u._id} uni={u} />
      ))}
    </div>
  );
}
