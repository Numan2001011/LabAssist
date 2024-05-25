import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const { logindata } = location.state || {};

  const [userdata, setUserdata] = useState([]);
  const [usertype, setUsertype] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [session, setSession] = useState("");
  const [userid, setUserid] = useState(null);
  const [phone_no, setPhone_no] = useState("");

  const [togglebar, setTogglebar] = useState(false);
  const ShowHeader = () => {
    setTogglebar(!togglebar);
  };

  const fetchData = async () => {
    try {
      console.log("hello");
      const response = await axios.get(
        "http://localhost:5000/profile/showdata"
      );
      console.log("Response from db:", response.data);
      setUserdata(response.data);
      console.log("Hello");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userdata]);
  return (
    <>
      <header className="header">
        <nav className="h-nav">
          <div className="h-nav-div">
            <h2 className="h-nav-div-h2">LabAssist</h2>
          </div>
          <div
            className={togglebar ? "nav-menu show" : "nav-menu"}
            id="nav-menu"
          >
            <button
              className="nav-menu-close-btn"
              id="nav-menu-close-btn"
              onClick={ShowHeader}
            >
              <i className="fa fa-window-close"></i>
            </button>
            <ul className="nav-menu-list">
              <li className="nav-menu-item">
                <Link to="/" className="nav-menu-link">
                  Home
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/Login/Profile" className="nav-menu-link">
                  Profile
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link
                  to=""
                  id="home-login-btn"
                  className="nav-menu-link text-decoration-none text-white"
                >
                  LOGOUT
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="nav-menu-toggle-btn"
            id="toggle-btn"
            onClick={ShowHeader}
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
        </nav>
      </header>

      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-2">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px" }}
                  />
                  <h5 className="my-3">{userdata.username}</h5>
                  <p className="text-muted mb-1">
                    User Type: {userdata.usertype}
                  </p>
                  <div className="d-grid col-6 mx-auto ">
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-outline-success mt-3 ms-1 mb-2"
                    >
                      Instruments
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-outline-success ms-1 mb-2"
                    >
                      Requests
                    </button>
                    <Link
                      to="/login/inventory"
                      className="text-decoration-none btn btn-outline-success ms-1 mb-2"
                    >
                      Inventory
                    </Link>
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-outline-success ms-1 mb-2"
                    >
                      Searching
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="d-flex bg-info bg-opacity-75 shadow-sm">
                  <h2 className="mx-auto mt-2 mb-3">User's Info</h2>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.name}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">Department</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.dept}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">Session</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.session}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">User ID</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.student_id}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0 fw-bold">Phone no</p>
                    </div>
                    <div className="col-sm-9">
                      <p className=" mb-0">{userdata.phone_no}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div
          className="text-center p-2"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          All rights reserved @LabAssist
        </div>
      </footer>
    </>
  );
};

export default Profile;
