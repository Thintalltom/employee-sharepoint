import * as React from "react";
import { useState, useEffect } from "react";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { availableApps } from "./AvailableApp";
import { App } from "./IAppLauncherProps";
import { makeStyles, Button } from "@fluentui/react-components";

interface ListProps {
  context: any;
  listChange: any;
  onNavigate?: () => void;
}

const useStyle = makeStyles({
  flexTable: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "space-between",
  },
  box: {
    textAlign: "center",
    flexBasis: "calc(100% / 3 - 10px)",
    boxSizing: "border-box",
    height: "40%",
  },
  image: {
    width: "20%",
    height: "15%",
  },
  button: {
    width: "10%",
    height: "15%",
  },
  selectedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    listStyleType: "none",
  },
});

const CreateApps: React.FC<ListProps> = ({
  context,
  listChange,
  onNavigate,
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [applications, setApplications] = useState<App[]>([]);
  const getUserLogin = () => {
    const userEmail = context.pageContext.user.email;
    setEmail(userEmail);
  };

  useEffect(() => {
    getUserLogin();
    setApplications(availableApps);
  }, [context]);

  const [selectedApp, setSelectedApp] = useState<App[]>([]);

  const handleAppClick = (app: App) => {
    const isSelected = selectedApp.some(
      (selectedApp: { id: number }) => selectedApp.id === app.id
    );

    if (isSelected) {
      setSelectedApp(
        selectedApp.filter((selectedApp) => selectedApp.id !== app.id)
      );
    } else {
      setSelectedApp([...selectedApp, app]);
    }
  };

  const getList = async () => {
    const siteUrls: string =
      "https://011ff.sharepoint.com/sites/react-app/_api/web/tenantappcatalog/AvailableApps";

    try {
      const response: SPHttpClientResponse = await context.spHttpClient.get(
        siteUrls,
        SPHttpClient.configurations.v1
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched successfully:", data);
      } else {
        const errorData = await response.json();
        console.error("Error fetching data:", errorData);
      }
    } catch (error) {}
  };

  useEffect(() => {
  getList();
  }, [])
  

  //storing userApplication in sharepointList
  const addtoList = async () => {
    const siteUrls = "https://011ff.sharepoint.com/sites/react-app";
    const siteUrl: string =
      siteUrls + "/_api/web/lists/getbytitle('APPOWNED')/items";
    const itemBody: any = {
      Email: email,
      Application: JSON.stringify(selectedApp), // Make sure to stringify if it's an array or object
    };

    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(itemBody),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    try {
      const response: SPHttpClientResponse = await context.spHttpClient.post(
        siteUrl,
        SPHttpClient.configurations.v1,
        spHttpClientOptions
      );

      if (response.ok) {
        const data = await response.json();
        onNavigate && onNavigate();
        console.log("Item added successfully:", data);
      } else {
        const errorData = await response.json();
        console.error("Error adding item to list:", errorData);
      }
    } catch (error) {
      console.error("An error occurred while adding the item:", error);
    }
  };

  const styles = useStyle();
  return (
    <div>
      <p>User Email: {email}</p>

      <div className={styles.flexTable}>
        {applications.map((app) => (
          <div key={app.id} className={styles.box}>
            <img src={app.image} alt={app.name} className={styles.image} />
            <p>{app.name}</p>
            <a href={app.link}> {app.link}</a>

            <Button
              onClick={() => handleAppClick(app)}
              appearance="outline"
              className={styles.button}
            >
              {selectedApp.some((selectedApp) => selectedApp.id === app.id)
                ? "Deselect"
                : "select"}
            </Button>
          </div>
        ))}
      </div>

      <div>
        <h3>Selected Applications</h3>
        {selectedApp.length > 0 ? (
          <div className={styles.selectedGrid}>
            {selectedApp.map((app) => (
              <li key={app.id}>
                <img src={app.image} alt={app.name} className={styles.image} />
                <p>{app.name}</p>
                <a href={app.link}>{app.link}</a>
              </li>
            ))}
          </div>
        ) : (
          <p>No applications selected yet.</p>
        )}
      </div>

      <button onClick={addtoList}>Save Selections</button>
    </div>
  );
};

export default CreateApps;
