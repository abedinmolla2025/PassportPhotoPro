// Storage interface for photo editor application
// This app primarily uses client-side processing, so minimal server storage is needed

export interface IStorage {
  // Add any storage methods if needed for future features
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage if needed
  }
}

export const storage = new MemStorage();
