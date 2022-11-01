import React, { useState } from "react";
import {Typography} from "@mui/material"
import { Puzzle_Grid } from "../../utils/interface";
import styles from "./CrosswordGrid.module.scss";

export const CrosswordGrid: React.FC<{
  puzzle: Puzzle_Grid;
  setCell?: (value: string, cellIndex: number) => void;
  showErrors ?: boolean
}> = ({ puzzle, setCell = (_value: string, _cellIndex: number) => {} ,showErrors = false}) => {

  const [focusedCell,setFocusedCell] = useState<number>(-1);

  const getCellIndex = ({ inner, outer }: { outer: number; inner: number }) =>
    outer * puzzle.size + inner;

    const onCellFocus = (e:any) => {
      if(e?.target?.id?.split('_')?.[1]){
        setFocusedCell(Number(e.target.id.split('_')[1]))
      }
    }

  return (
    <>
    <Typography component={'div'}>
      {Array.from({ length: puzzle.size }).map((_, outer) => {
        return (
          <Typography component={'div'}
            style={{ width: `${40 * puzzle.size}px` }}
            className={styles.row}
            key={outer}
          >
            {Array.from({ length: puzzle.size }).map((_, inner) => {
              return (
                <Typography component={'div'}
                  className={`${styles.cell} ${
                    puzzle.config[getCellIndex({ inner, outer })].isWhiteCell
                      ? styles.white_cell
                      : styles.black_cell
                  } ${getCellIndex({inner,outer}) === focusedCell ? styles.focused_cell : ''}`}
                  key={inner}
                >
                  {puzzle.config[getCellIndex({ inner, outer })].superscript !==
                  -1 ? (
                    <Typography component={'div'} className={styles.superscript}>
                      {
                        puzzle.config[getCellIndex({ inner, outer })]
                          .superscript
                      }
                    </Typography>
                  ) : (
                    <></>
                  )}
                  {puzzle.config[getCellIndex({ inner, outer })].isWhiteCell ? (
                    <>
                      {
                        <input
                          value={
                            puzzle.config[getCellIndex({ inner, outer })].value
                          }
                          id={`input_${getCellIndex({
                            inner,
                            outer,
                          })}`}
                          onFocus={onCellFocus}
                          maxLength={1}
                          onChange={(e) => {
                            setCell(
                              e.target.value,
                              getCellIndex({ inner, outer })
                            );
                          }}
                          className={`${styles.cell_input} ${showErrors && puzzle.config[getCellIndex({ inner, outer })].value && puzzle.config[getCellIndex({ inner, outer })].value.toLowerCase() !== puzzle.config[getCellIndex({ inner, outer })].answer? styles.error_cell : ''}`}
                          type="text"
                        />
                      }
                    </>
                  ) : (
                    <></>
                  )}
                </Typography>
              );
            })}
          </Typography>
        );
      })}
    </Typography>
    </>
  );
};
