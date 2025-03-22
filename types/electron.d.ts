interface ElectronAPI {
  getPowerStatus: () => Promise<{
    type: string;
    level?: number;
    charging: boolean;
  }>;
  getAppStartTime: () => Promise<string>;
  readAccounts: () => Promise<any>;
  writeAccounts: (data: any) => Promise<boolean>;
  showKeyboard: () => Promise<void>;
}

interface Window {
  electronAPI: ElectronAPI;
}
