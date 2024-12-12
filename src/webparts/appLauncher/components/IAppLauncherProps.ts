import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IAppLauncherProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
}

export interface IAppLauncherState {
Title: string;
Description: string;
AllowMembersEditMembership: boolean;
AllowRequestToJoinLeave: boolean;
AutoAcceptRequestToJoinLeave: boolean;
context: WebPartContext;
}

export interface CreateAppsProps {
  context: WebPartContext
  onNavigate?: () => void;
}

export interface App {
  image: string | undefined;
  id: number;
  name: string;
  link: string;
}