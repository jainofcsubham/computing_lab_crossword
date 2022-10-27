import { useState } from "react";
import { DEFAULT_USER_AND_ADMIN } from "../utils/constant";
import { User,Response, LoginForm } from "../utils/interface";

export const useDataBase = () => {
  const [users, setUsers] = useState<ReadonlyArray<User>>([
    {
      ...DEFAULT_USER_AND_ADMIN,
    },
  ]);

  const [currentUser,setCurrentUser] = useState<User | undefined>()

  const getUsers = (): ReadonlyArray<User> => users;
  const registerUser = (user : User): Response => {
    const duplicateUser = users.find(each => each.email === user.email);
    if(duplicateUser){
        return {status : -1,message : `User with Email Id ${user.email} already exists.`}
    }
    setUsers(prev => {
        return [...prev,{...user}]
    })
    return {status : 0,message : 'Registered Successfully'}
  }

  const loginUser = (loginDetails: LoginForm): Response => {
    const user = users.find(each => each.email === loginDetails.email && each.password === loginDetails.password)
    if(!user){
        return {message : `Invalid email or password.`,status : -1};
    }
    setCurrentUser({...user});
    return {status : 0,message : 'User found.',data : {...user}};
  }

  const getCurrentUser = () => currentUser;

  return {getUsers,registerUser,loginUser,getCurrentUser};
};
