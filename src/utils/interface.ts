type UnknownObj = {[key:string] : any}

export interface DatabaseType  {
    getUsers: () => readonly User[];
    registerUser: (user: User) => Response;
    loginUser: (loginDetails: LoginForm) => Response;
    getCurrentUser: () => User | undefined;
    updateProfilePicture: (email: string,picture : string) => Response;
    getPuzzleWithId : (id:number) => Response,
    addPuzzle : (puzzle : Puzzle) => Response
    getAllPuzzles : () => ReadonlyArray<Puzzle>
}
export interface User {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
  picture ?: string
}

export interface Response {
  status: 0 | -1;
  message: string;
  data ?: UnknownObj
}

export interface LoginForm extends Omit<User, "name" | "isAdmin" | "picture"> {}

export interface RegisterForm extends Omit<User, "isAdmin" | "picture"> {
    reTypePassword : string
}

// Type of cell before massaging
export interface Cell_Config {
  index : number,
  cell : number,
  length : number,
  hint: string,
  value : string,
  type : 'v' | 'h'
}

export interface Puzzle {
  size : number,
  id : number,
  config : ReadonlyArray<Cell_Config>
}

//Type of cell after massaging
export interface Grid_Cell{
  superscript : number,
  isWhiteCell : boolean,
  answer : string,
  value : string,
  index : number,
}

export interface Hint {
  index : number,
  hint : string,
  cell : number
}
export interface Puzzle_Grid {
  size : number,
  across : ReadonlyArray<Hint>,
  down : ReadonlyArray<Hint>,
  config : ReadonlyArray<Grid_Cell>
}
