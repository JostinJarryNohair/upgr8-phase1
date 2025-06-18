"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPlayerModal } from "@/components/coach/AddPlayerModal";
import { Player } from "@/types/coach";

interface CampPlayersProps {
  campId: string;
  groups: Array<{ id: string; name: string; color: string }>;
}

const initialPlayers = [
  {
    id: "1",
    name: "Alexandre Dubois",
    number: 17,
    position: "Centre",
    groupId: "g1",
    evaluationStatus: "completed",
    evaluationCount: 5,
    avgScore: 4.2,
    cut: false,
  },
  {
    id: "2",
    name: "Maxime Tremblay",
    number: 9,
    position: "Ailier gauche",
    groupId: "g1",
    evaluationStatus: "partial",
    evaluationCount: 3,
    avgScore: 4.0,
    cut: false,
  },
  {
    id: "4",
    name: "Samuel Gagné",
    number: 31,
    position: "Gardien",
    groupId: "g2",
    evaluationStatus: "completed",
    evaluationCount: 4,
    avgScore: 4.5,
    cut: false,
  },
];

export function CampPlayers({ campId, groups }: CampPlayersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [players, setPlayers] = useState(initialPlayers);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvPreview, setCsvPreview] = useState<
    {
      id: string;
      name: string;
      number: number;
      position: string;
      groupId: string;
      evaluationStatus: string;
      evaluationCount: number;
      avgScore: number;
      cut: boolean;
    }[]
  >([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleToggleCut = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cut: !p.cut } : p))
    );
  };

  const handleAddPlayer = (
    data: Omit<Player, "id" | "createdAt" | "updatedAt">
  ) => {
    // Map AddPlayerModal data to player list structure
    const newPlayer = {
      id: `p${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      number: data.number,
      position: data.position,
      groupId: data.groupIds[0] || groups[0]?.id || "",
      evaluationStatus: "none",
      evaluationCount: 0,
      avgScore: 0,
      cut: false,
    };
    setPlayers((prev) => [newPlayer, ...prev]);
    setIsAddPlayerOpen(false);
  };

  // Simulate CSV parsing
  const handleParseCsv = () => {
    setCsvError(null);
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setCsvError(
        "Le CSV doit contenir un en-tête et au moins une ligne de joueur."
      );
      setCsvPreview([]);
      return;
    }
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const required = [
      "prénom",
      "nom",
      "date de naissance",
      "position",
      "numéro",
      "statut",
    ];
    if (!required.every((r) => headers.includes(r))) {
      setCsvError(
        "Colonnes requises: Prénom, Nom, Date de naissance, Position, Numéro, Statut"
      );
      setCsvPreview([]);
      return;
    }
    const preview = lines.slice(1).map((line, idx) => {
      const values = line.split(",").map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || "";
      });
      return {
        id: `csv-${Date.now()}-${idx}`,
        name: `${obj["prénom"]} ${obj["nom"]}`.trim(),
        number: parseInt(obj["numéro"]) || 0,
        position: obj["position"] || "",
        groupId:
          groups.find((g) => g.name === obj["group"])?.id ||
          groups[0]?.id ||
          "",
        evaluationStatus: "none",
        evaluationCount: 0,
        avgScore: 0,
        cut: false,
      };
    });
    setCsvPreview(preview);
  };

  const handleConfirmCsv = () => {
    setPlayers((prev) => [...csvPreview, ...prev]);
    setIsCsvModalOpen(false);
    setCsvText("");
    setCsvPreview([]);
    setCsvError(null);
  };

  const getStatusBadge = (status: string, count: number) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {count} évaluations
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {count} évaluations
          </Badge>
        );
      case "none":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Non évaluée
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.number.toString().includes(searchQuery);
    const matchesGroup =
      selectedGroup === "all" || player.groupId === selectedGroup;
    const matchesStatus =
      statusFilter === "all" || player.evaluationStatus === statusFilter;

    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Add Player Button and Modal */}
      <div className="flex justify-end p-6 pb-0 gap-2">
        <Button variant="default" onClick={() => setIsAddPlayerOpen(true)}>
          + Ajouter un joueur
        </Button>
        <Button variant="outline" onClick={() => setIsCsvModalOpen(true)}>
          Importer CSV
        </Button>
      </div>
      <AddPlayerModal
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
        onSubmit={handleAddPlayer}
        campId={campId}
      />
      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              Importer des joueurs via CSV
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Collez le contenu CSV ci-dessous. Colonnes requises: Prénom, Nom,
              Date de naissance, Position, Numéro, Statut, Group (optionnel)
            </p>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-2 min-h-[120px] font-mono text-xs"
              placeholder="Prénom,Nom,Date de naissance,Position,Numéro,Statut,Group\nJean,Tremblay,2008-01-01,Défenseur,12,a-evaluer,Group A"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
            <div className="flex gap-2 mb-2">
              <Button
                variant="outline"
                onClick={() => setIsCsvModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleParseCsv} disabled={!csvText.trim()}>
                Prévisualiser
              </Button>
            </div>
            {csvError && (
              <div className="text-red-600 text-sm mb-2">{csvError}</div>
            )}
            {csvPreview.length > 0 && (
              <div className="mb-2">
                <h4 className="font-medium mb-1">
                  Prévisualisation ({csvPreview.length} joueurs):
                </h4>
                <div className="max-h-40 overflow-y-auto border rounded bg-gray-50 p-2 text-xs">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Nom</th>
                        <th className="text-left">Position</th>
                        <th className="text-left">Numéro</th>
                        <th className="text-left">Groupe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map(
                        (p: {
                          id: string;
                          name: string;
                          number: number;
                          position: string;
                          groupId: string;
                          evaluationStatus: string;
                          evaluationCount: number;
                          avgScore: number;
                          cut: boolean;
                        }) => (
                          <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.position}</td>
                            <td>{p.number}</td>
                            <td>
                              {groups.find((g) => g.id === p.groupId)?.name ||
                                ""}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <Button className="mt-2" onClick={handleConfirmCsv}>
                  Ajouter ces joueurs
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les groupes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les groupes</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complété</SelectItem>
              <SelectItem value="partial">Partiel</SelectItem>
              <SelectItem value="none">Non évalué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {filteredPlayers.length} joueurs trouvés
          </p>
          <Button variant="outline" size="sm">
            Plus de filtres
          </Button>
        </div>
      </div>

      {/* Players List */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player, index) => {
            const group = groups.find((g) => g.id === player.groupId);

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative ${
                  player.cut ? "opacity-60 grayscale" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        #{player.number}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-medium text-gray-900 ${
                          player.cut ? "line-through" : ""
                        }`}
                      >
                        {player.name}
                      </h4>
                      <p className="text-sm text-gray-600">{player.position}</p>
                    </div>
                  </div>
                  {group && (
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: group.color }}
                      title={group.name}
                    >
                      {group.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {getStatusBadge(
                    player.evaluationStatus,
                    player.evaluationCount
                  )}
                  {player.avgScore > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Note moyenne</span>
                      <span className="font-medium text-gray-900">
                        {player.avgScore}/5
                      </span>
                    </div>
                  )}
                  {player.cut && (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      Retranché
                    </Badge>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Voir évaluations
                  </Button>
                  <Button
                    size="sm"
                    variant={player.cut ? "secondary" : "destructive"}
                    onClick={() => handleToggleCut(player.id)}
                  >
                    {player.cut ? "Annuler retranchement" : "Retrancher"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
