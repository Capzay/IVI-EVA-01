import * as fs from "fs";
import { AvailabilityConfig } from "../types/availabilityConfig";

export function readAvailabilityConfig() {
  let availabilityConfig = fs.readFileSync("src/data/availability-config.json");
  let availabilityData = JSON.parse(
    availabilityConfig.toString()
  ) as AvailabilityConfig;
  return availabilityData;
}
