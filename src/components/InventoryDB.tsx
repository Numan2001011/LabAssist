import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

interface Product {
  //name must be same to database column name
  product_id: number;
  product_name: string;
  quantity: number;
}

const InventoryDB = () => {
  const [togglebar, setTogglebar] = useState(false);
  const ShowHeader = () => {
    setTogglebar(!togglebar);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedid, setSelectedId] = useState(0);
  const [prodname, setProdName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/inventory");
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once on component mount

  let error = "";
  const handleSave = async () => {
    if (prodname === "" || quantity <= 0) {
      error = "All fields must be valid.";
    } else {
      error = "";
      try {
        await axios.post("http://localhost:5000/api/inventory/create", {
          product_name: prodname,
          quantity: quantity,
        });
        //handleClear();
        fetchData(); // Fetch updated data after saving
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/inventory/update/${selectedid}`,
        {
          product_name: prodname,
          quantity: quantity,
        }
      );
      handleClear();
      fetchData(); // Fetch updated data after updating
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEdit = (productId: number) => {
    const selectedProduct = products.find(
      (item) => item.product_id === productId
    );
    if (selectedProduct) {
      setSelectedId(selectedProduct.product_id);
      setProdName(selectedProduct.product_name);
      setQuantity(selectedProduct.quantity);
      setIsUpdate(true);
    }
  };
  const handleClear = () => {
    setProdName("");
    setQuantity(0);
    setSelectedId(0);
    setIsUpdate(false); // Also reset the update mode
  };

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/inventory/delete/${productId}`
      );
      // Filter out the deleted product from the state
      setProducts(products.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
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
                <Link to="/login/profile" className="nav-menu-link">
                  Profile
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link
                  to="/login"
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

      <div className="p-2 text-center mt-5">
        <div className="d-flex justify-content-center align-items-center gap-3  mb-2">
          
          <div className="">
            <label htmlFor="prodname" className=" fw-bold">
              Product Name:
            </label>
            <input
              className="text-center"
              type="text"
              id="prodname"
              placeholder="Enter Product name"
              onChange={(event) => setProdName(event.target.value)}
              value={prodname}
            />
          </div>
          <div className="">
            <label htmlFor="prodqty" className="fw-bold">
              Quantity:
            </label>
            <input
              className="text-center"
              type="text"
              id="prodqty"
              placeholder="Enter quantity"
              onChange={(event) => setQuantity(parseInt(event.target.value))}
              value={quantity}
            />
          </div>
          <div className="d-flex gap-2">
            {isUpdate ? (
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button className="btn btn-primary hover" onClick={handleSave}>
                Save
              </button>
            )}
            <button className="btn btn-warning" onClick={handleClear}>
              Clear
            </button>
          </div>
          {error != "" ? <p className="text-danger">{error}</p> : <p></p>}
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th className="fw-bold">Product ID</th>
              <th className="fw-bold">Product Name</th>
              <th className="fw-bold">Quantity</th>
              <th className="fw-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider table-divider-color">
            {products.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleEdit(item.product_id)}
                  >
                    Edit
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.product_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDB;
