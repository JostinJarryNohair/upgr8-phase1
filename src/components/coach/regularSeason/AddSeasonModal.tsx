"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Season } from "@/types/coach";

// You can move this to your types file if you want
interface Game {
  homeTeam: string;
  awayTeam: string;
  date: string;
  location: string;
}

interface AddSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Season, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Season | null;
}

export function AddSeasonModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddSeasonModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    division: "",
    location: "",
    startDate: "",
    endDate: "",
    isActive: true,
    logo: null as File | null,
    games: [] as Game[],
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csvData, setCsvData] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        team: initialData.team,
        division: initialData.division,
        location: initialData.location,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        isActive: initialData.isActive,
        logo: null,
        games: initialData.games || [],
      });
    } else {
      setFormData({
        name: "",
        team: "",
        division: "",
        location: "",
        startDate: "",
        endDate: "",
        isActive: true,
        logo: null,
        games: [],
      });
    }
  }, [initialData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim())
      newErrors.name = "Le nom de la saison est requis";
    if (!formData.team) newErrors.team = "L'équipe est requise";
    if (!formData.division) newErrors.division = "La division est requise";
    if (!formData.location.trim()) newErrors.location = "Le lieu est requis";
    if (!formData.startDate)
      newErrors.startDate = "La date de début est requise";
    if (!formData.endDate) newErrors.endDate = "La date de fin est requise";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      ...formData,
      logo: formData.logo ? logoPreview || undefined : undefined,
      games: formData.games.map((game) => ({
        ...game,
        id: "",
        seasonId: "",
        status: "upcoming",
        createdAt: "",
        updatedAt: "",
      })),
    });
  };

  const addGame = () => {
    setFormData({
      ...formData,
      games: [
        ...formData.games,
        { homeTeam: "", awayTeam: "", date: "", location: "" },
      ],
    });
  };

  const updateGame = (index: number, field: keyof Game, value: string) => {
    const newGames = [...formData.games];
    newGames[index] = { ...newGames[index], [field]: value };
    setFormData({ ...formData, games: newGames });
  };

  const removeGame = (index: number) => {
    setFormData({
      ...formData,
      games: formData.games.filter((_, i) => i !== index),
    });
  };

  const handleCsvImport = () => {
    const lines = csvData
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const importedGames: Game[] = [];
    for (const line of lines) {
      const [homeTeam, awayTeam, date, location] = line.split(",");
      if (homeTeam && awayTeam && date && location) {
        importedGames.push({
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          date: date.trim(),
          location: location.trim(),
        });
      }
    }
    setFormData({ ...formData, games: [...formData.games, ...importedGames] });
    setCsvData("");
  };

  const downloadCsvTemplate = () => {
    const csv = "Équipe domicile,Équipe visiteur,Date (YYYY-MM-DD),Lieu\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele_matchs_saison.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? "Modifier la saison" : "Création d'une saison"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configurez votre nouvelle saison régulière
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">
              Identité de la saison
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la saison *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Saison 2024-2025 M15 AAA"
                    className={errors.name ? "border-red-500" : ""}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team">Équipe *</Label>
                    <Input
                      id="team"
                      value={formData.team}
                      onChange={(e) =>
                        setFormData({ ...formData, team: e.target.value })
                      }
                      placeholder="M15 AAA"
                      className={errors.team ? "border-red-500" : ""}
                      required
                    />
                    {errors.team && (
                      <p className="text-sm text-red-600 mt-1">{errors.team}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="location">Lieu *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Ligue M15 AAA"
                      className={errors.location ? "border-red-500" : ""}
                      required
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className={errors.startDate ? "border-red-500" : ""}
                      required
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      min={formData.startDate}
                      className={errors.endDate ? "border-red-500" : ""}
                      required
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label>Logo ou identité visuelle (optionnel)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-24 h-24 object-contain mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, logo: null });
                          setLogoPreview(null);
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <label htmlFor="logo" className="cursor-pointer">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ajouter un logo
                          </span>
                          <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG jusqu&apos;à 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">
              Matchs de la saison
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-700">
                  Importez une liste de matchs via CSV ou ajoutez-les
                  manuellement.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadCsvTemplate}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le modèle CSV
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Collez ici le contenu de votre fichier CSV (Équipe domicile,Équipe visiteur,Date (YYYY-MM-DD),Lieu)"
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  rows={3}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCsvImport}
                  className="border-green-200 text-green-600 hover:bg-green-50 h-fit"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-700">
                Ajoutez un match manuellement
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGame}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un match
              </Button>
            </div>
            <div className="space-y-3">
              {formData.games.map((game, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <Input
                    value={game.homeTeam}
                    onChange={(e) =>
                      updateGame(index, "homeTeam", e.target.value)
                    }
                    placeholder="Équipe domicile"
                    className="w-40"
                  />
                  <span className="mx-2 text-gray-500 font-bold">vs</span>
                  <Input
                    value={game.awayTeam}
                    onChange={(e) =>
                      updateGame(index, "awayTeam", e.target.value)
                    }
                    placeholder="Équipe visiteur"
                    className="w-40"
                  />
                  <Input
                    type="date"
                    value={game.date}
                    onChange={(e) => updateGame(index, "date", e.target.value)}
                    className="w-40"
                  />
                  <Input
                    value={game.location}
                    onChange={(e) =>
                      updateGame(index, "location", e.target.value)
                    }
                    placeholder="Lieu"
                    className="w-40"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGame(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-10 w-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {formData.games.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-white">
                  <p className="text-sm text-gray-500 mb-2">
                    Aucun match ajouté
                  </p>
                  <p className="text-xs text-gray-400">
                    Utilisez l&apos;import CSV ou cliquez sur &quot;Ajouter un
                    match&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {initialData ? "Mettre à jour la saison" : "Créer la saison"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
