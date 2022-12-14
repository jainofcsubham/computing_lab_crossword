import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { CrosswordGrid } from "../../component/crossword-grid/CrosswordGrid";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { DirtyGame, Puzzle, Puzzle_Grid } from "../../utils/interface";
import { makeGrid } from "../../utils/util";
import styles from "./Dashboard.module.scss";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { getAllFreezedPuzzle,getUserActiveGames } = useDatabaseContext();
  const navigate = useNavigate();
  const [activePuzzles,setActivePuzzles] = useState<ReadonlyArray<{
    grid : Puzzle_Grid,
    id : number,
  }>>([])

  useEffect(() => {
    const temp =  getUserActiveGames()?.data?.games
    if(temp && Array.isArray(temp)){
      const allGames  = temp as ReadonlyArray<DirtyGame>
      const inProgressGames = allGames.filter(each => !each.isCompleted)
      setActivePuzzles(inProgressGames.map(each => ({grid : each.puzzle,id: each.id})))
    }
    
  },[])

  const playGame = (id: number, type: string) => {
    navigate(`/crossword/${id}?type=${type}`);
  };

  return (
    <>
      <ValidateLogin>
        <Typography className={styles.container} component={"div"}>
          {
          getUserActiveGames()?.data?.games?.length > 0  && (
            <Typography component={"div"}>
              <Typography
                className={`${styles.heading_1} ${styles.heading}`}
                component={"div"}
              >
                Active Puzzles
              </Typography>
              <Typography className={styles.list} component={"div"}>
                {activePuzzles.map((each, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Typography
                        component={"div"}
                        onClick={() => {
                          playGame(each.id, "resume");
                        }}
                        className={styles.item}
                      >
                        <Typography
                          className={styles.game_heading}
                          component={"div"}
                        >
                          {each.grid.name}
                        </Typography>
                        <Typography
                          className={styles.play_game}
                          component="div"
                        >
                          Resume Game
                        </Typography>
                        <Typography
                          className={styles.wrapper}
                          component={"div"}
                        >
                          <Typography
                            component={"div"}
                            style={{
                              width: `${each.grid.size * 40}px`,
                              height: `${each.grid.size * 40}px`,
                              transform: `scale(${100 / (each.grid.size * 40)})`
                            }}
                            className={styles.grid_parent}
                          >
                            <CrosswordGrid puzzle={each.grid} />
                          </Typography>{" "}
                        </Typography>
                      </Typography>
                    </React.Fragment>
                  );
                })}
              </Typography>
            </Typography>
          )}
          <Typography component={"div"}>
            <Typography
              className={`${styles.heading_2} ${styles.heading}`}
              component={"div"}
            >
              All Puzzles
            </Typography>
            <Typography className={styles.list} component={"div"}>
              {getAllFreezedPuzzle().map((each, index) => {
                return (
                  <React.Fragment key={index}>
                    <Typography
                      component={"div"}
                      onClick={() => {
                        playGame(each.id, "new");
                      }}
                      className={styles.item}
                    >
                      <Typography
                        className={styles.game_heading}
                        component={"div"}
                      >
                        {each.name}
                      </Typography>
                      <Typography className={styles.play_game} component="div">
                        Play Game
                      </Typography>
                      <Typography className={styles.wrapper} component={"div"}>
                        <Typography
                          component={"div"}
                          style={{
                            width: `${each.size * 40}px`,
                            height: `${each.size * 40}px`,
                            transform: `scale(${100 / (each.size * 40)})`
                          }}
                          className={styles.grid_parent}
                        >
                          <CrosswordGrid puzzle={makeGrid(each).grid} />
                        </Typography>
                      </Typography>
                    </Typography>
                  </React.Fragment>
                );
              })}
            </Typography>
          </Typography>
        </Typography>
      </ValidateLogin>
    </>
  );
};
