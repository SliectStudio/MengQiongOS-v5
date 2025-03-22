export interface ElectronAPI {
  getPowerStatus: () => Promise<{
    type: 'AC' | 'Battery';
    charging?: boolean;
    level?: number;
  }>;
  getAppStartTime: () => Promise<string>;
  readAccounts: () => Promise<{accounts: User[]}>;
  writeAccounts: (data: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  password: string;
  role: string;
}
