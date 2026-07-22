// src/services/therapistsService.ts
//
// TODO: Wire real endpoints once API documentation is provided (POST
// /therapists, etc). Keeping this service layer stable now so the hook
// doesn't need to change later.

export type AddTherapistPayload = {
  fullName: string;
  email: string;
  credential: string;
  specialization: string;
  clinic: string;
  employmentStatus: string;
};

export const therapistsService = {
  async addTherapist(_payload: AddTherapistPayload): Promise<{ success: boolean }> {
    // TODO: replace with real POST /therapists call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 700)
    );
  },
};
