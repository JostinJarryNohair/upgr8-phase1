"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TeamsPage from "../teams/page";
import StaffPage from "../staff/page";
import TrainingsPage from "../trainings/page";
import EvaluationsPage from "../evaluations/page";
import PlayersPage from "../players/page";

export default function CoachDashboard() {
  const [activeView, setActiveView] = useState<
    "teams" | "players" | "training" | "evaluations" | "staff" | "messages"
  >("teams");

  // Render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case "teams":
        return <TeamsPage />;
      case "players":
        return <PlayersPage />;
      case "training":
        return <TrainingsPage />;
      case "evaluations":
        return <EvaluationsPage />;
      case "staff":
        return <StaffPage />;
      default:
        return <TeamsPage />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau camp
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-10 justify-center mt-10">
        <button
          onClick={() => setActiveView("teams")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "teams"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Équipes
        </button>
        <button
          onClick={() => setActiveView("players")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "players"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Joueurs
        </button>
        <button
          onClick={() => setActiveView("training")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "training"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Entrainement
        </button>
        <button
          onClick={() => setActiveView("evaluations")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "evaluations"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Évaluations
        </button>
        <button
          onClick={() => setActiveView("staff")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "staff"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Personnel
        </button>
        <button
          onClick={() => setActiveView("messages")}
          className={`px-4 py-2 text-gray-700 border border-gray-300 rounded-md transition-colors ${
            activeView === "messages"
              ? "bg-blue-50 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Messages
        </button>
      </div>

      {/* Dynamic Content Section */}
      <div className="mt-8">{renderActiveView()}</div>
    </div>
  );
}
