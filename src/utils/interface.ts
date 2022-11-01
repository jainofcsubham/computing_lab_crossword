type UnknownObj = { [key: string]: any };

export interface DatabaseType {
  getUsers: () => readonly User[];
  registerUser: (user: User) => Response;
  loginUser: (loginDetails: LoginForm) => Response;
  getCurrentUser: () => User | undefined;
  updateProfilePicture: (email: string, picture: string) => Response;
  getPuzzleWithId: (id: number) => Response;
  addPuzzle: (puzzle: Puzzle) => Response;
  getAllPuzzles: () => ReadonlyArray<Puzzle>;
  logoutUser: () => void;
  deletePuzzle: (id: number) => Response;
  freezePuzzle: (id: number) => Response;
  getAllFreezedPuzzle: () => ReadonlyArray<Puzzle>;
  updatePuzzle: (puzzle: Puzzle) => void;
  getUserActiveGames: () => Response;
  getUserCompletedGames: () => Response;
  saveGame: (game : DirtyGame) => Response;
  deleteActiveGame : (id:number) => void
}

export interface DirtyGame {
  puzzle: Puzzle_Grid;
  isCompleted: boolean;
  time: number;
  id: number;
}
export interface User {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  picture?: string;
  games?: ReadonlyArray<DirtyGame>;
}

export interface Response {
  status: 0 | -1;
  message: string;
  data?: UnknownObj;
}

export interface LoginForm extends Omit<User, "name" | "isAdmin" | "picture"> {}

export interface RegisterForm extends Omit<User, "isAdmin" | "picture"> {
  reTypePassword: string;
}

// Type of cell before massaging
export interface Cell_Config {
  index: number;
  cell: number;
  length: number;
  hint: string;
  value: string;
  type: "v" | "h";
}

export interface Puzzle {
  size: number;
  id: number;
  name: string;
  config: ReadonlyArray<Cell_Config>;
  freezed: boolean;
}

//Type of cell after massaging
export interface Grid_Cell {
  superscript: number;
  isWhiteCell: boolean;
  answer: string;
  value: string;
  index: number;
}

export interface Hint {
  index: number;
  hint: string;
  cell: number;
}
export interface Puzzle_Grid {
  size: number;
  across: ReadonlyArray<Hint>;
  name: string;
  down: ReadonlyArray<Hint>;
  config: ReadonlyArray<Grid_Cell>;
}
