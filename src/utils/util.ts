import { Grid_Cell, Hint, Puzzle, Puzzle_Grid } from "./interface";

export const makeGrid = (config: Puzzle): Puzzle_Grid => {
  let finalConfig: Grid_Cell[] = [];
  const rows = config.size;
  const numberOfCells = config.size * config.size;
  for (let i = 1; i <= numberOfCells; i++) {
    finalConfig = [
      ...finalConfig,
      {
        superscript: -1,
        isWhiteCell: false,
        answer: "",
        value: "",
        index: i,
      },
    ];
  }

  config.config.forEach((eachCell) => {
    const { cell, index, length, type, value } = eachCell;
    for (let i = 0; i < length; i++) {
      let cellIndex;
      if (type === "h") {
        cellIndex = cell + i - 1;
      } else {
        cellIndex = cell + i * rows - 1;
      }
      finalConfig[cellIndex] = {
        ...finalConfig[cellIndex],
        superscript: i === 0 ? index : finalConfig[cellIndex].superscript,
        isWhiteCell: true,
        answer: value[i],
      };
    }
  });

  let across: ReadonlyArray<Hint> = [],
    down: ReadonlyArray<Hint> = [];
  config.config.forEach((eachCell) => {
    const { type, index, hint,cell } = eachCell;
    if (type === "v") {
      down = [...down, { index, hint,cell }];
    } else {
      across = [...across, { index, hint ,cell}];
    }
  });
  return { size: rows, across, down, config: finalConfig };
};
