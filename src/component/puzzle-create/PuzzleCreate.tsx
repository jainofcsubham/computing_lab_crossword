import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDatabaseContext } from "../../context/data.service";
import { Puzzle } from "../../utils/interface";
import { Game } from "../game/Game";
import styles from "./PuzzleCreate.module.scss";

export const PuzzleCreate: React.FC<{ isEdit?: boolean }> = ({
  isEdit = false,
}) => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<{
    id : number,
    puzzle ?: Puzzle
  }>({
    id : -1,
  });
  const { getAllPuzzles } = useDatabaseContext();

  const setPuzzle = (e: any) => {
    const newId = e?.target?.value
    if(newId){
      const puzzle = getAllPuzzles().find(each  => each.id === newId);
      setSelectedPuzzle({id: newId,puzzle})
    }else{
      setSelectedPuzzle({
        id : -1,
      });
    }
  };
  return (
    <Typography style={{ marginTop: "20px" }} component={"div"}>
      {isEdit && (
        <Typography className={styles.selector} component={'div'}>
          <FormControl>
            <InputLabel id="puzzle_selector">Select puzzle</InputLabel>
            <Select className={styles.field} label="Select puzzle" labelId="puzzle_selector" value={selectedPuzzle.id} onChange={setPuzzle}>
              <MenuItem value={-1}>None</MenuItem>
              {getAllPuzzles()
                .filter((each) => !each.freezed)
                .map((each) => {
                  return (
                    <MenuItem value={each.id} key={each.id}>
                      {each.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Typography>
      )}
      {isEdit && selectedPuzzle.id !== -1 && <Game isEdit={true} puzzle={selectedPuzzle.puzzle} />}
      {!isEdit && <Game />}
    </Typography>
  );
};
