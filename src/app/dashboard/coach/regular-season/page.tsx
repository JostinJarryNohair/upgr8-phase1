"use client";

import { useState } from "react";
import { Plus, Calendar, Trophy, Users, MapPin, FileText } from "lucide-react";
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

const initialMatchups = [
  {
    id: "match-1",
    homeTeam: "Les Titans",
    awayTeam: "Les Dragons",
    date: "2024-09-15T14:00:00",
    location: "Centre Sportif Montréal",
    division: "M15 AAA",
    status: "upcoming",
    gamePlan: "",
  },
  {
    id: "match-2",
    homeTeam: "Les Aigles",
    awayTeam: "Les Titans",
    date: "2024-09-22T15:30:00",
    location: "Centre Sportif Laval",
    division: "M15 AAA",
    status: "upcoming",
    gamePlan: "",
  },
  {
    id: "match-3",
    homeTeam: "Les Titans",
    awayTeam: "Les Lions",
    date: "2024-09-29T14:00:00",
    location: "Centre Sportif Montréal",
    division: "M15 AAA",
    status: "upcoming",
    gamePlan: "",
  },
];

export default function RegularSeasonPage() {
  const [seasons] = useState(mockSeasons);
  const [matchups, setMatchups] = useState(initialMatchups);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [planInput, setPlanInput] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  type CsvGame = {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    location: string;
    division: string;
    status: string;
    gamePlan: string;
  };
  const [csvPreview, setCsvPreview] = useState<CsvGame[]>([]);
  const [csvError, setCsvError] = useState("");

  const handleOpenPlanModal = (gameId: string, existingPlan: string) => {
    setCurrentGameId(gameId);
    setPlanInput(existingPlan);
    setShowPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!currentGameId) return;
    setMatchups((prev) =>
      prev.map((m) =>
        m.id === currentGameId ? { ...m, gamePlan: planInput } : m
      )
    );
    setShowPlanModal(false);
    setCurrentGameId(null);
    setPlanInput("");
  };

  // CSV parsing logic
  function parseCsvGames(csv: string) {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const header = lines[0].split(",").map((h) => h.trim());
    const required = [
      "date",
      "time",
      "homeTeam",
      "awayTeam",
      "location",
      "division",
    ];
    if (!required.every((col) => header.includes(col))) {
      setCsvError("Colonnes requises: " + required.join(", "));
      return [];
    }
    return lines.slice(1).map((line, idx) => {
      const values = line.split(",").map((v) => v.trim());
      const obj: Record<string, string> = {};
      header.forEach((h, i) => (obj[h] = values[i]));
      return {
        id: `imported-${Date.now()}-${idx}`,
        homeTeam: obj.homeTeam,
        awayTeam: obj.awayTeam,
        date: obj.date + "T" + (obj.time || "00:00"),
        location: obj.location,
        division: obj.division,
        status: "upcoming",
        gamePlan: "",
      };
    });
  }

  const handleCsvPreview = () => {
    setCsvError("");
    try {
      const preview = parseCsvGames(csvInput);
      setCsvPreview(preview);
    } catch {
      setCsvError("Erreur lors de l'analyse du CSV");
      setCsvPreview([]);
    }
  };

  const handleCsvImport = () => {
    setMatchups((prev) => [...csvPreview, ...prev]);
    setShowImportModal(false);
    setCsvInput("");
    setCsvPreview([]);
    setCsvError("");
  };

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

      {/* Import CSV Button */}
      <div className="flex justify-end mb-2">
        <Button variant="outline" onClick={() => setShowImportModal(true)}>
          Importer calendrier (CSV)
        </Button>
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
                  <Button
                    variant={match.gamePlan ? "secondary" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleOpenPlanModal(match.id, match.gamePlan)
                    }
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {match.gamePlan
                      ? "Modifier le plan"
                      : "Ajouter un plan de match"}
                  </Button>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Plan de match</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 min-h-[120px]"
              placeholder="Décrivez le plan de match, les stratégies, les points clés..."
              value={planInput}
              onChange={(e) => setPlanInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSavePlan} disabled={!planInput.trim()}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Importer le calendrier (CSV)
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Collez le contenu CSV ci-dessous. Colonnes requises:{" "}
              <b>date, time, homeTeam, awayTeam, location, division</b>
            </p>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-2 min-h-[100px] font-mono text-xs"
              placeholder="date,time,homeTeam,awayTeam,location,division\n2024-09-15,14:00,Les Titans,Les Dragons,Centre Sportif Montréal,M15 AAA"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
            <div className="flex gap-2 mb-2">
              <Button variant="secondary" onClick={handleCsvPreview}>
                Prévisualiser
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
              >
                Annuler
              </Button>
            </div>
            {csvError && (
              <div className="text-red-500 text-sm mb-2">{csvError}</div>
            )}
            {csvPreview.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-sm mb-1">
                  Aperçu des matchs importés:
                </h4>
                <ul className="max-h-32 overflow-y-auto text-xs bg-gray-50 rounded p-2">
                  {csvPreview.map((g) => (
                    <li key={g.id} className="mb-1">
                      {g.date.replace("T", " ")} - {g.homeTeam} vs {g.awayTeam}{" "}
                      @ {g.location} ({g.division})
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleCsvImport}
                  className="mt-2"
                  disabled={csvPreview.length === 0}
                >
                  Importer ces matchs
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
