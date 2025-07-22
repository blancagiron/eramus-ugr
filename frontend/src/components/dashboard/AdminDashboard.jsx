import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/DashboardHeader";
import Hamburguesa from "../dashboard/Hamburguesa";
import TablaUsuarios from "./admin/TablaUsuarios";
import { useState } from "react";

export default function AdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <Hamburguesa onClick={() => setSidebarVisible(prev => !prev)} />
      <Sidebar visible={sidebarVisible}>
        <div className="min-h-screen p-6 max-w-screen-2xl mx-auto w-full space-y-10">
          <DashboardHeader titulo="Panel de administración" subtitulo="Gestión de usuarios del sistema" />
          <TablaUsuarios />
        </div>
      </Sidebar>
    </>
  );
}
