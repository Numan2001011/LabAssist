import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const loginSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?bdu\.ac\.bd$/,
      "Must follow 'example@bdu.ac.bd' format"
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

type loginData = z.infer<typeof loginSchema>;
type otpData = z.infer<typeof otpSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<loginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const [logindata, setLoginData] = useState<FieldValues>();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //Form submit function and set form data
  const onLoginSubmit = async (data: FieldValues) => {
    setLoginData(data);
    console.log("Login data: ", logindata);
    if (data) {
      try {
        console.log("My Form data: ", data);
        const response = await axios.post(
          "http://localhost:5000/users/login",
          data
        );

        if (response.status == 200) {
          setTimeout(() => {
            navigate("/login/profile", { state: { logindata: data } });
            alert("Login Successful.");
          }, 2000);
        }
      } catch (error) {
        if ((error as AxiosError).response?.status === 400) {
          setMessage("Password did not match");
        } else {
          console.error("Error:", error);
        }
      }
    } else {
      alert("Login data is null");
    }
  };

  const [login, setLogin] = useState(false);
  //Login button  submission
  const handleLogin = () => {
    setLogin(true); //Login button clicked
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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [forgotpass, setForgotPass] = useState(false);
  //forgot pass link clicked
  const linkClicked = () => {
    setForgotPass(true);
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
                  <h2 className="text-uppercase text-center mb-5">LOG IN</h2>

                  <form onSubmit={handleSubmit(onLoginSubmit)}>
                    <div className="mb-1 d-flex flex-column">
                      <label
                        className="form-label fw-bold fs-5"
                        htmlFor="email"
                      >
                        Email:
                      </label>
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
                        // onChange={event=>setLoginData({...logindata, unameoremail: event.target.value})}
                        //   value={logindata.unameoremail}
                      />
                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
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
                      {message && (
                        <small className="text-danger">{message}</small>
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
                        <Link to="/forgotpass" className="text-decoration-none">
                          Forgot password?
                        </Link>
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

                  <div className="text-center mt-5 mb-0 border border-primary border-2 rounded p-2 shadow hover-bg">
                    <Link
                      to="/registration"
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
