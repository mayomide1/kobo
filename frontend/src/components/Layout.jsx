import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  // open by default on desktop, closed by default on mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`app-main ${sidebarOpen ? "app-main--shifted" : ""}`}>
        <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <Outlet />
      </main>
    </>
  );
};

export default Layout;