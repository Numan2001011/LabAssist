import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Login/Profile" element={<Profile />} />
        
      </Routes>
    </Router>
    </>
  );
}
export default App;
