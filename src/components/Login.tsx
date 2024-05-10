import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { Link } from "react-router-dom";

const regSchema = z.object({
  emailorusername: z
    .string()
    .regex(
      /^(?:[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?bdu\.ac\.bd|(?=.{1,})[a-zA-Z][a-zA-Z0-9_-]*)$/,
      "Must be either a valid email or username"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password cannot exceed 20 characters."),
});
const otpSchema = z.object({
  otp: z
    .number({ invalid_type_error: "OTP is 6 digits number." })
    .int()
    .min(100000, "OTP is 6 digits number")
    .max(999999, "OTP is 6 digits number"),
});

type regData = z.infer<typeof regSchema>;
type otpData = z.infer<typeof otpSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<regData>({ resolver: zodResolver(regSchema), mode: "onChange" });

  const {
    register: otpRegister,
    handleSubmit: otpHandleSubmit,
    formState: { errors: otpErrors, isValid: otpIsValid },
  } = useForm<otpData>({ resolver: zodResolver(otpSchema), mode: "onChange" });

  const [logindata, setLoginData] = useState<FieldValues | null>(null);
  //Form submit function and set form data
  const onLoginSubmit = (data: FieldValues) => {
    setLoginData(data);
    console.log(logindata);
  };

  const [login, setLogin] = useState(false);
  //Login button  submission
  const handleLogin = () => {
    setLogin(true);//Login button clicked
  };
  const [otpData, setOtpData] = useState<FieldValues | null>(null);

  const onOtpSubmit = (data: FieldValues) => {
    // console.log(data);
    setOtpData(data);
  };
  const [onOtp, setOnOtp] = useState(false);
  const verifyOtp = () => {
    setOnOtp(true);
  };
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // const handleButtonClick = () => {
  //   console.log("New Account Created");
  // };
  const [forgotpass, setForgotPass] = useState(false);
  //forgot pass link clicked
  const linkClicked = () =>{
    setForgotPass(true);
  }

  return (
    <section
      className="vh-auto bg-image"
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/new/fluid/nature/015.webp)",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-5 col-sm-12">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">LOG IN</h2>

                  <form onSubmit={handleSubmit(onLoginSubmit)}>
                    <div className="mb-1 d-flex flex-column">
                      <label
                        className="form-label fw-bold fs-5"
                        htmlFor="emailoruname"
                      >
                        Email or Username:
                      </label>
                      <input
                        type="text"
                        id="emailoruname"
                        {...register("emailorusername")}
                        className={
                          errors.emailorusername
                            ? "form-control form-control-md border border-danger"
                            : "form-control form-control-md border border-dark"
                        }
                        placeholder="i.e. example@bdu.ac.bd"
                      />
                      {errors.emailorusername && (
                        <small className="text-danger">
                          {errors.emailorusername.message}
                        </small>
                      )}
                    </div>

                    <div className="mb-1 d-flex flex-column">
                      <label
                        className="form-label fw-bold fs-5"
                        htmlFor="password"
                      >
                        Password:
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={
                            errors.password
                              ? "form-control form-control-md border border-danger"
                              : "form-control form-control-md border border-dark"
                          }
                          id="password"
                          {...register("password")}
                          placeholder="Password"
                        />

                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <BiHide /> : <BiShow />}
                        </button>
                      </div>
                      {errors.password && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </div>

                    <div className="row mb-4">
                      <div className="col d-flex justify-content-space-around">
                        <div className="form-check">
                          <input
                            className="form-check-input border border-dark"
                            type="checkbox"
                            // value=""
                            id="checkbox"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="checkbox"
                          >
                            {" "}
                            Remember me{" "}
                          </label>
                        </div>
                      </div>

                      <div className="col">
                        <a onClick={linkClicked} className="text-decoration-none " href="#!">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        onClick={handleLogin}
                        disabled={!isValid}
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-primary btn-block btn-lg gradient-custom-4"
                      >
                        Log in
                      </button>
                    </div>
                  </form>

                  <form onSubmit={otpHandleSubmit(onOtpSubmit)}>
                    {forgotpass && (
                      <div className="p-2 mb-2 mt-2 d-flex flex-column border border-dark">
                        <p>We have sent an OTP to your email address.</p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                          {onOtp ? (
                            <div className="p-2 mb-2 mt-2 fs-5 fw-bold text-success">
                              Verified
                            </div>
                          ) : (
                            <>
                              <div className="ml-1 col-md-3 col-sm-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="otp"
                                >
                                  Enter OTP:
                                </label>
                              </div>
                              <div className="col-md-5 col-sm-5">
                                <input
                                  type="text"
                                  id="otp"
                                  {...otpRegister("otp", {
                                    valueAsNumber: true,
                                  })}
                                  className={
                                    otpErrors.otp
                                      ? "form-control form-control-md border border-danger"
                                      : "form-control form-control-md border border-dark"
                                  }
                                  placeholder="Enter OTP"
                                />
                                {otpErrors.otp && (
                                  <small className="text-danger">
                                    {otpErrors.otp.message}
                                  </small>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                            disabled={!otpIsValid}
                            onClick={verifyOtp}
                            type="submit"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-primary mt-2 col-sm-4 btn-block btn-md gradient-custom-4"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="text-center mt-5 mb-0 border border-primary border-2 rounded p-2 shadow hover-bg">
                      <Link
                        to="/Registration"
                        className="btn fw-bold text-decoration-none"
                      >
                        Create New Account
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
