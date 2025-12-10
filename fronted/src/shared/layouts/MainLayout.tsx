import React from "react";
import { Snowfall } from "../../entities/inicio/components/Snowfall";
import { Header } from "../components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showUserInfo?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showUserInfo = true,
}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#450a0a,_#020617,_#000000)] text-white relative overflow-x-hidden">
      {/* Snowfall animation */}
      <Snowfall />
      
      {/* Glow effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 -translate-y-1/4" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-orange-900/10 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />
      
      {/* Content */}
      <div className="relative z-10">
        {showHeader && <Header showUserInfo={showUserInfo} />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
