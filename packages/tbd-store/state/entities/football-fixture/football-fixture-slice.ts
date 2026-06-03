import { createSlice } from "@reduxjs/toolkit";
import { FootballFixtures, FootballFixture, FootballMatchStatus } from "./FootballFixture.types";
import { FixtureStatus } from "../../constants";
import { fetchCatalogueSuccessAction } from "../../../actions/catalogue";
import mixinDeep from "../../mixin";
import { fetchFixtureUpdatesSuccessAction } from "../../../actions/fixture";

const FootballFixtureStatusMap: Record<FootballMatchStatus, FixtureStatus> = {
  [FootballMatchStatus.PRE_MATCH]: FixtureStatus.PRE_MATCH,
  [FootballMatchStatus.HALF]: FixtureStatus.IN_PLAY,
  [FootballMatchStatus.FULL]: FixtureStatus.IN_PLAY,
  [FootballMatchStatus.INPLAY_FIRST_HALF]: FixtureStatus.IN_PLAY,
  [FootballMatchStatus.INPLAY_SECOND_HALF]: FixtureStatus.IN_PLAY,
  [FootballMatchStatus.PENALTY_SHOOTOUT]: FixtureStatus.IN_PLAY,
  [FootballMatchStatus.END]: FixtureStatus.END,
};

export default createSlice({
  name: "FootballFixture",
  initialState: {} as FootballFixtures,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
      const updates = action.payload.data.FootballFixture || [];
      updates.forEach((update) => {
        const { urn } = update;

        if (!state[urn]) {
          state[urn] = {} as FootballFixture;
        }

        const scheduledAt = update.scheduledAt ? new Date(update.scheduledAt) : state[urn].scheduledAt;
        const startedAt = update.startedAt && new Date(update.startedAt);
        const fixtureStatus = update.duration?.status
          ? FootballFixtureStatusMap[update.duration.status]
          : state[urn].fixtureStatus ?? FixtureStatus.UNKNOWN;

        mixinDeep(state[urn], {
          ...update,
          scheduledAt,
          startedAt,
          fixtureStatus,
        });
      });
    });

    builder.addCase(fetchFixtureUpdatesSuccessAction, (state, action) => {
      const updates = action.payload.football || {};

      Object.entries(updates).forEach(([urn, update]) => {
        if (!state[urn]) {
          state[urn] = {} as FootballFixture;
        }

        const fixtureStatus = update.duration?.status
          ? FootballFixtureStatusMap[update.duration.status]
          : FixtureStatus.UNKNOWN;

        mixinDeep(state[urn], {
          ...update,
          stats: update.stats,
          fixtureStatus,
        });
      });
    });
  },
});
