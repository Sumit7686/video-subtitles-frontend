import React, { useState } from "react";
import "./index.css";
import Navbar from "./Navbar";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import AddVideo from "./pages/AddVideo";
import AddSubtitle from "./pages/addSubtitle";

export default function App() {
  const navigate = useNavigate();
  const [sidebarShow, setSidebarShow] = useState(false);
  return (
    <div>
      <div className="wrapper">
        <nav id="sidebar" className={`${sidebarShow && "active"}`}>
          <div className="sidebar-header">
            <h3 className="text-center">Video App</h3>
          </div>
          <ul className="list-unstyled components">
            <li
              className={`${
                window.location.pathname.split("/")[1] === "" && "active"
              }`}
            >
              <a onClick={() => navigate("/")}>Add Video</a>
            </li>
            <li
              className={`${
                window.location.pathname.split("/")[1] === "addsubtitle" &&
                "active"
              }`}
            >
              <a onClick={() => navigate("/addsubtitle")}>Add subtitle</a>
            </li>
          </ul>
        </nav>
        <div id="content">
          <Navbar setSidebarShow={setSidebarShow} sidebarShow={sidebarShow} />
          <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<AddVideo />} />
            <Route path="/addsubtitle" element={<AddSubtitle />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
