"use client";

import { useState } from "react";
import {
  Plus,
  Users,
  User,
  Dumbbell,
  ClipboardCheck,
  Users2,
  MessageSquare,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamsPage from "../teams/page";
import StaffPage from "../staff/page";
import EvaluationsPage from "../evaluations/page";
import PlayersPage from "../players/page";
import CampsPage from "./camps/page";

type ViewType =
  | "teams"
  | "players"
  | "training"
  | "evaluations"
  | "staff"
  | "messages"
  | "camps";

interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

export default function CoachDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("teams");

  // Render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case "teams":
        return <TeamsPage />;
      case "players":
        return <PlayersPage />;
      case "training":
        return <CampsPage />;
      case "evaluations":
        return <EvaluationsPage />;
      case "staff":
        return <StaffPage />;
      case "camps":
        return <CampsPage />;
      default:
        return <TeamsPage />;
    }
  };

  const navItems: NavItem[] = [
    { id: "teams", label: "Équipes", icon: Users },
    { id: "players", label: "Joueurs", icon: User },
    { id: "training", label: "Entrainement", icon: Dumbbell },
    { id: "evaluations", label: "Évaluations", icon: ClipboardCheck },
    { id: "staff", label: "Personnel", icon: Users2 },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "camps", label: "Camps", icon: Dumbbell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau camp
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg transition-all ${
                    activeView === item.id
                      ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                      : "bg-white hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}
