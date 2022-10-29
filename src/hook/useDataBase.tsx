import { useCallback, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { DEFAULT_USER_AND_ADMIN } from "../utils/constant";
import { User, Response, LoginForm, Puzzle } from "../utils/interface";
import { PUZZLES } from "../utils/puzzle";

export const useDataBase = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<ReadonlyArray<User>>([
    {
      ...DEFAULT_USER_AND_ADMIN,
    },
  ]);

  const [puzzles,setPuzzles] = useState<ReadonlyArray<Puzzle>>([...PUZZLES])
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    if(currentUser?.email){
      const user = users.find(each => each.email === currentUser.email)
      setCurrentUser(user);
    }
  },[users])

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

  const updateProfilePicture = useCallback((email: string, picture: string): Response => {
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
    return { status: 0, message: "Profile Updated" ,data: {...user,picture}};
  },[users]);

  const getPuzzleWithId = useCallback((id:number):Response => {
    const puzzle = puzzles.find(each => each.id === id)
    if(puzzle){
      return {status : 0,message : 'Puzzle found.',data : {...puzzle}}
    }
    return {status : -1,message : 'Invalid Puzzle'} 
  },[puzzles])

  const addPuzzle = useCallback((puzzle : Puzzle):Response => {
    setPuzzles(prev => {
      return  [...prev,{...puzzle,id : prev.length + 1}]
    })
    return {status : 0,message : 'Puzzle added.'}
  },[puzzles])

  const getAllPuzzles = useCallback(() : ReadonlyArray<Puzzle>=> puzzles,[puzzles])

  // TODO: Uncomment this once everything is done
  // useEffect(() => {
  //   if(!currentUser){
  //     navigate("/login")
  //   }
  // },[currentUser])
  return {
    getUsers,
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfilePicture,
    getPuzzleWithId,
    addPuzzle,
    getAllPuzzles
  };
};
