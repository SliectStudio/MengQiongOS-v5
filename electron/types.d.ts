export interface ElectronAPI {
  getPowerStatus: () => Promise<{
    type: 'AC' | 'Battery';
    charging?: boolean;
    level?: number;
  }>;
  getAppStartTime: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
