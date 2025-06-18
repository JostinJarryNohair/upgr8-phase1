"use client";

import { useState } from "react";
import { Season } from "@/types/coach";
import { RegularSeasonManagement } from "@/components/coach/regularSeason/RegularSeasonManagement";

const mockSeasons: Season[] = [
  {
    id: "season-1",
    name: "Saison 2024-2025 M15 AAA",
    team: "Les Titans",
    division: "M15 AAA",
    startDate: "2024-09-01",
    endDate: "2025-03-31",
    location: "Ligue M15 AAA",
    games: [
      {
        id: "g1",
        seasonId: "season-1",
        homeTeam: "Les Titans",
        awayTeam: "Les Dragons",
        date: "2024-09-15T14:00:00",
        location: "Centre Sportif Montréal",
        status: "upcoming",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "g2",
        seasonId: "season-1",
        homeTeam: "Les Aigles",
        awayTeam: "Les Titans",
        date: "2024-09-22T15:30:00",
        location: "Centre Sportif Laval",
        status: "upcoming",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "season-2",
    name: "Saison 2024-2025 U18 Elite",
    team: "Les Eagles",
    division: "U18 Elite",
    startDate: "2024-09-15",
    endDate: "2025-04-15",
    location: "Ligue U18 Elite",
    games: [
      {
        id: "g3",
        seasonId: "season-2",
        homeTeam: "Les Eagles",
        awayTeam: "Les Faucons",
        date: "2024-09-20T19:30:00",
        location: "Complexe Sportif",
        status: "upcoming",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];

export default function RegularSeasonPage() {
  const [seasons, setSeasons] = useState<Season[]>(mockSeasons);

  const handleAddSeason = (
    newSeason: Omit<Season, "id" | "createdAt" | "updatedAt">
  ) => {
    const season: Season = {
      ...newSeason,
      id: `season-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSeasons([...seasons, season]);
  };

  const handleUpdateSeason = (id: string, updates: Partial<Season>) => {
    setSeasons(
      seasons.map((season) =>
        season.id === id
          ? { ...season, ...updates, updatedAt: new Date().toISOString() }
          : season
      )
    );
  };

  const handleDeleteSeason = (id: string) => {
    setSeasons(seasons.filter((season) => season.id !== id));
  };

  return (
    <RegularSeasonManagement
      seasons={seasons}
      onAddSeason={handleAddSeason}
      onUpdateSeason={handleUpdateSeason}
      onDeleteSeason={handleDeleteSeason}
    />
  );
}
