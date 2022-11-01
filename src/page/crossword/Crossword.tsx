import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CrosswordGrid } from "../../component/crossword-grid/CrosswordGrid";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { DirtyGame, Puzzle, Puzzle_Grid } from "../../utils/interface";
import { makeGrid } from "../../utils/util";
import styles from "./Crossword.module.scss";
import useInterval from 'use-interval'

export const Crossword: React.FC = () => {
  const pathParams = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle_Grid>({
    size: 0,
    across: [],
    down: [],
    config: [],
    name: "",
  });
  const [openWinDialog,setOpenWinDialog] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [validation, setValidation] = useState<{
    totalWhiteCells: number;
    correctCells: number;
    showErrors: boolean;
  }>({
    totalWhiteCells: 0,
    correctCells: 0,
    showErrors: false,
  });
  const [currentTab, setCurrentTab] = useState<"H" | "V">("H");
  const [time, setTime] = useState(0);
  const { getPuzzleWithId, getUserActiveGames, saveGame, deleteActiveGame } =
    useDatabaseContext();

    useInterval(() => {
      savePuzzle(false);
    },60000)

    useInterval(() => {
      if(validation.correctCells !== validation.totalWhiteCells){
        setTime((prev) => prev + 1);
      }
    },1000)

  useEffect(() => {
    let id: any = pathParams.id;
    if (id) {
      id = Number(id);
      const type = searchParams.get("type");
      if (!type || (type && type !== "resume" && type !== "new")) {
        navigate("/dashboard");
      }
      const allActiveGames = getUserActiveGames()?.data?.games;
      const currentActiveGame: DirtyGame | undefined =
        allActiveGames && Array.isArray(allActiveGames) && allActiveGames.length
          ? allActiveGames.find((each) => each?.id === id && !each.isCompleted)
          : undefined;
      if (type === "resume") {
        if (!currentActiveGame) {
          navigate("/dashboard");
        } else {
          let whiteCells = 0;
          let correctCells = 0;
          currentActiveGame.puzzle.config.forEach((each) => {
            if (each.isWhiteCell) {
              whiteCells++;
              if (each.answer === each.value) {
                correctCells++;
              }
            }
          });
          setValidation({
            totalWhiteCells: whiteCells,
            correctCells,
            showErrors: false,
          });
          setTime(currentActiveGame.time);
          setCurrentPuzzle(currentActiveGame.puzzle);
        }
      } else if (type === "new") {
        if (currentActiveGame) {
          setOpenDialog(true);
        } else {
          const response = getPuzzleWithId(Number(id));
          if (response.status === -1) {
            navigate("/dashboard");
          }
          const puzzleConfig: Puzzle = response.data as Puzzle;
          const grid = makeGrid(puzzleConfig).grid;
          let whiteCells = 0;
          grid.config.forEach((each) => {
            if (each.isWhiteCell) {
              whiteCells++;
            }
          });
          setValidation({
            totalWhiteCells: whiteCells,
            correctCells: 0,
            showErrors: false,
          });
          setCurrentPuzzle(makeGrid(puzzleConfig).grid);
        }
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    let correctCells = 0;
    currentPuzzle.config.forEach((each) => {
      if (each.answer === each.value.toLowerCase() && each.isWhiteCell) {
        correctCells++;
      }
    });
    setValidation((prev) => ({ ...prev, correctCells }));
  }, [currentPuzzle.config]);

  useEffect(() => {
    if (
      currentPuzzle.size &&
      validation.correctCells === validation.totalWhiteCells
    ) {
      savePuzzle(true);
      setOpenWinDialog(true)
    }
  }, [validation]);

  const setCell = (value: string, cellIndex: number) => {
    setValidation((prev) => ({ ...prev, showErrors: false }));
    if (value === "") {
      setCurrentPuzzle((prev) => {
        return {
          ...prev,
          config: prev.config.map((each, index) => {
            if (index === cellIndex) {
              return {
                ...each,
                value: "",
              };
            }
            return { ...each };
          }),
        };
      });
    }
    if (
      (value !== " " && value >= "A" && value <= "Z") ||
      (value !== " " && value >= "a" && value <= "z")
    ) {
      setCurrentPuzzle((prev) => {
        return {
          ...prev,
          config: prev.config.map((each, index) => {
            if (index === cellIndex) {
              return {
                ...each,
                value,
              };
            }
            return { ...each };
          }),
        };
      });
      if (value) {
        const nextInputFound = currentPuzzle.config.find((each, index) => {
          return index > cellIndex && each.isWhiteCell;
        });
        if (nextInputFound && nextInputFound.index) {
          const input = document.getElementById(
            `input_${nextInputFound.index - 1}`
          );
          if (input) {
            input.focus();
          }
        }
      }
    }
  };

  const focusCell = (cell: number) => {
    const input = document.getElementById(`input_${cell - 1}`);
    if (input) {
      input.focus();
    }
  };

  const validatePuzzle = () => {
    if (validation.correctCells !== validation.totalWhiteCells) {
      setValidation((prev) => ({ ...prev, showErrors: true }));
    }
  };

  const resume = () => {
    let id: any = pathParams.id;
    if (id) {
      id = Number(id);
    } else {
      navigate("/dashboard");
    }
    const allActiveGames = getUserActiveGames()?.data?.games;
    const currentActiveGame: DirtyGame | undefined =
      allActiveGames && Array.isArray(allActiveGames) && allActiveGames.length
        ? allActiveGames.find((each) => each?.id === id && !each.isCompleted)
        : undefined;
    let whiteCells = 0;
    let correctCells = 0;
    if (currentActiveGame) {
      currentActiveGame.puzzle.config.forEach((each) => {
        if (each.isWhiteCell) {
          whiteCells++;
          if (each.answer === each.value) {
            correctCells++;
          }
        }
      });
      setValidation({
        totalWhiteCells: whiteCells,
        correctCells,
        showErrors: false,
      });
      setTime(currentActiveGame.time);
      setCurrentPuzzle(currentActiveGame.puzzle);
      setOpenDialog(false);
    } else {
      navigate("/dashboard");
    }
  };

  const restart = () => {
    let id: any = pathParams.id;
    if (id) {
      id = Number(id);
    } else {
      navigate("/dashboard");
    }
    const response = getPuzzleWithId(id);
    if (response.status === -1) {
      navigate("/dashboard");
    }
    const puzzleConfig: Puzzle = response.data as Puzzle;
    const grid = makeGrid(puzzleConfig).grid;
    let whiteCells = 0;
    grid.config.forEach((each) => {
      if (each.isWhiteCell) {
        whiteCells++;
      }
    });
    setValidation({
      totalWhiteCells: whiteCells,
      correctCells: 0,
      showErrors: false,
    });
    setCurrentPuzzle(makeGrid(puzzleConfig).grid);
    deleteActiveGame(id);
    setOpenDialog(false);
  };

  const savePuzzle = useCallback((isCompleted: boolean) => {
    if (pathParams.id) {
      saveGame({
        puzzle: currentPuzzle,
        id: Number(pathParams.id),
        isCompleted,
        time,
      });
    }
  },[time,currentPuzzle]);
  return (
    <>
      <ValidateLogin>
        <Typography className={styles.container} component={"div"}>
          <Typography
            className={styles.left}
            style={
              currentPuzzle.size
                ? { width: `calc(100vw - ${72 + currentPuzzle.size * 40}px)` }
                : {}
            }
            component={"div"}
          >
            <Typography className={styles.header} component={"div"}>
              <Typography
                component={"div"}
                className={`${styles.tab} ${
                  currentTab === "H" ? styles.active_tab : ""
                }`}
                onClick={() => {
                  setCurrentTab("H");
                }}
              >
                Across
              </Typography>
              <Typography
                component={"div"}
                className={`${styles.tab} ${
                  currentTab === "V" ? styles.active_tab : ""
                }`}
                onClick={() => {
                  setCurrentTab("V");
                }}
              >
                Down
              </Typography>
            </Typography>
            <Typography component={"div"}>
              {currentTab === "H" &&
                currentPuzzle.across &&
                currentPuzzle.across.length > 0 && (
                  <>
                    {currentPuzzle.across.map((each, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Typography
                            className={styles.hint_item}
                            component={"div"}
                            onClick={(_e) => {
                              focusCell(each.cell);
                            }}
                          >
                            {each.index.toString().padStart(2, "0")}.{" "}
                            {each.hint}
                          </Typography>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              {currentTab === "V" &&
                currentPuzzle.down &&
                currentPuzzle.down.length > 0 && (
                  <>
                    {currentPuzzle.down.map((each, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Typography
                            className={styles.hint_item}
                            component={"div"}
                            onClick={(_e) => {
                              focusCell(each.cell);
                            }}
                          >
                            {each.index.toString().padStart(2, "0")}.{" "}
                            {each.hint}
                          </Typography>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
            </Typography>
          </Typography>
          <Typography className={styles.right} component={"div"}>
            {currentPuzzle && currentPuzzle.size > 0 && (
              <>
                <Typography
                  className={styles.puzzle_container}
                  component={"div"}
                >
                  <Typography className={styles.toolbar} component={"div"}>
                    <Typography className={styles.timer} component={"div"}>
                      <span>Time:</span>{" "}
                      {Math.floor(time / 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                      : {(time % 60).toString().padStart(2, "0")}
                    </Typography>
                    <Typography className={styles.validator} component={"div"}>
                      <Button
                        onClick={() => {
                          savePuzzle(false);
                        }}
                        className={styles.button}
                      >
                        <img alt="validate" src="../assets/save.png" />
                        Save
                      </Button>
                      <Button
                        onClick={validatePuzzle}
                        className={styles.button}
                      >
                        <img alt="validate" src="../assets/validate.png" />
                        Validate
                      </Button>
                    </Typography>
                  </Typography>
                  <Typography
                    style={{ maxWidth: `${currentPuzzle.size * 40}px`, margin : '0 auto' }}
                    component={"div"}
                  >
                    <CrosswordGrid
                      puzzle={currentPuzzle}
                      setCell={setCell}
                      showErrors={validation.showErrors}
                    />
                    <Typography component={"div"}>
                      <ul>
                        <li>Game is auto-saved every minute.</li>
                      </ul>
                    </Typography>
                  </Typography>
                </Typography>
              </>
            )}
          </Typography>
        </Typography>

        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
        >
          <DialogTitle>{"Load existing game?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              This will load your "In Progress" puzzle.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={restart}>Disagree</Button>
            <Button onClick={resume}>Agree</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openWinDialog}
          onClose={() => {
            navigate("/dashboard")
          }}
        >
          <Typography component={'div'} className={styles.win_wrapper}>
            <img src="/assets/win.webp" alt="win" />
            <Typography component={'div'}>Congratulations!! You won.</Typography>
            <Typography component={'div'}>You took {Math.floor(time/60).toString().padStart(2,'0')}:{(time%60).toString().padStart(2,'0')} minutes.</Typography>
            <Button variant="contained" className={styles.btn} onClick={() => {navigate("/dashboard")}}> Continue</Button>
          </Typography>
          </Dialog>
      </ValidateLogin>
    </>
  );
};
