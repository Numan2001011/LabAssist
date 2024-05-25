import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const emailSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?bdu\.ac\.bd$/,
      "Must follow 'example@bdu.ac.bd' format"
    ),
});

const pwdSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password cannot exceed 20 characters."),
});
const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
});

type emailData = z.infer<typeof emailSchema>;
type pwdData = z.infer<typeof pwdSchema>;
type otpData = z.infer<typeof otpSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<emailData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const {
    register: pwdRegister,
    handleSubmit: pwdHandleSubmit,
    formState: { errors: pwdErrors, isValid: pwdIsValid },
  } = useForm<pwdData>({ resolver: zodResolver(pwdSchema), mode: "onChange" });
  const {
    register: otpRegister,
    handleSubmit: otpHandleSubmit,
    formState: { errors: otpErrors, isValid: otpIsValid },
  } = useForm<otpData>({ resolver: zodResolver(otpSchema), mode: "onChange" });

  const [emaildata, setEmailData] = useState<FieldValues>();

  const [message, setMessage] = useState("");
  const [header, setHeader] = useState(
    "First enter your email to find the valid user."
  );
  const navigate = useNavigate();

  const [finduser, setFindUser] = useState(false);

  //Form submit function
  const onEmailSubmit = async (data: FieldValues) => {
    setEmailData(data);
    console.log("Login data: ", emaildata);
    if (data) {
      try {
        console.log("My Form data: ", data);
        const response = await axios.post(
          "http://localhost:5000/forgotpass/finduser",
          data
        );

        if (response.status == 200) {
          setFindUser(true);
          setHeader("Please enter OTP from your email to verify the user.");
        }
      } catch (error) {
        if ((error as AxiosError).response?.status === 400) {
          setMessage("Email not found.");
        } else {
          console.error("Error:", error);
        }
      }
    } else {
      alert("Email API failed.");
    }
  };

  const [onOtp, setOnOtp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [otpmessage, setOtpMessage] = useState("");

  const onOtpSubmit = async (data: FieldValues) => {
    const otpdata = data;
    const fulldata = { ...emaildata, ...otpdata };
    console.log("OTP in frontend: ", fulldata);

    if (otpdata != null) {
      try {
        const response = await axios.post(
          "http://localhost:5000/forgotpass/verifyuser",
          fulldata
        );
        if (response.status == 200) {
          setOnOtp(true);
        }
      } catch (error) {
        if ((error as AxiosError).response?.status === 400) {
          setOtpMessage("OTP did not match");
        } else {
          console.error("Error:", error);
        }
      } // Log the response if needed
    } else {
      alert("Otp Api failed");
    }
  };

  const onPwdSubmit = async (data: FieldValues) => {

    const userdata = { ...emaildata, ...data };
    console.log("Login data: ", userdata);
    if (data) {
      try {
        console.log("My pass data: ", data);
        const response = await axios.post(
          "http://localhost:5000/forgotpass/updatepwd",
          userdata
        );

        if (response.status == 200) {
          setFindUser(true);
          alert("Password recovered successfully. Login with new password.");
          navigate("/login");
        }
      } catch (error) {
        if ((error as AxiosError).response?.status === 400) {
          setMessage("User not found.");
        } else {
          console.error("Error:", error);
        }
      }
    } else {
      alert("Login data is null");
    }
  };
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
                  <h2 className="text-center mb-5" style={{ color: "#191970" }}>
                    Password Recovery
                  </h2>

                  <form onSubmit={handleSubmit(onEmailSubmit)}>
                    <h5 className="text-center" style={{ color: "#228B22" }}>
                      {header}
                    </h5>
                    <div className="mb-1 d-flex flex-column">
                      <label
                        className="form-label fw-bold fs-5"
                        htmlFor="email"
                      >
                        Email:
                      </label>
                      <div className="d-flex flex-row">
                        <input
                          type="text"
                          id="email"
                          {...register("email")}
                          className={
                            errors.email
                              ? "form-control form-control-md border border-danger"
                              : "form-control form-control-md border border-dark"
                          }
                          placeholder="i.e. example@bdu.ac.bd"
                        />
                        <button
                          type="submit"
                          disabled={!isValid || finduser}
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className=" mx-1 text-nowrap btn-block btn-md"
                          style={{
                            backgroundColor: "#6F42C1",
                            color: "white",
                            border: "none",
                            padding: "5px",

                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Find User
                        </button>
                      </div>

                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
                        </small>
                      )}
                      {message && (
                        <small className="text-danger">{message}</small>
                      )}
                    </div>
                  </form>

                  <form onSubmit={otpHandleSubmit(onOtpSubmit)}>
                    {finduser && (
                      <div className="p-2 mb-2 mt-2 d-flex flex-column border border-dark">
                        <p className="text-center">
                          We have sent an OTP to your email address.
                        </p>
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          {onOtp ? (
                            <div className="p-2 mb-2 mt-2 fs-5 fw-bold text-success">
                              Verified. Now enter new password.
                            </div>
                          ) : (
                            <>
                              <div className="text-center ml-1 col-md-12 col-sm-12">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="otp"
                                >
                                  Enter OTP
                                </label>
                              </div>
                              <div className="col-md-4 col-sm-4">
                                <input
                                  type="text"
                                  id="otp"
                                  {...otpRegister("otp")}
                                  className={
                                    otpErrors.otp
                                      ? "text-center form-control form-control-md border border-danger"
                                      : "text-center form-control form-control-md border border-dark"
                                  }
                                  placeholder="Enter OTP"
                                />
                              </div>
                              <div>
                                {otpErrors.otp && (
                                  <small className="text-danger">
                                    {otpErrors.otp.message}
                                  </small>
                                )}
                                {otpmessage && (
                                  <small className="text-danger">
                                    {otpmessage}
                                  </small>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                            disabled={!otpIsValid}
                            // onClick={verifyOtp}
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

                  <form onSubmit={pwdHandleSubmit(onPwdSubmit)}>
                    {onOtp && (
                      <>
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
                                pwdErrors.password
                                  ? "form-control form-control-md border border-danger"
                                  : "form-control form-control-md border border-dark"
                              }
                              id="password"
                              {...pwdRegister("password")}
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
                          {pwdErrors.password && (
                            <small className="text-danger">
                              {pwdErrors.password.message}
                            </small>
                          )}
                          {message && (
                            <small className="text-danger">{message}</small>
                          )}
                        </div>
                        <button
                          disabled={!pwdIsValid}
                          type="submit"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-success w-100 mt-2 btn-block btn-lg gradient-custom-4"
                        >
                          Register
                        </button>
                      </>
                    )}
                  </form>

                  <div className="text-center mt-5 mb-0 border border-primary border-2 rounded p-2 shadow hover-bg">
                    <Link
                      to="/login"
                      className="btn fw-bold text-decoration-none "
                    >
                      Go to Log In
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
