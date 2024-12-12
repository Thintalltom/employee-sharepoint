import * as React from "react";
import type { IAppLauncherProps } from "./IAppLauncherProps";
// import CreateGroup from './CreateGroup';
import { CreateAppsProps } from "./IAppLauncherProps";
import { useState } from "react";
import CreateApps from "./CreateApps";
import { FluentProvider } from "@fluentui/react-components";
import UserApp from "./UserApp";

const AppLauncher: React.FC<IAppLauncherProps> = (props) => {
  // const [app, setApps] = useState<IAppLauncherState>({
  //   Title: "",
  //   Description: "",
  //   AllowMembersEditMembership: true,
  //   AllowRequestToJoinLeave: true,
  //   AutoAcceptRequestToJoinLeave: true,
  //   context: props.context
  // });
  const [list, setList] = useState<CreateAppsProps>({
    context: props.context,
  });

  const handleListChange = (newList: CreateAppsProps) => {
    setList(newList);
  };

  // const handleStateChange = (newState: IAppLauncherState) => {
  // setApps(newState);
  // }

  {
    /* <CreateGroup App={app} onAppChange={handleStateChange}  /> */
  }
  const [currentView, setCurrentView] = useState("launcher");

  function handleNavigateToSelectedApps(): void {
    setCurrentView("userApp");
    console.log("Navigate to selected apps");
  }

  return (
    <FluentProvider>
      {currentView === "launcher" && (
        <CreateApps
          context={list.context}
          listChange={handleListChange}
          onNavigate={handleNavigateToSelectedApps}
        />
      )}
      {currentView === "userApp" && <UserApp />}
    </FluentProvider>
  );
};
export default AppLauncher;
