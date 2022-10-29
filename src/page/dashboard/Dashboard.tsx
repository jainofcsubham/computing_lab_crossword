import React from "react";
import {Typography} from "@mui/material"
import { CrosswordGrid } from "../../component/crossword-grid/CrosswordGrid";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { Puzzle } from "../../utils/interface";
import { makeGrid } from "../../utils/util";
import styles from "./Dashboard.module.scss"

export const Dashboard: React.FC = () => {
  const { getAllPuzzles } = useDatabaseContext();
  const hasActivePuzzles = true;
  const activePuzzles: ReadonlyArray<Puzzle> = [];
  return (
    <>
      <ValidateLogin>
        {hasActivePuzzles && (
          <Typography component={'div'}>
            <Typography component={'div'}>Active Puzzles</Typography>
            <Typography component={'div'}>
              {activePuzzles.map((each, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography component={'div'} style={{ transform: "scale(0.2" }}>
                      <CrosswordGrid puzzle={makeGrid(each)} />
                    </Typography>
                  </React.Fragment>
                );
              })}
            </Typography>
          </Typography>
        )}
        <Typography component={'div'}>
          <Typography component={'div'}>All Puzzles</Typography>
          <Typography component={'div'}>
            {getAllPuzzles().map((each, index) => {
              return (
                <React.Fragment key={index}>
                  <Typography component={'div'} className={styles.item} >
                    <Typography component={'div'} className={styles.grid_parent}>
                      <CrosswordGrid puzzle={makeGrid(each)} />
                    </Typography>
                  </Typography>
                </React.Fragment>
              );
            })}
          </Typography>
        </Typography>
      </ValidateLogin>
    </>
  );
};
