import { APPLICATION } from "./AnalyticsDimensions";
import { GenericEvent } from "./Event.types";

/**
 * Measure campaigns and traffic sources in Google Analytics
 *
 * Example:
 * &utm_source=18070
 * &utm_medium=Partnerships
 * &utm_content=4660668
 * &utm_campaign=126889
 * &utm_ad=369307_
 * &mi_u=3270109
 * &mi_ign=1676828769188
 * &clkID=63_B735C641C3234917AAF7BE3652B93110
 * &rfr=63
 * &ttp=111
 * &pid=1218015
 * &bid=9282
 * &acc_id=123456
 */
export type CampaignMeasurementEvent = Omit<GenericEvent, APPLICATION.MODULE> & {
  utm_source: string;
  acc_id: number;
  utm_medium?: string;
  utm_content?: string;
  utm_campaign?: string;
  utm_ad?: string;
  mi_u?: string;
  mi_ign?: string;
  bid?: string;
  pid?: string;
  ttp?: string;
  rfr?: string;
  clkID?: string;
};
