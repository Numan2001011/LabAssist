import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./components/Profile";
import InventoryDB from "./components/InventoryDB";
import Documentation from "./components/Documentation";
import Forgotpass from "./components/Forgotpass";
import Items from "./components/products/Items";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documentation" element={<Documentation />}></Route>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpass" element={<Forgotpass />} />
          <Route path="/login/profile" element={<Profile />} />
          <Route path="/login/inventory" element={<InventoryDB />} />
          <Route path="/login/items" element={<Items />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
