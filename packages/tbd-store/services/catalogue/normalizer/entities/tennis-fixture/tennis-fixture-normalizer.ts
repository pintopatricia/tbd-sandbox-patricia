import {
  TeamSide,
  TennisGameType,
  TennisMatch,
  TennisSet,
  TennisMatchStatus,
  TennisStatusReason,
  TennisStatus,
  TennisSurface,
  TennisMatchType,
} from "../../../../../state/entities";
import {
  TennisFixtureDeprecatedFragment,
  TennisSet as TennisSetFragment,
  TennisMatchStatus as TennisMatchStatusFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCurrentSetIntoCurrentSet = (tennisSet: TennisSetFragment): TennisSet => ({
  currentGame: {
    teamAScore: tennisSet.currentGame?.teamAScore || "",
    teamBScore: tennisSet.currentGame?.teamBScore || "",
    teamServing: tennisSet.currentGame?.teamServing ? TeamSide[tennisSet.currentGame?.teamServing] : undefined,
    type: tennisSet.currentGame?.type ? TennisGameType[tennisSet.currentGame?.type] : undefined,
  },
  teamAScore: tennisSet.teamAScore,
  teamBScore: tennisSet.teamBScore,
});

const normalizeStatusIntoStatus = (tennisStatus: TennisMatchStatusFragment): TennisMatchStatus => ({
  status: tennisStatus.status ? TennisStatus[tennisStatus.status] : undefined,
  reason: tennisStatus.reason ? TennisStatusReason[tennisStatus.reason] : undefined,
});

const normalizeTennisFixtureFragmentIntoTennisFixture = (
  fragment: TennisFixtureDeprecatedFragment,
): TransformedFragment<TennisMatch> => {
  const {
    __typename,
    urn,
    isAmericanFormat,
    runnerNames,
    actualStartTime,
    scheduledStartTime,
    currentSet,
    status,
    surface,
    type,
    teamAScore,
    teamBScore,
  } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      isAmericanFormat,
      ...(runnerNames && { runnerNames }),
      actualStartTime: actualStartTime ? new Date(actualStartTime) : undefined,
      scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime) : undefined,
      teamAScore: teamAScore ?? undefined,
      teamBScore: teamBScore ?? undefined,
      surface: surface ? TennisSurface[surface] : undefined,
      type: type ? TennisMatchType[type] : undefined,
      ...(currentSet ? { currentSet: normalizeCurrentSetIntoCurrentSet(currentSet as TennisSetFragment) } : {}),
      ...(status ? { status: normalizeStatusIntoStatus(status as TennisMatchStatusFragment) } : {}),
    },
  };
};

export default normalizeTennisFixtureFragmentIntoTennisFixture;
