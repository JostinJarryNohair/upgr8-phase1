"use client";

import { useState } from "react";
import { Plus, Clock, Users, Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for development
const mockDrills = [
  {
    id: "drill-1",
    name: "Passing Triangle",
    description:
      "Improve passing accuracy and movement in a triangular formation",
    duration: 15,
    difficulty: "Intermediate",
    category: "Passing",
    players: 6,
    equipment: ["Cones", "Balls"],
    createdAt: "2024-03-15",
    lastUsed: "2024-03-20",
  },
  {
    id: "drill-2",
    name: "Shooting Practice",
    description:
      "Focus on shooting technique and accuracy from different angles",
    duration: 20,
    difficulty: "Advanced",
    category: "Shooting",
    players: 8,
    equipment: ["Goals", "Balls", "Cones"],
    createdAt: "2024-03-10",
    lastUsed: "2024-03-18",
  },
  {
    id: "drill-3",
    name: "Defensive Positioning",
    description: "Work on defensive positioning and communication",
    duration: 25,
    difficulty: "Intermediate",
    category: "Defense",
    players: 10,
    equipment: ["Cones", "Bibs"],
    createdAt: "2024-03-05",
    lastUsed: "2024-03-15",
  },
];

const categories = [
  "All",
  "Passing",
  "Shooting",
  "Defense",
  "Dribbling",
  "Conditioning",
  "Tactics",
];

export default function TrainingPage() {
  const [drills] = useState(mockDrills);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Exercices d&apos;entraînement</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos exercices et créez de nouvelles séances
            d&apos;entraînement
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel exercice
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un exercice..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Exercices créés
              </p>
              <p className="text-2xl font-semibold mt-1">{drills.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temps total</p>
              <p className="text-2xl font-semibold mt-1">
                {drills.reduce((acc, drill) => acc + drill.duration, 0)} min
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Joueurs max</p>
              <p className="text-2xl font-semibold mt-1">
                {Math.max(...drills.map((drill) => drill.players))}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Drills List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Exercices récents</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {drills.map((drill) => (
            <div
              key={drill.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">{drill.name}</h3>
                    <p className="text-gray-600 mt-1">{drill.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{drill.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{drill.players} joueurs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{drill.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <p>Dernière utilisation: {drill.lastUsed}</p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
