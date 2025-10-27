import { Events, Client } from "discord.js";
import cron from "node-cron";
import { updateAvailabilityEmbed } from "../handlers/updateAvailabilityEmbed";
import { Availability } from "../types/availability";
const fs = require("fs");
const path = require("path");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);

    const availabilityDir = "src/data/availability/";
    fs.readdir(
      availabilityDir,
      (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }
        files.forEach((file: string) => {
          const filePath = path.join(availabilityDir, file);
          const data: Availability = JSON.parse(
            fs.readFileSync(filePath, "utf8")
          );

          const now = new Date();
          const nextResetDate = data.nextReset
            ? new Date(data.nextReset)
            : null;
          const lastResetDate = data.lastReset
            ? new Date(data.lastReset)
            : null;

          // Helper function to check if two dates are on the same day
          const isSameDay = (date1: Date, date2: Date) => {
            return (
              date1.getUTCFullYear() === date2.getUTCFullYear() &&
              date1.getUTCMonth() === date2.getUTCMonth() &&
              date1.getUTCDate() === date2.getUTCDate()
            );
          };

          // Only proceed if nextReset is in the past AND lastReset is not on the same day as today
          const shouldReset =
            nextResetDate &&
            nextResetDate < now &&
            (!lastResetDate || !isSameDay(lastResetDate, now));

          if (shouldReset) {
            const dayOfWeek = now.getUTCDay();
            const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
            const nextMonday = new Date(
              Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + daysUntilNextMonday,
                6,
                0,
                0,
                0
              )
            );
            data.monday = [""];
            data.tuesday = [""];
            data.wednesday = [""];
            data.thursday = [""];
            data.friday = [""];
            data.saturday = [""];
            data.sunday = [""];
            data.lastReset = now.toUTCString();
            data.nextReset = nextMonday.toUTCString();
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
            updateAvailabilityEmbed(client, file.replace(".json", ""), true);
          }
        });
      }
    );

    cron.schedule(
      "0 6 * * 1",
      () => {
        const availabilityDir = "src/data/availability/";
        fs.readdir(
          availabilityDir,
          (err: NodeJS.ErrnoException | null, files: string[]) => {
            if (err) {
              console.error("Error reading directory:", err);
              return;
            }
            files.forEach((file: string) => {
              const now = new Date();
              const dayOfWeek = now.getUTCDay();
              const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
              const nextMonday = new Date(
                Date.UTC(
                  now.getUTCFullYear(),
                  now.getUTCMonth(),
                  now.getUTCDate() + daysUntilNextMonday,
                  6,
                  0,
                  0,
                  0
                )
              );

              const filePath = path.join(availabilityDir, file);
              const data: Availability = fs.readFileSync(filePath, "utf8");
              data.monday = [""];
              data.tuesday = [""];
              data.wednesday = [""];
              data.thursday = [""];
              data.friday = [""];
              data.saturday = [""];
              data.sunday = [""];
              data.lastReset = new Date().toUTCString();
              data.nextReset = nextMonday.toUTCString();
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
              updateAvailabilityEmbed(client, file.replace(".json", ""), true);
            });
          }
        );
      },
      {
        timezone: "UTC",
      }
    );
  },
};
