"use client";

import { useState } from "react";
import { Plus, Calendar, Trophy, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for development
const mockSeasons = [
  {
    id: "season-1",
    name: "Saison 2024-2025 M15 AAA",
    team: "Les Titans",
    division: "M15 AAA",
    startDate: "2024-09-01",
    endDate: "2025-03-31",
    location: "Ligue M15 AAA",
    description: "Saison régulière M15 AAA",
    status: "upcoming",
    games: [],
    standings: [],
  },
];

const mockMatchups = [
  {
    id: "match-1",
    homeTeam: "Les Titans",
    awayTeam: "Les Dragons",
    date: "2024-09-15T14:00:00",
    location: "Centre Sportif Montréal",
    division: "M15 AAA",
    status: "upcoming",
  },
  {
    id: "match-2",
    homeTeam: "Les Aigles",
    awayTeam: "Les Titans",
    date: "2024-09-22T15:30:00",
    location: "Centre Sportif Laval",
    division: "M15 AAA",
    status: "upcoming",
  },
  {
    id: "match-3",
    homeTeam: "Les Titans",
    awayTeam: "Les Lions",
    date: "2024-09-29T14:00:00",
    location: "Centre Sportif Montréal",
    division: "M15 AAA",
    status: "upcoming",
  },
];

export default function RegularSeasonPage() {
  const [seasons] = useState(mockSeasons);
  const [matchups] = useState(mockMatchups);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Saisons régulières</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos saisons régulières et suivez les performances de vos
            équipes
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle saison
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Saisons actives
              </p>
              <p className="text-2xl font-semibold mt-1">2</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Matchs à venir
              </p>
              <p className="text-2xl font-semibold mt-1">{matchups.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Joueurs impliqués
              </p>
              <p className="text-2xl font-semibold mt-1">45</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Seasons List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Saisons en cours</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{season.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{season.team}</span>
                    <span>•</span>
                    <span>{season.division}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <p>
                      {new Date(season.startDate).toLocaleDateString()} -{" "}
                      {new Date(season.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline">Gérer</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Games */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Prochains matchs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {matchups.map((match) => (
            <div
              key={match.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{match.homeTeam}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="font-semibold">{match.awayTeam}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{match.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <p>
                      {new Date(match.date).toLocaleDateString()} à{" "}
                      {new Date(match.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
