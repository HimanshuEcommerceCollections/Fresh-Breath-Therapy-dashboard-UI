// src/services/signupRequestsService.ts
//
// TODO: Wire real endpoints once API documentation is provided (GET
// /signup-requests, PATCH /signup-requests/:id/role, DELETE /users/:id).
// Function names are intentionally descriptive of the real-world action,
// not just the data operation — especially rejectAndDeleteUser, which
// permanently deletes the account, not just removes a table row.

import {
  type SignupRequest,
  type SignupRequestRole,
  signupRequestsMock,
} from "@/src/data/signupRequestsData/signupRequestsData";

export const signupRequestsService = {
  async fetchSignupRequests(): Promise<SignupRequest[]> {
    // TODO: replace with real GET /signup-requests call
    return new Promise((resolve) =>
      setTimeout(() => resolve(signupRequestsMock), 400),
    );
  },

  async updateRole(
    _id: string,
    _role: SignupRequestRole,
  ): Promise<{ success: boolean }> {
    // TODO: replace with real PATCH /signup-requests/:id/role call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500),
    );
  },

  async rejectAndDeleteUser(_id: string): Promise<{ success: boolean }> {
    // TODO: replace with real DELETE /users/:id call.
    // This is a destructive, irreversible action — it permanently deletes
    // the user's account from the database, not just hides the table row.
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 600),
    );
  },
};
