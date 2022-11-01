import React, { useEffect, useState } from "react";
import styles from "./Game.module.scss";
import { Puzzle } from "../../utils/interface";
import {
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ANSWER_REGEX, GAME_NAME_REGEX } from "../../utils/constant";
import { makeGrid } from "../../utils/util";
import { CrosswordGrid } from "../crossword-grid/CrosswordGrid";
import { useDatabaseContext } from "../../context/data.service";
import { useNavigate } from "react-router-dom";

interface GameForm {
  name: string;
  size: string;
  freezed: boolean;
  config: ReadonlyArray<{
    cell: string;
    hint: string;
    index: string;
    length: string;
    type: string;
    value: string;
  }>;
}

export const Game: React.FC<{
  puzzle?: Puzzle;
  isEdit?: boolean;
}> = ({ puzzle, isEdit = false }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>({
    id: -1,
    config: [],
    freezed: false,
    name: "",
    size: 0,
  });
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>("");
  const { updatePuzzle, addPuzzle } = useDatabaseContext();

  useEffect(() => {
    if (isEdit && puzzle) {
      setCurrentPuzzle(puzzle);
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GameForm>({
    defaultValues:
      isEdit && puzzle
        ? {
            ...puzzle,
            size: puzzle.size.toString(),
            config: puzzle.config.map((each) => ({
              ...each,
              cell: each.cell.toString(),
              index: each.index.toString(),
              length: each.length.toString(),
              type: each.type.toString(),
            })),
          }
        : { freezed: false },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "config",
  });

  const addWord = (_e: any) => {
    append({
      cell: "",
      hint: "",
      index: "",
      length: "",
      type: "",
      value: "",
    });
  };

  const deleteRow = (id: number) => {
    remove(id);
  };

  const validatePuzzle = (
    puzzle: GameForm
  ): {
    error: boolean;
    puzzle?: Puzzle;
  } => {
    const massagedPuzzle: Puzzle = {
      config: [],
      freezed: false,
      id: currentPuzzle.id,
      name: puzzle.name,
      size: Number(puzzle.size),
    };
    const isError = puzzle.config.find((each, index) => {
      const isErrorObjFound = massagedPuzzle.config.find((item) => {
        return item.cell === Number(each.cell) && item.type === each.type;
      });

      let cellIndexOfLastLetter = 0;
      if (each.type === "v") {
        cellIndexOfLastLetter =
          Number(each.cell) + Number(puzzle.size) * (Number(each.length) - 1);
      } else {
        cellIndexOfLastLetter = Number(each.cell) + Number(each.length) - 1;
      }
      const isError =
        (each.type === "v" &&
          cellIndexOfLastLetter > Number(puzzle.size) * Number(puzzle.size)) ||
        (each.type === "h" &&
          cellIndexOfLastLetter >
            Number(each.cell) -
              (Number(each.cell) % Number(puzzle.size)) +
              Number(puzzle.size)) ||
        isErrorObjFound;

      if (!isError) {
        massagedPuzzle.config = [
          ...massagedPuzzle.config,
          {
            ...each,
            cell: Number(each.cell),
            index: Number(each.index),
            length: Number(each.length),
            type: each.type === "v" ? "v" : "h",
          },
        ];
      }
      return isError;
    });
    return isError ? { error: true } : { error: false, puzzle: massagedPuzzle };
  };

  const onPreview: SubmitHandler<GameForm> = (data) => {
    const response = validatePuzzle(data);
    if (response.error) {
      setGlobalError("Puzzle is invalid.");
    } else {
      if (response.puzzle) {
        const res = makeGrid(response.puzzle);
        if (res.error) {
          setGlobalError("Puzzle is invalid.");
        } else {
          setCurrentPuzzle(response.puzzle);
          setOpenPreview(true);
          setGlobalError("");
        }
      }
    }
  };

  const onSave: SubmitHandler<GameForm> = (data) => {
    const response = validatePuzzle(data);
    if (response.error) {
      setGlobalError("Puzzle is invalid.");
    } else {
      if (response.puzzle) {
        const res = makeGrid(response.puzzle);
        if (res.error) {
          setGlobalError("Puzzle is invalid.");
        } else {
          if (isEdit) {
            updatePuzzle({ ...response.puzzle, freezed: false });
          } else {
            addPuzzle({ ...response.puzzle, freezed: false });
          }
          setGlobalError("");
          navigate("/dashboard");
        }
      }
    }
  };

  const onSubmit: SubmitHandler<GameForm> = (data) => {
    const response = validatePuzzle(data);
    if (response.error) {
      setGlobalError("Puzzle is invalid.");
    } else {
      if (response.puzzle) {
        const res = makeGrid(response.puzzle);
        if (res.error) {
          setGlobalError("Puzzle is invalid.");
        } else {
          if (isEdit) {
            updatePuzzle({ ...response.puzzle, freezed: true });
          } else {
            addPuzzle({ ...response.puzzle, freezed: true });
          }
          setGlobalError("");
          navigate("/dashboard");
        }
      }
    }
  };

  return (
    <>
      <Typography component={"div"} className={styles.container}>
        <Typography component={"div"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography className={styles.field_container} component={"div"}>
              <Typography className={styles.first_row} component={"div"}>
                <Typography
                  className={styles.field_container}
                  component={"div"}
                >
                  <TextField
                    type={"text"}
                    className={`${styles.field}`}
                    label="Game Name"
                    {...register("name", {
                      required: true,
                      pattern: GAME_NAME_REGEX,
                    })}
                  />
                  {errors.name && (
                    <>
                      {errors.name?.type === "required" && (
                        <Typography component={"div"} className={styles.error}>
                          Game name is required.
                        </Typography>
                      )}
                      {errors.name?.type === "pattern" && (
                        <Typography component={"div"} className={styles.error}>
                          Invalid Game name.
                        </Typography>
                      )}
                    </>
                  )}
                </Typography>
                <Typography
                  className={styles.field_container}
                  component={"div"}
                >
                  <TextField
                    type={"text"}
                    className={`${styles.field}`}
                    label="Game Size"
                    {...register("size", {
                      required: true,
                      validate: (value: string) => {
                        if (!(Number(value) >= 1 && Number(value) <= 15)) {
                          return "Size can only lie between 1 and 15.";
                        }
                      },
                    })}
                  />
                  {errors.size && (
                    <>
                      {errors.size?.type === "required" && (
                        <Typography component={"div"} className={styles.error}>
                          Game size is required.
                        </Typography>
                      )}
                      {errors.size?.type === "validate" && (
                        <Typography component={"div"} className={styles.error}>
                          Size can only lie between 1 and 15.
                        </Typography>
                      )}
                    </>
                  )}
                </Typography>
              </Typography>

              <>
                {fields.map(({ id }, index: number) => {
                  return (
                    <Typography component={"div"} key={id}>
                      <Typography className={styles.row} component={"div"}>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <FormControl>
                            <InputLabel id={`type_${id}`}>Type</InputLabel>
                            <Select
                              className={`${styles.field}`}
                              labelId={`type_${id}`}
                              label="Type"
                              {...register(`config.${index}.type`, {
                                required: true,
                              })}
                              value={watch(`config.${index}.type`)}
                            >
                              <MenuItem disabled value={undefined}>
                                None
                              </MenuItem>
                              <MenuItem value={"h"}>Across</MenuItem>
                              <MenuItem value={"v"}>Down</MenuItem>
                            </Select>
                          </FormControl>
                        </Typography>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <TextField
                            label="Cell"
                            className={`${styles.field}`}
                            type={"text"}
                            {...register(`config.${index}.cell`, {
                              required: true,
                              validate: (value :string) => {
                                if(!(Number(value) >= 1 && Number(value) <= Number(watch("size")) * Number(watch("size")))){
                                  return "Invalid cell number"
                                }
                              }
                            })}
                          />
                        </Typography>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <TextField
                            label="Word Number"
                            className={`${styles.field}`}
                            type={"text"}
                            {...register(`config.${index}.index`, {
                              required: true,
                            })}
                          />
                        </Typography>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <TextField
                            label="Word size"
                            className={`${styles.field}`}
                            type={"text"}
                            {...register(`config.${index}.length`, {
                              required: true,
                              validate: (value:string) => {
                                if(!(Number(value) >= 1 && Number(value) <= Number(watch("size")))){
                                  return "Invalid length"
                                }
                              }
                            })}
                          />
                        </Typography>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <TextField
                            label="Clue"
                            className={`${styles.field}`}
                            type={"text"}
                            {...register(`config.${index}.hint`, {
                              required: true,
                            })}
                          />
                        </Typography>
                        <Typography
                          className={styles.field_container}
                          component={"div"}
                        >
                          <TextField
                            label="Answer"
                            className={`${styles.field}`}
                            type={"text"}
                            {...register(`config.${index}.value`, {
                              required: true,
                              pattern : ANSWER_REGEX,
                              validate: (value:string) => {
                                if(value && value.length !== Number(watch(`config.${index}.length`))){
                                  return "Invalid answer."
                                }
                              }
                            })}
                          />
                        </Typography>
                        <Typography
                          onClick={() => {
                            deleteRow(index);
                          }}
                          className={styles.delete}
                          component={"div"}
                        >
                          <img src="../assets/delete.png" alt="delete" />
                        </Typography>
                      </Typography>
                    </Typography>
                  );
                })}
              </>
            </Typography>
            <Typography className={styles.button_row} component={"div"}>
              {globalError && (
                <Typography className={styles.global_error}>
                  {globalError}
                </Typography>
              )}
              <Button className={styles.button} onClick={addWord}>
                Add word
              </Button>
              <Button
                className={styles.button}
                onClick={handleSubmit(onPreview)}
              >
                Preview
              </Button>
              <Button className={styles.button} onClick={handleSubmit(onSave)}>
                Save
              </Button>
              <Button className={styles.button} type="submit">
                Save and Freeze
              </Button>
            </Typography>
          </form>
        </Typography>
      </Typography>
      <Dialog
        onClose={() => {
          setOpenPreview(false);
        }}
        open={openPreview}
      >
        <CrosswordGrid
          puzzle={makeGrid(currentPuzzle, { prefill: true }).grid}
        />
      </Dialog>
    </>
  );
};
