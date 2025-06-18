"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Activity,
  ArrowLeft,
  Eye,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Season } from "@/types/coach";
import { RegularSeasonPlayers } from "@/components/coach/regularSeason/RegularSeasonPlayers";

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockSeason: Season = {
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
      homeScore: 2,
      awayScore: 3,
      createdAt: "2024-09-15T14:00:00",
      updatedAt: "2024-09-15T14:00:00",
    },
    {
      id: "g2",
      seasonId: "season-1",
      homeTeam: "Les Lions",
      awayTeam: "Les Titans",
      date: "2024-09-22T16:00:00",
      location: "Arena Laval",
      status: "completed",
      homeScore: 2,
      awayScore: 4,
      createdAt: "2024-09-22T16:00:00",
      updatedAt: "2024-09-22T16:00:00",
    },
  ],
  groups: [
    { id: "g1", campId: "season-1", name: "Équipe A", color: "#ef4444" },
    { id: "g2", campId: "season-1", name: "Équipe B", color: "#3b82f6" },
  ],
  players: [
    {
      id: "p1",
      name: "Jean Dupont",
      number: 10,
      position: "Attaquant",
      birthDate: "2009-05-15",
      groupId: "g1",
    },
    {
      id: "p2",
      name: "Pierre Martin",
      number: 5,
      position: "Défenseur",
      birthDate: "2009-08-22",
      groupId: "g1",
    },
  ],
  stats: {
    totalGames: 25,
    playedGames: 18,
    wins: 12,
    losses: 4,
    ties: 2,
    goalsFor: 45,
    goalsAgainst: 28,
    totalPlayers: 20,
    activePlayers: 18,
  },
  createdAt: "2024-09-01T14:00:00",
  updatedAt: "2024-09-01T14:00:00",
  isActive: true,
};

export default function SeasonDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [season] = useState<Season>(mockSeason);

  useEffect(() => {
    params.then((resolvedParams) => {
      console.log("Season ID:", resolvedParams.id);
    });
  }, [params]);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const getStatusColor = () => {
    if (!season.isActive) return "bg-gray-100 text-gray-800";
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);

    if (now < start) return "bg-blue-100 text-blue-800";
    if (now > end) return "bg-green-100 text-green-800";
    return "bg-orange-100 text-orange-800";
  };

  const getStatusText = () => {
    if (!season.isActive) return "Archivé";
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);

    if (now < start) return "À venir";
    if (now > end) return "Complété";
    return "Actif";
  };

  const gameProgress = season.stats
    ? (season.stats.playedGames / season.stats.totalGames) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-3 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {season.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{season.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {new Date(season.startDate).toLocaleDateString("fr-FR")}{" "}
                        - {new Date(season.endDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <Badge className={getStatusColor()}>
                      {getStatusText()}
                    </Badge>
                    <Badge variant="outline">{season.division}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {season.isActive && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Modifier la saison
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExportModalOpen(true)}
                  >
                    Exporter les données
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">
              {season.stats?.totalGames || 0}
            </div>
            <div className="text-sm text-gray-600">Total des matchs</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">
              {season.stats?.wins || 0}
            </div>
            <div className="text-sm text-gray-600">Victoires</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-600">
              {season.stats?.losses || 0}
            </div>
            <div className="text-sm text-gray-600">Défaites</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression de la saison
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(gameProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${gameProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Matchs</span>
            </TabsTrigger>
            <TabsTrigger
              value="players"
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Joueurs</span>
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Classement</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Historique</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Aperçu de la saison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Informations de l&apos;équipe
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Équipe :</span>
                      <span className="text-gray-900 font-medium">
                        {season.team}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Division :</span>
                      <span className="text-gray-900 font-medium">
                        {season.division}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lieu :</span>
                      <span className="text-gray-900 font-medium">
                        {season.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Statistiques de la saison
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Bilan :</span>
                      <span className="text-gray-900 font-medium">
                        {season.stats?.wins}-{season.stats?.losses}-
                        {season.stats?.ties}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Buts :</span>
                      <span className="text-gray-900 font-medium">
                        {season.stats?.goalsFor} BP /{" "}
                        {season.stats?.goalsAgainst} BC
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Joueurs :</span>
                      <span className="text-gray-900 font-medium">
                        {season.stats?.activePlayers}/
                        {season.stats?.totalPlayers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Calendrier des matchs
              </h3>
              <div className="space-y-3">
                {season.games.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        {new Date(game.date).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="font-medium">
                        {game.homeTeam} vs {game.awayTeam}
                      </div>
                      <div className="text-sm text-gray-600">
                        {game.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {game.status === "completed" && (
                        <div className="font-bold">
                          {game.homeScore} - {game.awayScore}
                        </div>
                      )}
                      <Badge
                        variant={
                          game.status === "completed"
                            ? "default"
                            : game.status === "upcoming"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {game.status === "completed"
                          ? "Terminé"
                          : game.status === "upcoming"
                          ? "À venir"
                          : "Planifié"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="players">
            <RegularSeasonPlayers
              seasonId={season.id}
              groups={season.groups || []}
            />
          </TabsContent>

          <TabsContent value="standings">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Classement de la ligue
              </h3>
              <div className="text-center text-gray-500 py-8">
                Les données du classement seront affichées ici
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Historique de la saison
              </h3>
              <div className="text-center text-gray-500 py-8">
                L&apos;historique et les activités de la saison seront affichés
                ici
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals placeholders */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Modifier la saison</h3>
            <p className="text-gray-600 mb-4">
              Le modal d&apos;édition de la saison sera implémenté ici
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Exporter les données de la saison
            </h3>
            <p className="text-gray-600 mb-4">
              Le modal d&apos;export sera implémenté ici
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={() => setIsExportModalOpen(false)}>
                Exporter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
