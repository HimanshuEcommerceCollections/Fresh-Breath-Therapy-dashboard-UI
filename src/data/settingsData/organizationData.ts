export type OrganizationSettings = {
  name: string;
  primaryEmail: string;
  timezone: string;
  locations: string[];
};

// TODO: replace with backend-fetched settings (/api/settings/organization).
export const organizationData: OrganizationSettings = {
  name: "Fresh Breath Therapy",
  primaryEmail: "admin@freshbreath.co",
  timezone: "America/New_York",
  locations: [
    "Cary",
    "Winston-Salem",
    "Greensboro",
    "Raleigh",
    "Fayetteville",
    "Wilmington",
  ],
};
