import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDatabaseContext } from "../../context/data.service";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../utils/constant";
import { RegisterForm } from "../../utils/interface";
import styles from "./Register.module.scss";

export const Register: React.FC<{ changeTab: (tab: "L" | "S") => void }> = ({
  changeTab,
}) => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<RegisterForm>();

  const { registerUser, getCurrentUser } = useDatabaseContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  const onSubmit: SubmitHandler<RegisterForm> = ({
    email,
    password,
    name,
  }): number => {
    const response = registerUser({ email, isAdmin: false, password, name });
    if (response.status === -1) {
      setError(response.message);
      return 0;
    }
    changeTab("L");
    return 0;
  };

  return (
    <>
      <Typography component={"div"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography className={styles.input_container} component={"div"}>
            <TextField
              className={styles.input}
              placeholder="Name"
              {...register("name", { required: true, pattern: NAME_REGEX })}
            />
            {errors.name && (
              <>
                {errors.name.type === "required" && (
                  <Typography className={styles.error} component={"div"}>
                    Name is required.
                  </Typography>
                )}
                {errors.name.type === "pattern" && (
                  <Typography className={styles.error} component={"div"}>
                    Name can only contain characters.
                  </Typography>
                )}
              </>
            )}
          </Typography>
          <Typography className={styles.input_container} component={"div"}>
            <TextField
              className={styles.input}
              placeholder="Email"
              {...register("email", { required: true, pattern: EMAIL_REGEX })}
            />
            {errors.email && (
              <>
                {errors.email.type === "required" && (
                  <Typography className={styles.error} component={"div"}>
                    Email is required.
                  </Typography>
                )}
                {errors.email.type === "pattern" && (
                  <Typography className={styles.error} component={"div"}>
                    Invalid Email.
                  </Typography>
                )}
              </>
            )}
          </Typography>
          <Typography className={styles.input_container} component={"div"}>
            <TextField
              className={styles.input}
              placeholder="Password"
              type={"password"}
              {...register("password", {
                required: true,
                pattern: PASSWORD_REGEX,
              })}
            />
            {errors.password && (
              <>
                {errors.password?.type === "required" && (
                  <Typography className={styles.error} component={"div"}>
                    Password is required.
                  </Typography>
                )}
                {errors.password?.type === "pattern" && (
                  <Typography className={styles.error} component={"div"}>
                    Invalid Password.
                  </Typography>
                )}
              </>
            )}
          </Typography>
          <Typography className={styles.input_container} component={"div"}>
            <TextField
              className={styles.input}
              type={"password"}
              placeholder="Re-type Password"
              {...register("reTypePassword", {
                required: true,
                pattern: PASSWORD_REGEX,
                validate: (val: string) => {
                  if (watch("password") !== val) {
                    return "Passwords do no match.";
                  }
                },
              })}
            />
            {errors.reTypePassword && (
              <>
                {errors.reTypePassword?.type === "required" && (
                  <Typography className={styles.error} component={"div"}>
                    Please re-enter password.
                  </Typography>
                )}
                {errors.reTypePassword?.type === "pattern" ? (
                  <Typography className={styles.error} component={"div"}>
                    Passwords do no match.
                  </Typography>
                ) : (
                  <>
                    {errors.reTypePassword?.type === "validate" && (
                      <Typography className={styles.error} component={"div"}>
                        Passwords do no match.
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Typography>
          <Typography component={"div"}>
            <Button variant="contained" className={styles.button} type="submit">
              Sign up
            </Button>
          </Typography>
        </form>
        {error && <Typography className={styles.global_error} component={"div"}>{error}</Typography>}
      </Typography>
    </>
  );
};
