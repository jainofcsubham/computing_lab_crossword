import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CrosswordGrid } from "../../component/crossword-grid/CrosswordGrid";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { Puzzle, Puzzle_Grid } from "../../utils/interface";
import { makeGrid } from "../../utils/util";
import styles from "./Crossword.module.scss";

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
  const [openDialog,setOpenDialog] = useState<boolean>(false)

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
  const { getPuzzleWithId, getUserActiveGames } = useDatabaseContext();

  useEffect(() => {
    let id = pathParams.id;
    const type = searchParams.get("type");
    if (!type || (type && type !== "resume" && type !== "new")) {
      navigate("/dashboard");
    }
    const allActiveGames = getUserActiveGames()?.data?.games;
    if (type === "new") {
      if (Array.isArray(allActiveGames) && allActiveGames.length) {
        const currentActiveGame = allActiveGames.find(
          (each) => each?.puzzle?.id === id && !each.isCompleted
        );
        if (currentActiveGame) {
          // Show a popup for preload
        } else {
          if (id) {
            //@TODO: Fetch from the user games if not found fetch from DB.
            const response = getPuzzleWithId(Number(id));
            //@TODO: Set time based on the returned puzzle
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
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        if (id) {
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
        } else {
          navigate("/dashboard");
        }
      }
    } else {
      if (Array.isArray(allActiveGames) && allActiveGames.length) {
        const currentActiveGame = allActiveGames.find(
          (each) => each?.puzzle?.id === id && !each.isCompleted
        );
        if (currentActiveGame) {
          let whiteCells = 0;
          let correctCells = 0;
          const grid = currentActiveGame.puzzle as Puzzle_Grid;
          grid.config.forEach((each) => {
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
          setCurrentPuzzle(grid);
        } else {
          navigate("/dashboard");
        }
      }
    }
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    const saveInterval = setInterval(() => {

    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
    };
  }, []);

  useEffect(() => {
    let correctCells = 0;
    currentPuzzle.config.forEach((each) => {
      if (each.answer === each.value && each.isWhiteCell) {
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
      // Show success popup and redirect to dashboard
      navigate("/dashboard");
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
            {currentPuzzle && currentPuzzle.size && (
              <>
                <Typography
                  style={{ maxWidth: `${currentPuzzle.size * 40}px` }}
                  className={styles.puzzle_container}
                  component={"div"}
                >
                  <Typography className={styles.toolbar} component={"div"}>
                    <Typography className={styles.validator} component={"div"}>
                      <Button
                        onClick={validatePuzzle}
                        className={styles.button}
                      >
                        <img alt="validate" src="../assets/validate.png" />
                        Validate
                      </Button>
                    </Typography>
                    <Typography className={styles.timer} component={"div"}>
                      <span>Time:</span>{" "}
                      {Math.floor(time / 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                      : {(time % 60).toString().padStart(2, "0")}
                    </Typography>
                  </Typography>
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
              </>
            )}
          </Typography>
        </Typography>

        <Dialog open={openDialog} onClose={() => {
          setOpenDialog(false);
        }}>
          <DialogTitle>{"Load existing game?"}</DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This will load your "In Progress" puzzle.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Disagree</Button>
          <Button onClick={() => {}}>Agree</Button>
        </DialogActions>
        </Dialog>
      </ValidateLogin>
    </>
  );
};
