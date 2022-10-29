import React, { useEffect, useState } from "react";
import {Typography} from "@mui/material"
import { useParams, useNavigate } from "react-router-dom";
import { CrosswordGrid } from "../../component/crossword-grid/CrosswordGrid";
import { ValidateLogin } from "../../component/validate-login/ValidateLogin";
import { useDatabaseContext } from "../../context/data.service";
import { Puzzle, Puzzle_Grid } from "../../utils/interface";
import { makeGrid } from "../../utils/util";

export const Crossword: React.FC = () => {
  const pathParams = useParams();
  const navigate = useNavigate();

  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle_Grid>({
    size: 0,
    across: [],
    down: [],
    config: [],
  });

  const [currentTab, setCurrentTab] = useState<string>("h");
  const [time,setTime] = useState(0);
  const { getPuzzleWithId } = useDatabaseContext();

  useEffect(() => {
    let id = pathParams.id;
    id = "1";
    if (id) {
      //@TODO: Fetch from the user games if not found fetch from DB.
      const response = getPuzzleWithId(Number(id));
      //@TODO: Set time based on the returned puzzle
      if (response.status === -1) {
        navigate("/dashboard");
      }
      const puzzleConfig: Puzzle = response.data as Puzzle;
      setCurrentPuzzle(makeGrid(puzzleConfig));
    } else {
      navigate("/dashboard");
    }

    const interval = setInterval(() => {
      setTime(prev => prev+1);
    },1000)

    const saveInterval =  setInterval(() => {
      // TODO: Save game after every minute
    },60000)

    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
    }
  }, []);

  const setCell = (value: string, cellIndex: number) => {
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

  return (
    <>
      {/* <ValidateLogin> */}
      <Typography component={'div'}>Crossword</Typography>
      <Typography component={'div'}>{Math.floor(time / 60).toString().padStart(2,'0')} : {(time % 60).toString().padStart(2,'0')}</Typography>
      <Typography component={'div'}>
        <Typography component={'div'}>
          <Typography component={'div'}>
            <Typography component={'div'}
              onClick={() => {
                setCurrentTab("h");
              }}
            >
              Across
            </Typography>
            <Typography component={'div'}
              onClick={() => {
                setCurrentTab("v");
              }}
            >
              Down
            </Typography>
          </Typography>
          <Typography component={'div'}>
            {currentTab === "h" &&
              currentPuzzle.across &&
              currentPuzzle.across.length && (
                <>
                  {currentPuzzle.across.map((each, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Typography component={'div'}
                          onClick={(_e) => {
                            focusCell(each.cell);
                          }}
                        >
                          {each.index}. {each.hint}
                        </Typography>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            {currentTab === "v" &&
              currentPuzzle.down &&
              currentPuzzle.down.length && (
                <>
                  {currentPuzzle.down.map((each, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Typography component={'div'}
                          onClick={(_e) => {
                            focusCell(each.cell);
                          }}
                        >
                          {each.index}. {each.hint}
                        </Typography>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
          </Typography>
        </Typography>
        <Typography component={'div'}>
          {currentPuzzle && currentPuzzle.size && (
            <>
              <CrosswordGrid puzzle={currentPuzzle} setCell={setCell} />
            </>
          )}
        </Typography>
      </Typography>

      <Typography component={'div'}>* Game is auto-saved every minute.</Typography>
      {/* </ValidateLogin> */}
    </>
  );
};
