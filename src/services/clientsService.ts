// src/services/clientsService.ts
//
// TODO: Wire real endpoints once API documentation is provided (POST
// /clients/convert-lead, etc). Keeping this service layer stable now so the
// hook doesn't need to change later.

export const clientsService = {
  async convertLeadToClient(_leadId: string): Promise<{ success: boolean }> {
    // TODO: replace with real POST /clients/convert-lead call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 600)
    );
  },
};
