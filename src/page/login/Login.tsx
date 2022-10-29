import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../utils/constant";
import { LoginForm } from "../../utils/interface";
import { useDatabaseContext } from "../../context/data.service";
import styles from "./Login.module.scss"

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({});
  
  const {loginUser,getCurrentUser} = useDatabaseContext()
  const navigate = useNavigate();
  const [error,setError] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser()
    if(user){
        navigate('/dashboard');
    }
  },[])

  const onSubmit: SubmitHandler<LoginForm> = (data): number => {
    const response = loginUser(data);
    if(response.status === -1){
      setError(response.message);
      return 0;
    }
    localStorage.setItem("crossword_logged_in","true");
    navigate("/dashboard");
    return 0;
  };

  return (
    <>
      <Typography component={'div'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography className={styles.input_container} component={'div'}>
              <TextField
                placeholder="Email"
                className={styles.input}
                {...register("email", { required: true, pattern: EMAIL_REGEX })}
              />
              {errors.email && (
                <>
                {errors.email?.type === "required" && (
                  <Typography component={'div'} className={styles.error}>Email is required.</Typography>
                )}
                {errors.email?.type === "pattern" && (
                  <Typography component={'div'} className={styles.error}>Invalid Email.</Typography>
                )}
              </>
              )}
            </Typography>
            <Typography className={styles.input_container} component={'div'}>
              <TextField
              className={styles.input}
              type="password"
                placeholder="Password"
                {...register("password", {
                  required: true,
                  pattern: PASSWORD_REGEX,
                })}
              />
              {errors.password && (
                <>
                  {errors.password?.type === "required" && (
                    <Typography component={'div'} className={styles.error}>Password is required.</Typography>
                  )}
                  {errors.password?.type === "pattern" && (
                    <Typography component={'div'} className={styles.error}>Invalid Password.</Typography>
                  )}
                </>
              )}
            </Typography>
            <Typography component={'div'}>
              <Button variant="contained" className={styles.button} type="submit">Login</Button>
            </Typography>
          </form>
          {
            error && (<Typography  className={styles.global_error} component={'div'}>{error}</Typography>)
          }
      </Typography>
    </>
  );
};
