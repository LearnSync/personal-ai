import {
  BellRing,
  Braces,
  DatabaseBackupIcon,
  HelpCircle,
  Key,
  Settings2,
  ShieldCheck,
  User,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalFirstStore } from "@/store";
import { Section } from "./_components/general-components";
import {
  AccountSettingScreen,
  ApiKeySettingScreen,
  BackupSettingScreen,
  GeneralSettingScreen,
  HelpSupportSettingScreen,
  LocalLlmSetupSettingScreen,
  NotificationSettingScreen,
  PrivacySecuritySettingScreen,
} from "./_screen";

export enum ESetting {
  GENERAL = "general",
  API_KEY = "api_key",
  LOCAL_LLM_SETUP = "local_llm_setup",
  BACKUP = "backup",
  ACCOUNT = "account",
  NOTIFICATIONS = "notifications",
  HELP_SUPPORT = "help_support",
  PRIVACY_SECURITY = "privacy_security",
}

interface ISettings {
  label: string;
  icon: React.ReactNode;
  key: ESetting;
}

const SETTING_TABS: ISettings[] = [
  {
    label: "General",
    icon: <Settings2 className="w-4 h-4" />,
    key: ESetting.GENERAL,
  },
  {
    label: "API Key",
    icon: <Key className="w-4 h-4" />,
    key: ESetting.API_KEY,
  },
  {
    label: "Local LLM Setup",
    icon: <Braces className="w-4 h-4" />,
    key: ESetting.LOCAL_LLM_SETUP,
  },
  {
    label: "Backup",
    icon: <DatabaseBackupIcon className="w-4 h-4" />,
    key: ESetting.BACKUP,
  },
  {
    label: "Account",
    icon: <User className="w-4 h-4" />,
    key: ESetting.ACCOUNT,
  },
  {
    label: "Notifications",
    icon: <BellRing className="w-4 h-4" />,
    key: ESetting.NOTIFICATIONS,
  },
  {
    label: "Help & Support",
    icon: <HelpCircle className="w-4 h-4" />,
    key: ESetting.HELP_SUPPORT,
  },
  {
    label: "Privacy & Security",
    icon: <ShieldCheck className="w-4 h-4" />,
    key: ESetting.PRIVACY_SECURITY,
  },
];

export const Settings = () => {
  // Store
  const { settings, setSettingsSelectedItem } = useLocalFirstStore();

  const selectedSettingsItem = (item: ESetting) => {
    switch (item) {
      case ESetting.GENERAL:
        return <GeneralSettingScreen />;
      case ESetting.API_KEY:
        return <ApiKeySettingScreen />;
      case ESetting.LOCAL_LLM_SETUP:
        return <LocalLlmSetupSettingScreen />;
      case ESetting.BACKUP:
        return <BackupSettingScreen />;
      case ESetting.ACCOUNT:
        return <AccountSettingScreen />;
      case ESetting.NOTIFICATIONS:
        return <NotificationSettingScreen />;
      case ESetting.HELP_SUPPORT:
        return <HelpSupportSettingScreen />;
      case ESetting.PRIVACY_SECURITY:
        return <PrivacySecuritySettingScreen />;
      default:
        return <div>No settings found.</div>;
    }
  };

  const handleSettingItemClick = (item: ISettings) => {
    setSettingsSelectedItem(item.key);
  };

  return (
    <ScrollArea className="w-full h-full mx-2">
      <main className="container w-full h-full mx-auto max-w-7xl">
        <h1 className="text-2xl font-[700] mt-3">Settings</h1>

        <Section className="flex-1 mt-3">
          <ul className="grid h-full grid-cols-2 gap-3 col-span-full lg:block lg:col-span-3 xl:col-span-2">
            {SETTING_TABS.map((st) => (
              <li key={`${st.key}__${st.label}`} className="">
                <Button
                  variant={
                    settings.selectedItem === st.key ? "default" : "ghost"
                  }
                  className="justify-start w-full my-1 space-x-2"
                  onClick={() => handleSettingItemClick(st)}
                  key={st.key}
                >
                  <div>{st.icon}</div>
                  <div>{st.label}</div>
                </Button>
              </li>
            ))}
          </ul>

          <div className="col-span-full lg:col-span-9 xl:col-span-10">
            {selectedSettingsItem(settings.selectedItem)}
          </div>
        </Section>
      </main>
    </ScrollArea>
  );
};

export default Settings;
