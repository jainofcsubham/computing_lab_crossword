import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDatabaseContext } from "../../context/data.service";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "../../utils/constant";
import { RegisterForm } from "../../utils/interface";

export const Register: React.FC = () => {
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
  },[]);

  const onSubmit: SubmitHandler<RegisterForm> = ({ email, password, name }):number => {
    const response = registerUser({ email, isAdmin: false, password, name });
    if(response.status === -1){
      setError(response.message);
      return 0;
    }
    navigate("/login");
    return 0;
  };

  return (
    <>
      <div>
        <div>Register</div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                placeholder="Name"
                {...register("name", { required: true, pattern: NAME_REGEX })}
              />
              {errors.name && (
                <>
                  {errors.name.type === "required" && (
                    <div>Name is required.</div>
                  )}
                  {errors.name.type === "pattern" && (
                    <div>Name can only contain characters.</div>
                  )}
                </>
              )}
            </div>
            <div>
              <input
                placeholder="Email"
                {...register("email", { required: true, pattern: EMAIL_REGEX })}
              />
              {errors.email && (
                <>
                  {errors.email.type === "required" && (
                    <div>Email is required.</div>
                  )}
                  {errors.email.type === "pattern" && <div>Invalid Email.</div>}
                </>
              )}
            </div>
            <div>
              <input
                placeholder="Password"
                {...register("password", {
                  required: true,
                  pattern: PASSWORD_REGEX,
                })}
              />
              {errors.password && (
                <>
                  {errors.password?.type === "required" && (
                    <div className="error">Password is required.</div>
                  )}
                  {errors.password?.type === "pattern" && (
                    <div className="error">
                      Password should be alphanumeric with at least 8 characters
                      having at least one special character.
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <input
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
                    <div className="error">Please re-enter password.</div>
                  )}
                  {errors.reTypePassword?.type === "pattern" ? (
                    <div className="error">Passwords do no match.</div>
                  ) : (
                    <>
                      {errors.reTypePassword?.type === "validate" && (
                        <div className="error">Passwords do no match.</div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
          {
            error && (<div>{error}</div>)
          }
        </div>
      </div>
    </>
  );
};
