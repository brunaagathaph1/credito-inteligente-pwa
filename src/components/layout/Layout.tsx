
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 pb-16">
            <Outlet />
          </main>
          <BottomNav />
        </>
      ) : (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-6 py-8">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
};

export default Layout;
