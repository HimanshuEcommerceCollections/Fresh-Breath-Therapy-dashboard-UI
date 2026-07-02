import { clientsData } from "@/src/data/clientsData/clientsData";
import { sessionsData } from "@/src/data/sessionsData/sessionsData";

// Option lists for the Schedule Session modal, derived from the existing
// datasets so they stay in sync. TODO: replace with dedicated backend
// endpoints (client roster, therapists directory) once those exist.

export const clientOptions: string[] = Array.from(
  new Set(clientsData.map((c) => c.name)),
);

export type TherapistOption = { name: string; location: string };

// Each therapist paired with the location they appear with in clientsData.
export const therapistOptions: TherapistOption[] = Array.from(
  clientsData
    .reduce((map, client) => {
      if (!map.has(client.therapist)) {
        map.set(client.therapist, {
          name: client.therapist,
          location: client.location,
        });
      }
      return map;
    }, new Map<string, TherapistOption>())
    .values(),
);

export const sessionTypeOptions: string[] = Array.from(
  new Set(sessionsData.map((s) => s.type)),
);
