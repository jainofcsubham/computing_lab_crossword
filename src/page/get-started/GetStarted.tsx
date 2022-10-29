import { Typography } from "@mui/material";
import React, { useState } from "react";
import { Login } from "../login/Login";
import { Register } from "../register/Register";
import styles from "./GetStarted.module.scss";

export const GetStarted: React.FC = () => {
  const [tab, setTab] = useState<"L" | "S">("L");

  const changeTab = (currentTab: "L" | "S"): void => {
    setTab(currentTab)
  }

  return (
    <>
      <Typography className={styles.container} component={"div"}>
        <Typography className={styles.left} component="div">
          {/* Put the tabs here */}
          {/* <Typography className={styles.box} component={"div"} >

          </Typography> */}
          <Typography className={styles.header} component={"div"}>
            <Typography
              className={`${styles.tab} ${
                tab === "L" ? styles.active_tab : ""
              }`}
              onClick={() => {
                setTab("L");
              }}
              component={"div"}
            >
              Login
            </Typography>
            <Typography
              className={`${styles.tab} ${
                tab === "S" ? styles.active_tab : ""
              }`}
              onClick={() => {
                setTab("S");
              }}
              component={"div"}
            >
              Sign up
            </Typography>
          </Typography>

          <Typography component={"div"}>
            {tab === "L" && (
              <>
                <Typography className={styles.form_container}  component={"div"}>
                    <Login />
                </Typography>
              </>
            )}
            {tab === "S" && (
              <>
                <Typography className={styles.form_container}  component={"div"}>
                    <Register changeTab={changeTab} />
                </Typography>
              </>
            )}
          </Typography>
        </Typography>
        <Typography className={styles.right} component="div">
          <img
            className={styles.info_graphic}
            src="./assets/info_graphic.png"
            alt="info-graphic"
          />
        </Typography>
      </Typography>
    </>
  );
};
