import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER_AND_ADMIN } from "../utils/constant";
import {
  User,
  Response,
  LoginForm,
  Puzzle,
  Puzzle_Grid,
  DirtyGame,
} from "../utils/interface";
import { PUZZLES } from "../utils/puzzle";

export const useDataBase = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ReadonlyArray<User>>([
    {
      ...DEFAULT_USER_AND_ADMIN,
    },
  ]);

  const [puzzles, setPuzzles] = useState<ReadonlyArray<Puzzle>>([...PUZZLES]);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    if (currentUser?.email) {
      const user = users.find((each) => each.email === currentUser.email);
      setCurrentUser(user);
    }
  }, [users]);

  const getUsers = useCallback((): ReadonlyArray<User> => users, [users]);
  const registerUser = useCallback(
    (user: User): Response => {
      const duplicateUser = users.find((each) => each.email === user.email);
      if (duplicateUser) {
        return {
          status: -1,
          message: `User with Email Id ${user.email} already exists.`,
        };
      }
      setUsers((prev) => {
        return [...prev, { ...user }];
      });
      return { status: 0, message: "Registered Successfully" };
    },
    [users]
  );

  const loginUser = useCallback(
    (loginDetails: LoginForm): Response => {
      const user = users.find(
        (each) =>
          each.email === loginDetails.email &&
          each.password === loginDetails.password
      );
      if (!user) {
        return { message: `Invalid email or password.`, status: -1 };
      }
      setCurrentUser({ ...user });
      return { status: 0, message: "User found.", data: { ...user } };
    },
    [users]
  );

  const getCurrentUser = useCallback(() => currentUser, [currentUser]);

  const updateProfilePicture = useCallback(
    (email: string, picture: string): Response => {
      const user = users.find((each) => each.email === email);
      if (!user) {
        return { message: `Invalid email or password.`, status: -1 };
      }
      setUsers((prev) => {
        return prev.map((each) => {
          if (each.email === email) {
            return {
              ...each,
              picture,
            };
          }
          return { ...each };
        });
      });
      return {
        status: 0,
        message: "Profile Updated",
        data: { ...user, picture },
      };
    },
    [users]
  );

  const getPuzzleWithId = useCallback(
    (id: number): Response => {
      const puzzle = puzzles.find((each) => each.id === id);
      if (puzzle) {
        return { status: 0, message: "Puzzle found.", data: { ...puzzle } };
      }
      return { status: -1, message: "Invalid Puzzle" };
    },
    [puzzles]
  );

  const addPuzzle = useCallback(
    (puzzle: Puzzle): Response => {
      setPuzzles((prev) => {
        return [...prev, { ...puzzle, id: prev[prev.length - 1].id + 1 }];
      });
      return { status: 0, message: "Puzzle added." };
    },
    [puzzles]
  );

  const getAllPuzzles = useCallback(
    (): ReadonlyArray<Puzzle> => puzzles,
    [puzzles]
  );

  const logoutUser = useCallback(() => {
    setCurrentUser(undefined);
  }, [currentUser]);

  const deletePuzzle = useCallback(
    (id: number): Response => {
      setPuzzles((prev) => {
        return prev.filter((each) => each.id !== id);
      });
      return { status: 0, message: "Deleted Successfully" };
    },
    [puzzles]
  );

  const freezePuzzle = useCallback(
    (id: number): Response => {
      setPuzzles((prev) => {
        return prev.map((each) => {
          if (each.id === id) {
            return { ...each, freezed: true };
          }
          return { ...each };
        });
      });
      return { status: 0, message: "Freezed successfully" };
    },
    [puzzles]
  );

  const getAllFreezedPuzzle = useCallback((): ReadonlyArray<Puzzle> => {
    return puzzles.filter((each) => each.freezed);
  }, [puzzles]);

  const updatePuzzle = useCallback(
    (puzzle: Puzzle) => {
      const id = puzzle.id;
      setPuzzles((prev) => {
        return prev.map((each) => {
          if (each.id === id) {
            return { ...puzzle };
          }
          return { ...each };
        });
      });
    },
    [puzzles]
  );

  const getUserActiveGames = useCallback((): Response => {
    const userMail = currentUser?.email;
    if (userMail) {
      return {
        status: -1,
        message: "Found",
        data: {
          games: users
            .find((each) => each.email === userMail)
            ?.games?.filter((each) => !each.isCompleted),
        },
      };
    }
    return { status: -1, message: "No user found." };
  }, [users, currentUser]);

  useEffect(() =>{
    console.log(users);
  },[users])

  const saveGame = useCallback(
    (game: DirtyGame): Response => {
      if (currentUser) {
        setUsers((prev) => {
          return prev.map((each) => {
            if (each.email === currentUser.email) {
              const gameFound =
                each.games && Array.isArray(each.games) && each.games.length > 0
                  ? each.games.find((item) => item.id === game.id && !item.isCompleted)
                  : undefined;
              if (gameFound) {
                const games: ReadonlyArray<DirtyGame> =
                  each.games &&
                  Array.isArray(each.games) &&
                  each.games.length > 0
                    ? each.games.map((item: DirtyGame) => {
                        if (item.id === game.id) {
                          return {
                            ...game,
                          };
                        }
                        return { ...item };
                      })
                    : [{ ...game }];
                return {
                  ...each,
                  games,
                };
              } else {
                return {
                  ...each,
                  games:
                    each?.games?.length && each?.games?.length > 0
                      ? [...each.games, { ...game }]
                      : [{ ...game }],
                };
              }
            }
            return { ...each };
          });
        });
        return { status: 0, message: "Success" };
      }
      return { status: -1, message: "" };
    },
    [puzzles, currentUser,users]
  );

  const deleteActiveGame = useCallback((id:number) => {
    if(currentUser){
      const email = currentUser.email
      setUsers(prev  => {
        return prev.map(each => {
          if(each.email ===  email){
            return {
              ...each,
              games : each.games && each.games.length && each.games.length > 0 ? each.games.filter(game => game.id !== id || game.isCompleted) : []
            }
          }
          return {...each}
        })
      })
    }
  },[currentUser,users])

  const getUserCompletedGames = useCallback((): Response => {
    const userMail = currentUser?.email;
    if (userMail) {
      return {
        status: -1,
        message: "Found",
        data: {
          games: users
            .find((each) => each.email === userMail)
            ?.games?.filter((each) => each.isCompleted),
        },
      };
    }
    return { status: -1, message: "No user found." };
  }, [users, currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return {
    getUsers,
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfilePicture,
    getPuzzleWithId,
    addPuzzle,
    getAllPuzzles,
    logoutUser,
    deletePuzzle,
    freezePuzzle,
    getAllFreezedPuzzle,
    updatePuzzle,
    getUserActiveGames,
    saveGame,
    deleteActiveGame,
    getUserCompletedGames
  };
};
