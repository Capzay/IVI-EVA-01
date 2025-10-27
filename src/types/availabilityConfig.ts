export interface AvailabilityConfig {
  [teamName: string]: {
    availabilityChannel: string | null;
    captainID: string | null;
    roleID: string | null;
    embedMessageID: string | null;
    pingMessageID: string | null;
  };
}
