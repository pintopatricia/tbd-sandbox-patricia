import { Jurisdiction } from "../@types/Jurisdiction";
import { SupportedJurisdiction } from "../constants/supported-jurisdictions";
import { determineJurisdiction } from "./determine-jurisdiction";

describe("determineJurisdiction", () => {
  describe("for INTL jurisdiction", () => {
    it("should return INTL jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.INTERNATIONAL)).toEqual(SupportedJurisdiction.INTERNATIONAL);
    });
  });

  describe("for SPAIN jurisdiction", () => {
    it("should return spanish jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.SPAIN)).toEqual(SupportedJurisdiction.SPAIN);
    });
  });

  describe("for ITALY jurisdiction", () => {
    it("should return italian jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.ITALY)).toEqual(SupportedJurisdiction.ITALY);
    });
  });

  describe("for DENMARK jurisdiction", () => {
    it("should return danish jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.DENMARK)).toEqual(SupportedJurisdiction.DENMARK);
    });
  });

  describe("for ROMANIA jurisdiction", () => {
    it("should return romanian jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.ROMANIA)).toEqual(SupportedJurisdiction.ROMANIA);
    });
  });

  describe("for BRAZIL jurisdiction", () => {
    it("should return brazil jurisdiction", () => {
      expect(determineJurisdiction(Jurisdiction.BRAZIL)).toEqual(SupportedJurisdiction.BRAZIL);
    });
  });
});
