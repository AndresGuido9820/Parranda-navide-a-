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
    <div className="min-h-screen bg-[#2b0a0a]">
      {showHeader && <Header showUserInfo={showUserInfo} />}
      <main>{children}</main>
    </div>
  );
};
