import React from "react";
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
    <div className="min-h-screen bg-gradient-to-tr from-amber-950 via-amber-950 to-black/90">
      {showHeader && <Header showUserInfo={showUserInfo} />}
      <main>{children}</main>
    </div>
  );
};
