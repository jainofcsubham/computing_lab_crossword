import { useCallback, useEffect, useState } from "react";
import { DEFAULT_USER_AND_ADMIN } from "../utils/constant";
import { User, Response, LoginForm } from "../utils/interface";

export const useDataBase = () => {
  const [users, setUsers] = useState<ReadonlyArray<User>>([
    {
      ...DEFAULT_USER_AND_ADMIN,
    },
  ]);

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

  return {
    getUsers,
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfilePicture,
  };
};
