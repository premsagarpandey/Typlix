import { createContext } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PwaInstallContextType {
  isPhone: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
  canPromptDirectly: boolean;
  installApp: () => Promise<boolean>;
  showGuideModal: boolean;
  setShowGuideModal: (show: boolean) => void;
  isBannerDismissed: boolean;
  dismissBanner: () => void;
}

export const PwaInstallContext = createContext<PwaInstallContextType | null>(null);
