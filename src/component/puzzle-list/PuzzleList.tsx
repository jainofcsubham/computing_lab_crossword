import { Popover, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDatabaseContext } from "../../context/data.service";
import { Puzzle } from "../../utils/interface";
import { makeGrid } from "../../utils/util";
import { CrosswordGrid } from "../crossword-grid/CrosswordGrid";
import styles from "./PuzzleList.module.scss";

export const PuzzleList: React.FC = () => {
  const { getAllPuzzles, deletePuzzle, freezePuzzle } = useDatabaseContext();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | undefined>();

  useEffect(() => {
    if (!anchorEl) {
      setTimeout(() => {
        setPuzzle(undefined);
      }, 90);
    }
  }, [anchorEl]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: any, puzzle: Puzzle) => {
    setAnchorEl(event.currentTarget);
    setPuzzle(puzzle);
  };

  const onFreeze = () => {
    const id = puzzle?.id;
    handleClose();
    if (id) {
      freezePuzzle(id);
    }
  };

  const onDelete = () => {
    const id = puzzle?.id;
    handleClose();
    if (id) {
      deletePuzzle(id);
    }
  };

  return (
    <>
      <Typography className={styles.container} component={"div"}>
        {getAllPuzzles().map((each, index) => {
          return (
            <React.Fragment key={index}>
              <Typography component={"div"} className={styles.item}>
                <Typography className={styles.game_heading} component={"div"}>
                  <Typography component={"div"} className={styles.title}>
                    {each.name}
                  </Typography>
                  <Typography
                    onClick={(e) => {
                      handleClick(e, each);
                    }}
                    component={"div"}
                    className={styles.icon}
                  >
                    <img src="../assets/settings_white.png" alt="setting" />
                  </Typography>
                </Typography>
                <Typography className={styles.wrapper} component={"div"}>
                  <Typography
                    style={{
                      width: `${each.size * 40}px`,
                      height: `${each.size * 40}px`,
                    }}
                    component={"div"}
                    className={styles.grid_parent}
                  >
                    <CrosswordGrid puzzle={makeGrid(each).grid} />
                  </Typography>{" "}
                </Typography>
              </Typography>
            </React.Fragment>
          );
        })}
      </Typography>

      <Popover
        id="pop-over-2"
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography className={styles.popover_container} component={"div"}>
          <>
            {puzzle && puzzle.freezed ? (
              <></>
            ) : (
              <Typography
                onClick={onFreeze}
                className={styles.popover_item}
                component={"div"}
              >
                <Typography style={{ fontSize: "16px" }} component={"div"}>
                  Freeze
                </Typography>
              </Typography>
            )}

            <Typography
              onClick={onDelete}
              className={styles.popover_item}
              component={"div"}
            >
              <Typography style={{ fontSize: "16px" }} component={"div"}>
                Delete
              </Typography>
            </Typography>
          </>
        </Typography>
      </Popover>
    </>
  );
};
