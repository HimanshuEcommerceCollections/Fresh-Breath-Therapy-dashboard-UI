// src/data/authData/authBrandData.ts

export interface AvatarStackItem {
  id: string;
  bg: string; // fallback color if no image
  imageUrl?: string;
}

export interface AuthBrandContent {
  logoText: string;
  logoSubText: string;
  trustBadge: string;
  heading: string[]; // array so we can render line breaks exactly like Figma
  subheading: string;
  avatarStack: AvatarStackItem[];
  socialProofTitle: string;
  socialProofSubtitle: string;
  footerNote: string;
  shieldIconUrl: string;
}

export const authBrandContent: AuthBrandContent = {
  logoText: "FRESH BREATH",
  logoSubText: "THERAPY",
  trustBadge: "Trusted by 1,200+ therapy clinics",
  heading: ["Breathe easier.", "Care smarter."],
  subheading:
    "A calmer workspace for breath therapy teams — patient charts, appointments and treatment plans, all in one place.",
  avatarStack: [
    { id: "avatar-1", bg: "#53C1C7", imageUrl: "/authpages/Background.png" },
    { id: "avatar-2", bg: "#35AFC9", imageUrl: "/authpages/Background (1).png" },
    { id: "avatar-3", bg: "#259CCA", imageUrl: "/authpages/Background (2).png" },
    { id: "avatar-4", bg: "#2D86C8", imageUrl: "/authpages/Overlay+Shadow.png" },
  ],
  socialProofTitle: "Loved by clinicians",
  socialProofSubtitle: "HIPAA-ready · SOC 2 Type II",
  footerNote: "End-to-end encrypted · PHI never leaves your region",
  shieldIconUrl: "/authpages/shieldicon.png",
};