"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddEvaluationModal } from "@/components/evaluations/AddEvaluationModal";

interface CampEvaluationsProps {
  campId: string;
}

interface AddEvaluation {
  playerName: string;
  playerId: string;
  evaluatorName: string;
  evaluationDate: string;
  evaluationType: string;
  category: string;
  overallRating: number;
  skills: {
    skating: number;
    shooting: number;
    passing: number;
    stickHandling: number;
    positioning: number;
    hockey_iq: number;
    compete: number;
    physicality: number;
  };
  strengths: string;
  improvements: string;
  comments: string;
  recommendedLevel: string;
  nextSteps: string;
}

const mockEvaluationData = {
  criteria: [
    { id: "c1", name: "Patinage", avgScore: 4.2, evaluations: 120 },
    { id: "c2", name: "Maniement", avgScore: 4.0, evaluations: 118 },
    { id: "c3", name: "Tir", avgScore: 3.8, evaluations: 119 },
    { id: "c4", name: "Vision du jeu", avgScore: 4.3, evaluations: 121 },
    { id: "c5", name: "Physique", avgScore: 4.1, evaluations: 120 },
  ],
  playerSummaries: [
    {
      id: "p1",
      name: "Alexandre Dubois",
      number: 17,
      avgScore: 4.2,
      evaluationCount: 5,
      tags: ["cimente"],
      trend: "up",
    },
    {
      id: "p2",
      name: "Maxime Tremblay",
      number: 9,
      avgScore: 4.0,
      evaluationCount: 3,
      tags: ["a-surveiller"],
      trend: "stable",
    },
    {
      id: "p3",
      name: "Gabriel Roy",
      number: 4,
      avgScore: 3.5,
      evaluationCount: 4,
      tags: ["surevalue"],
      trend: "down",
    },
    {
      id: "p4",
      name: "Samuel Gagné",
      number: 31,
      avgScore: 4.5,
      evaluationCount: 4,
      tags: ["cimente"],
      trend: "up",
    },
  ],
};

export function CampEvaluations({}: CampEvaluationsProps) {
  const [tagFilter, setTagFilter] = useState("all");
  const [isAddEvalOpen, setIsAddEvalOpen] = useState(false);
  const [playerSummaries, setPlayerSummaries] = useState(
    mockEvaluationData.playerSummaries
  );
  const [evaluations, setEvaluations] = useState<any[]>([]); // local evaluations for this camp

  // --- Modal state (copied from dashboard/evaluations) ---
  const [newEvaluation, setNewEvaluation] = useState({
    playerId: "",
    playerName: "",
    playerNumber: "",
    position: "",
    skills: {
      skating: 5,
      shooting: 5,
      passing: 5,
      defense: 5,
      gameIQ: 5,
      attitude: 5,
    },
    comments: "",
    evaluatedBy: "Coach Martin",
    evaluationContext: "game",
    evaluationTargetId: "",
    customCriteria: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("U15");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  const handlePlayerSelect = (playerId: string) => {
    const player = playerSummaries.find((p) => p.id === playerId);
    if (player) {
      setNewEvaluation((prev) => ({
        ...prev,
        playerId,
        playerName: player.name,
        playerNumber: player.number?.toString() || "",
        position: player.position || "",
      }));
      setSelectedPlayerId(playerId);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPlayerId("");
    setNewEvaluation((prev) => ({
      ...prev,
      playerId: "",
      playerName: "",
      playerNumber: "",
      position: "",
    }));
  };

  const handleAddCustomCriterion = () => {
    setNewEvaluation((prev) => ({
      ...prev,
      customCriteria: [...(prev.customCriteria || []), { name: "", score: 5 }],
    }));
  };

  const handleRemoveCustomCriterion = (idx: number) => {
    setNewEvaluation((prev) => ({
      ...prev,
      customCriteria: prev.customCriteria.filter(
        (_: any, i: number) => i !== idx
      ),
    }));
  };

  const handleCustomCriterionChange = (
    idx: number,
    field: "name" | "score",
    value: string | number
  ) => {
    setNewEvaluation((prev) => ({
      ...prev,
      customCriteria: prev.customCriteria.map((c: any, i: number) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handleAddEvaluation = () => {
    if (!selectedPlayerId) return;
    if (!newEvaluation.evaluationTargetId) return;
    // Add to local evaluations (simulate)
    const newEval = {
      id: `eval-${Date.now()}`,
      playerName: newEvaluation.playerName,
      playerNumber: parseInt(newEvaluation.playerNumber),
      position: newEvaluation.position,
      skills: newEvaluation.skills,
      comments: newEvaluation.comments,
      evaluatedBy: newEvaluation.evaluatedBy,
      date: new Date(),
      evaluationContext: newEvaluation.evaluationContext,
      evaluationTargetId: newEvaluation.evaluationTargetId,
      customCriteria: newEvaluation.customCriteria?.filter(
        (c: any) => c.name.trim() !== ""
      ),
    };
    setEvaluations((prev) => [newEval, ...prev]);
    setIsAddEvalOpen(false);
    // Reset form
    setNewEvaluation({
      playerId: "",
      playerName: "",
      playerNumber: "",
      position: "",
      skills: {
        skating: 5,
        shooting: 5,
        passing: 5,
        defense: 5,
        gameIQ: 5,
        attitude: 5,
      },
      comments: "",
      evaluatedBy: "Coach Martin",
      evaluationContext: "game",
      evaluationTargetId: "",
      customCriteria: [],
    });
    setSelectedCategory("U15");
    setSelectedPlayerId("");
  };

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case "cimente":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            ✓ Cimenté
          </Badge>
        );
      case "a-surveiller":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            ⚠ À surveiller
          </Badge>
        );
      case "surevalue":
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200">
            ↗ Surévalué
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case "up":
        return <span className="text-green-600 font-bold">↗</span>;
      case "down":
        return <span className="text-red-600 font-bold">↘</span>;
      default:
        return <span className="text-gray-400">—</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-gray-900";
    return "text-red-600";
  };

  const filteredPlayers = playerSummaries.filter((player) => {
    if (tagFilter === "all") return true;
    return player.tags.includes(tagFilter);
  });

  return (
    <div className="space-y-8">
      {/* Criteria Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Vue d&apos;ensemble par critère
          </h3>
          <Button variant="outline" size="sm">
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mockEvaluationData.criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="bg-gray-50 rounded-lg p-4 border"
            >
              <h4 className="font-medium text-gray-900 mb-3">
                {criterion.name}
              </h4>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      criterion.avgScore
                    )}`}
                  >
                    {criterion.avgScore}
                  </span>
                  <span className="text-sm text-gray-600">/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${criterion.avgScore * 20}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {criterion.evaluations} évaluations
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Evaluations Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Résumé des évaluations par joueur
          </h3>
          <div className="flex gap-3">
            <Button variant="default" onClick={() => setIsAddEvalOpen(true)}>
              + Ajouter une évaluation
            </Button>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les tags</SelectItem>
                <SelectItem value="cimente">Cimenté</SelectItem>
                <SelectItem value="a-surveiller">À surveiller</SelectItem>
                <SelectItem value="surevalue">Surévalué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Inline Modal (copied from dashboard/evaluations) */}
        {isAddEvalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Nouvelle évaluation
                  </h2>
                  <button
                    onClick={() => setIsAddEvalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* Sélection catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "U5",
                      "U7",
                      "U9",
                      "U11",
                      "U13",
                      "U15",
                      "U18",
                      "Junior",
                      "Senior",
                    ].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Sélection joueur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joueur
                  </label>
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => handlePlayerSelect(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Sélectionnez un joueur...</option>
                    {playerSummaries.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Informations joueur (lecture seule) */}
                {selectedPlayerId && (
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nom du joueur
                      </label>
                      <div className="text-sm text-gray-900">
                        {newEvaluation.playerName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Numéro
                      </label>
                      <div className="text-sm text-gray-900">
                        {newEvaluation.playerNumber}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Position
                      </label>
                      <div className="text-sm text-gray-900">
                        {newEvaluation.position}
                      </div>
                    </div>
                  </div>
                )}
                {/* Compétences */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Évaluation des compétences (1-10)
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(newEvaluation.skills).map(
                      ([skill, score]) => (
                        <div
                          key={skill}
                          className="flex items-center justify-between"
                        >
                          <label className="text-sm text-gray-700 w-24">
                            {skill === "gameIQ"
                              ? "Vision de jeu"
                              : skill === "skating"
                              ? "Patinage"
                              : skill === "shooting"
                              ? "Tir"
                              : skill === "passing"
                              ? "Passes"
                              : skill === "defense"
                              ? "Défense"
                              : skill === "attitude"
                              ? "Attitude"
                              : skill}
                          </label>
                          <div className="flex items-center gap-3 flex-1 max-w-xs">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={score}
                              onChange={(e) =>
                                setNewEvaluation((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    [skill]: parseInt(e.target.value),
                                  },
                                }))
                              }
                              className="flex-1"
                            />
                            <span className="text-sm font-medium text-gray-900 w-8">
                              {score}/10
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Critères personnalisés */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3 mt-6">
                    Critères personnalisés
                  </h3>
                  {(newEvaluation.customCriteria || []).map(
                    (criterion, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-2">
                        <input
                          type="text"
                          value={criterion.name}
                          onChange={(e) =>
                            handleCustomCriterionChange(
                              idx,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Nom du critère"
                          className="flex-1 p-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={criterion.score}
                          onChange={(e) =>
                            handleCustomCriterionChange(
                              idx,
                              "score",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-32"
                        />
                        <span className="w-8 text-center">
                          {criterion.score}/10
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomCriterion(idx)}
                          className="text-red-500 hover:text-red-700 text-lg px-2"
                          title="Supprimer ce critère"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={handleAddCustomCriterion}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    + Ajouter un critère personnalisé
                  </button>
                </div>
                {/* Commentaires */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaires
                  </label>
                  <textarea
                    value={newEvaluation.comments}
                    onChange={(e) =>
                      setNewEvaluation((prev) => ({
                        ...prev,
                        comments: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Points forts, points à améliorer, observations générales..."
                  />
                </div>
                {/* Évaluateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Évaluateur
                  </label>
                  <select
                    value={newEvaluation.evaluatedBy}
                    onChange={(e) =>
                      setNewEvaluation((prev) => ({
                        ...prev,
                        evaluatedBy: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Coach Martin">Coach Martin</option>
                    <option value="Coach Sarah">Coach Sarah</option>
                    <option value="Coach Alex">Coach Alex</option>
                  </select>
                </div>
                {/* Contexte d'évaluation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contexte d&apos;évaluation
                  </label>
                  <select
                    value={newEvaluation.evaluationContext}
                    onChange={(e) =>
                      setNewEvaluation((prev) => ({
                        ...prev,
                        evaluationContext: e.target.value,
                        evaluationTargetId: "",
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="game">Match</option>
                    <option value="camp">Camp d&apos;entraînement</option>
                    <option value="training">Entraînement</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                {/* Sélection du match, camp, ou entraînement */}
                {newEvaluation.evaluationContext === "game" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionnez le match
                    </label>
                    <select
                      value={newEvaluation.evaluationTargetId}
                      onChange={(e) =>
                        setNewEvaluation((prev) => ({
                          ...prev,
                          evaluationTargetId: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">Choisir un match...</option>
                      {/* TODO: Replace with real games */}
                      <option value="game1">
                        Match vs Dragons - 2024-02-10
                      </option>
                      <option value="game2">Match vs Lynx - 2024-02-17</option>
                    </select>
                  </div>
                )}
                {newEvaluation.evaluationContext === "camp" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionnez le camp d&apos;entraînement
                    </label>
                    <select
                      value={newEvaluation.evaluationTargetId}
                      onChange={(e) =>
                        setNewEvaluation((prev) => ({
                          ...prev,
                          evaluationTargetId: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">Choisir un camp...</option>
                      {/* TODO: Replace with real camps */}
                      <option value="camp1">Camp de printemps 2024</option>
                      <option value="camp2">Camp d'été 2024</option>
                    </select>
                  </div>
                )}
                {newEvaluation.evaluationContext === "training" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sélectionnez l&apos;entraînement
                    </label>
                    <select
                      value={newEvaluation.evaluationTargetId}
                      onChange={(e) =>
                        setNewEvaluation((prev) => ({
                          ...prev,
                          evaluationTargetId: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">Choisir un entraînement...</option>
                      {/* TODO: Replace with real trainings */}
                      <option value="training1">
                        Entraînement du 2024-02-05
                      </option>
                      <option value="training2">
                        Entraînement du 2024-02-12
                      </option>
                    </select>
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddEvalOpen(false)}
                  className="text-sm"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAddEvaluation}
                  className="text-sm bg-red-600 hover:bg-red-700"
                  disabled={!selectedPlayerId}
                >
                  Enregistrer l&apos;évaluation ici
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Joueur
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Note moyenne
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Évaluations
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Tendance
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border">
                        <span className="text-xs font-medium text-gray-600">
                          #{player.number}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {player.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold text-lg ${getScoreColor(
                          player.avgScore
                        )}`}
                      >
                        {player.avgScore}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(player.avgScore / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-900">
                        {player.evaluationCount}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xl">
                    {getTrendIndicator(player.trend)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {player.tags.map((tag, index) => (
                        <span key={`${player.id}-tag-${index}`}>
                          {getTagBadge(tag)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tag Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-green-900">Joueurs cimentés</h4>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">
            {
              mockEvaluationData.playerSummaries.filter((p) =>
                p.tags.includes("cimente")
              ).length
            }
          </div>
          <p className="text-sm text-green-700">
            Note élevée avec faible écart
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-red-900">À surveiller</h4>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              !
            </div>
          </div>
          <div className="text-3xl font-bold text-red-900 mb-2">
            {
              mockEvaluationData.playerSummaries.filter((p) =>
                p.tags.includes("a-surveiller")
              ).length
            }
          </div>
          <p className="text-sm text-red-700">Écart d&apos;opinion important</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Surévalués</h4>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
              ↗
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {
              mockEvaluationData.playerSummaries.filter((p) =>
                p.tags.includes("surevalue")
              ).length
            }
          </div>
          <p className="text-sm text-gray-700">Note basse avec faible écart</p>
        </div>
      </div>
    </div>
  );
}
