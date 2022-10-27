type UnknownObj = {[key:string] : any}

export interface DatabaseType  {
    getUsers: () => readonly User[];
    registerUser: (user: User) => Response;
    loginUser: (loginDetails: LoginForm) => Response;
    getCurrentUser: () => User | undefined;
    updateProfilePicture: (email: string,picture : string) => Response;
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
