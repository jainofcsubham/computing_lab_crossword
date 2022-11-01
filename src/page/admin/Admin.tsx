import { Typography } from "@mui/material";
import React, { useState } from "react";
import { PuzzleCreate } from "../../component/puzzle-create/PuzzleCreate";
import { PuzzleList } from "../../component/puzzle-list/PuzzleList";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import styles from "./Admin.module.scss";

export const Admin: React.FC = () => {
  const [tab, setTab] = useState<"L" | "A" | "E">("L");

  return (
    <>
      <ValidateLogin>
        <Typography component={"div"} className={styles.container}>
          <Typography className={styles.header} component={"div"}>
            <Typography
              onClick={() => {
                setTab("L");
              }}
              className={`${styles.heading} ${styles.heading_1} ${
                tab === "L" ? styles.active_heading : ""
              }`}
              component={"div"}
            >
              Puzzles
            </Typography>
            <Typography
              onClick={() => {
                setTab("A");
              }}
              className={`${styles.heading} ${styles.heading_2} ${
                tab === "A" ? styles.active_heading : ""
              }`}
              component={"div"}
            >
              Create Game
            </Typography>
            <Typography
              onClick={() => {
                setTab("E");
              }}
              className={`${styles.heading} ${styles.heading_3} ${
                tab === "E" ? styles.active_heading : ""
              }`}
              component={"div"}
            >
              Modify Game
            </Typography>
          </Typography>
          <Typography className={styles.viewer} component={"div"}>
            {
              tab === 'A' && (<PuzzleCreate />)
            }
            {
              tab === 'E' && (<PuzzleCreate isEdit={true} />)
            }
            {
              tab === 'L' && (<PuzzleList />)
            }
          </Typography>
        </Typography>
      </ValidateLogin>
    </>
  );
};
