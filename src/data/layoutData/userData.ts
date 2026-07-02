export type User = {
  name: string;
  role: string;
  avatarUrl: string;
};

// TODO: replace with a backend-fetched user (API route / auth session / store).
export const currentUser: User = {
  name: "Dr. Avery",
  role: "Admin",
  avatarUrl: "/dashboard/dashboardicons/sidebaricons/profileImage.png",
};
