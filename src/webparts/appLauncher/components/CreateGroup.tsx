import * as React from "react";
import { IAppLauncherState } from "./IAppLauncherProps";
import { SPHttpClient } from "@microsoft/sp-http";
import { useEffect } from "react";
interface IcreateGroupProps {
  App: IAppLauncherState;
  onAppChange: (newState: IAppLauncherState) => void;
}
const CreateGroup: React.FC<IcreateGroupProps> = ({ App, onAppChange }) => {
  const handleGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeGroup = { ...App, Title: event.target.value };
    onAppChange(changeGroup);
  };

  const handleGroupDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const changeGroup = { ...App, Description: event.target.value };
    onAppChange(changeGroup);
  };

  const getFormDigest = async () => {
    const response = await App.context.spHttpClient.post(
      `${App.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
      SPHttpClient.configurations.v1,
      {
        headers: {
        'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
      }
    );

    if (response.ok) {
      const json = await response.json();
      console.log("ContextInfo Response:", json);
      if(json)
      {
        return json.FormDigestValue;
      }
    } else {
      const error = await response.json();
      console.error("Error fetching form digest:", error);
      throw new Error("Failed to fetch form digest.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestBody = {
      Title: App.Title,
      Description: App.Description,
      AllowMembersEditMembership: App.AllowMembersEditMembership,
      AllowRequestToJoinLeave: App.AllowRequestToJoinLeave,
      AutoAcceptRequestToJoinLeave: App.AutoAcceptRequestToJoinLeave,
      LoginName: App.context.pageContext.user.loginName,
      
    };
    console.log(requestBody)
    const formDigestValue = await getFormDigest();
    try {
      const response = await App.context.spHttpClient.post(
        `${App.context.pageContext.web.absoluteUrl}/_api/web/sitegroups`,
        SPHttpClient.configurations.v1,

        {
          body: JSON.stringify(requestBody),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "IF-MATCH": "*",
            "X-RequestDigest": formDigestValue,
          },
        }
      );
      if (response.ok) {
        alert("Group created successfully!");
      } else {
        console.error("Error creating group:", await response.json());
        alert("Failed to create group. Please check the console for details.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while creating the group.");
    }
  };


  const getGroups = () => {
    App.context.spHttpClient
      .get(
        `${App.context.pageContext.web.absoluteUrl}/_api/web/sitegroups`,
        SPHttpClient.configurations.v1
      )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
          });
        } else {
          console.error("Failed to fetch groups:", response);
        }
      });
  }

  useEffect(() => {
   
    getGroups()
  }, [])
  

  return (
    <div>
      <p>Create a group</p>
      <form onSubmit={handleSubmit}>
        <label>Group Name</label>
        <input type="text" value={App.Title || ""} onChange={handleGroupName} />
        <br />
        <label>Group Description</label>
        <input
          type="text"
          value={App.Description || ""}
          onChange={handleGroupDescriptionChange}
        />
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};
export default CreateGroup;
