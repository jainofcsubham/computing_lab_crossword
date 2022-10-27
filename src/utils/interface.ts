type UnknownObj = {[key:string] : any}
export interface User {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
}

export interface Response {
  status: 0 | -1;
  message: string;
  data ?: UnknownObj
}

export interface LoginForm extends Omit<User, "name" | "isAdmin"> {}
