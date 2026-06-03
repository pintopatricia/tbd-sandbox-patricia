import { bmeApi } from "./bme-api";
import { getBetEligibility } from "./bme-service";

jest.mock("./bme-api", () => ({
  bmeApi: {
    betEligibility: jest.fn(),
  },
}));

const betIds = ["bet1", "bet2"];
const mockBetEligibilityResponse = {
  betEligibilities: [
    {
      betId: "bet2",
      betMutationEligibility: [],
      legs: [],
    },
  ],
};

describe("getBetEligibility", () => {
  beforeEach(jest.clearAllMocks);

  it("should call betEligibility with the correct parameters", async () => {
    bmeApi.betEligibility.mockResolvedValue(mockBetEligibilityResponse);

    const response = await getBetEligibility(betIds);

    expect(bmeApi.betEligibility).toHaveBeenCalledWith({ betIds });
    expect(response).toEqual(mockBetEligibilityResponse);
  });

  it("should not call betEligibility if betIds is empty", async () => {
    const response = await getBetEligibility([]);

    expect(bmeApi.betEligibility).not.toHaveBeenCalled();
    expect(response).toBeUndefined();
  });
});
