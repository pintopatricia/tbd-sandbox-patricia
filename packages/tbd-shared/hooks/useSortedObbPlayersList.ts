import { useMemo } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";

import { ObbParticipantsWithStats } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { ObbIncidentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ParticipantQuotesMap } from "../helpers/obb";

export type PlayerInfo = {
  id: string;
  name: string;
  position: string;
  shirtNumber?: number | null;
  team?: string;
};

export type Player = {
  urn: URN;
  player: PlayerInfo;
  stat?: number | null;
  color?: string;
  odds?: string | null;
  jersey?: string | null;
  incidentTypes?: {
    [id: string]: ObbIncidentType;
  };
};

const buildPlayers = (participants: ObbParticipantsWithStats, participantQuotesMap?: ParticipantQuotesMap): Player[] =>
  participants.map((participant) => ({
    urn: participant.urn,
    player: {
      id: participant.player?.id || "",
      name: participant.player?.name || "",
      position: participant.player?.position || "",
      team: participant.team?.name || "",
      shirtNumber: participant.player?.shirtNumber,
    },
    stat: participant.stats[0]?.value,
    jersey: participant.team?.jerseys?.[0]?.url || null,
    incidentTypes: participant.incidentTypes || [],
    odds: participantQuotesMap?.[participant.player?.id ?? ""] ?? null,
    color: participant.team?.color || "",
  }));

const sortPlayers = (players: Player[], sortOrder: string): Player[] =>
  [...players].sort((a, b) => {
    if (!a.stat && !b.stat) {
      return b.player.name.localeCompare(a.player.name) * (sortOrder === "asc" ? 1 : -1);
    }

    if (a.stat && b.stat) {
      return (a.stat - b.stat) * (sortOrder === "asc" ? 1 : -1);
    }

    return a.stat ? -1 : 1;
  });

export const useSortedObbPlayersList = (
  participants: ObbParticipantsWithStats,
  participantQuotesMap?: ParticipantQuotesMap,
) => {
  const players = useMemo(
    () => sortPlayers(buildPlayers(participants, participantQuotesMap), "desc"),
    [participants, participantQuotesMap],
  );

  const areQuotesLoaded = participantQuotesMap ? Object.values(participantQuotesMap).length : true;
  const isLoading = !areQuotesLoaded;

  return { players, isLoading };
};
