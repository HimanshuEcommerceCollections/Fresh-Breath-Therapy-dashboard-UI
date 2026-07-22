// src/services/sessionsService.ts
//
// TODO: Wire real endpoints once API documentation is provided (POST
// /sessions, etc). Keeping this service layer stable so the hook layer
// (useScheduleSessionForm) doesn't need to change later — only the
// implementation inside these functions will.

export type ScheduleSessionPayload = {
  client: string;
  therapist: string;
  date: string;
  time: string;
  type: string;
};

export const sessionsService = {
  async scheduleSession(
    _payload: ScheduleSessionPayload,
  ): Promise<{ success: boolean }> {
    // TODO: replace with real POST /sessions call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 800),
    );
  },
};
