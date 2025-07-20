import Sidebar from "../dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-stone-100">
      <Sidebar isOpen={true} />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}
