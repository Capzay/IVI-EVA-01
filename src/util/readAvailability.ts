import * as fs from "fs";
import { AvailabilityConfig } from "../types/availabilityConfig";

export function readAvailabilityConfig(roleID: string) {
  let availabilityConfig = fs.readFileSync(
    `src/data/availability/${roleID}.json`
  );
  let availabilityData = JSON.parse(
    availabilityConfig.toString()
  ) as AvailabilityConfig;
  return availabilityData;
}
