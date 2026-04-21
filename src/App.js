import { useState } from "react";
import Asset from "./components/Asset";
import Vulnerability from "./components/Vulnerability";
import Threat from "./components/Threat";
import Risk from "./components/Risk";
import "./style.css";

function App() {
  // --- PENAMBAHAN DATA DUMMY (FITUR 1-6) ---
  const [assets, setAssets] = useState([
    { nama: "Mesin Deep Fryer", harga: "15.000.000" },
    { nama: "Sistem POS Kasir", harga: "10.000.000" },
  ]);
  const [vulns, setVulns] = useState([
    { nama: "Suhu Tidak Stabil", asset: "Mesin Deep Fryer" },
    { nama: "Software Belum Update", asset: "Sistem POS Kasir" },
  ]);
  const [threats, setThreats] = useState([
    { nama: "Kebakaran", vuln: "Suhu Tidak Stabil" },
    { nama: "Data Breach", vuln: "Software Belum Update" },
  ]);

  const [risks, setRisks] = useState([]);
  const [logs, setLogs] = useState([]);

  // --- PENAMBAHAN ROLE LOGIC (LEADER, MANAGER, CREW) ---
  const [userRole, setUserRole] = useState("leader");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set true untuk langsung lihat dashboard

  const [menu, setMenu] = useState("dashboard");

  const addLog = (action) => {
    const newLog = {
      action,
      time: new Date().toLocaleString(),
      user: userRole.toUpperCase(), // User otomatis sesuai role yang login
    };
    setLogs([newLog, ...logs]);
  };

  // --- LOGIKA LOGIN SEDERHANA ---
  if (!isLoggedIn) {
    return (
      <div
        className="d-flex align-items-center justify-content-center bg-danger text-white"
        style={{ height: "100vh" }}
      >
        <div className="text-center p-5 bg-white text-dark rounded shadow">
          <h2 className="mb-4">Richeese Risk System</h2>
          <button
            className="btn btn-danger w-100 mb-2"
            onClick={() => {
              setUserRole("leader");
              setIsLoggedIn(true);
            }}
          >
            Login as Leader
          </button>
          <button
            className="btn btn-warning w-100 mb-2"
            onClick={() => {
              setUserRole("manager");
              setIsLoggedIn(true);
            }}
          >
            Login as Manager
          </button>
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setUserRole("crew");
              setIsLoggedIn(true);
            }}
          >
            Login as Crew
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-danger shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            Risk Management System - Richeese Factory
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-white text-danger text-uppercase px-3 py-2">
              {userRole}
            </span>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex">
        {/* SIDEBAR DENGAN LOGIKA PEMBATASAN AKSES */}
        <div
          className="sidebar text-white p-3 shadow"
          style={{ width: "250px", minHeight: "100vh", background: "#1a1a1a" }}
        >
          <h4 className="text-center mb-4 border-bottom pb-2">Menu</h4>
          <ul className="nav flex-column gap-2">
            <li
              className={`nav-item p-2 rounded ${menu === "dashboard" ? "bg-danger" : ""}`}
              onClick={() => setMenu("dashboard")}
              style={{ cursor: "pointer" }}
            >
              📊 Dashboard
            </li>

            {/* Fitur 1-6 Hanya untuk Leader dan Manager */}
            {userRole !== "crew" && (
              <>
                <li
                  className={`nav-item p-2 rounded ${menu === "asset" ? "bg-danger" : ""}`}
                  onClick={() => setMenu("asset")}
                  style={{ cursor: "pointer" }}
                >
                  📦 Asset
                </li>
                <li
                  className={`nav-item p-2 rounded ${menu === "vuln" ? "bg-danger" : ""}`}
                  onClick={() => setMenu("vuln")}
                  style={{ cursor: "pointer" }}
                >
                  🔓 Vulnerability
                </li>
                <li
                  className={`nav-item p-2 rounded ${menu === "threat" ? "bg-danger" : ""}`}
                  onClick={() => setMenu("threat")}
                  style={{ cursor: "pointer" }}
                >
                  ⚠️ Threat
                </li>
              </>
            )}

            {/* Fitur 7-12: Risk Assessment (Semua Role) */}
            <li
              className={`nav-item p-2 rounded ${menu === "risk" ? "bg-danger" : ""}`}
              onClick={() => setMenu("risk")}
              style={{ cursor: "pointer" }}
            >
              🔍 Risk Assessment
            </li>

            {/* Fitur 11-12: Control (Leader & Manager Only) */}
            {userRole !== "crew" && (
              <li
                className={`nav-item p-2 rounded ${menu === "control" ? "bg-danger" : ""}`}
                onClick={() => setMenu("control")}
                style={{ cursor: "pointer" }}
              >
                🛡️ Control Management
              </li>
            )}

            {/* Fitur 13: History (Leader Only) */}
            {userRole === "leader" && (
              <li
                className={`nav-item p-2 rounded ${menu === "history" ? "bg-danger" : ""}`}
                onClick={() => setMenu("history")}
                style={{ cursor: "pointer" }}
              >
                🕒 Risk History
              </li>
            )}
          </ul>
        </div>

        {/* CONTENT */}
        <div className="p-4 w-100 content">
          {/* ===== DASHBOARD (UPGRADED) ===== */}
          {menu === "dashboard" && (
            <>
              <h2 className="mb-4">
                Welcome back,{" "}
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}!
              </h2>

              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card shadow border-0 border-start border-danger border-4 text-center p-3">
                    <h6 className="text-muted">Total Asset</h6>
                    <h3>{assets.length}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow border-0 border-start border-warning border-4 text-center p-3">
                    <h6 className="text-muted">High Risks</h6>
                    <h3>{risks.filter((r) => r.level === "High").length}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow border-0 border-start border-info border-4 text-center p-3">
                    <h6 className="text-muted">Mitigated Risks</h6>
                    <h3>
                      {risks.filter((r) => r.status === "Mitigated").length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow border-0 border-start border-success border-4 text-center p-3">
                    <h6 className="text-muted">Total Risks</h6>
                    <h3>{risks.length}</h3>
                  </div>
                </div>
              </div>

              {/* Alert Khusus Crew/Leader Jika Ada High Risk (Sesuai Prototype) */}
              {risks.some((r) => r.level === "High") && (
                <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-3">
                  <div style={{ fontSize: "2rem" }}>⚠️</div>
                  <div>
                    <strong>Critical Risk Detected!</strong>
                    <p className="mb-0 small">
                      Terdapat {risks.filter((r) => r.level === "High").length}{" "}
                      risiko kategori HIGH yang butuh tindakan segera.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== MENU RENDER (LAINNYA TETAP) ===== */}
          {menu === "asset" && <Asset assets={assets} setAssets={setAssets} />}
          {menu === "vuln" && (
            <Vulnerability vulns={vulns} setVulns={setVulns} assets={assets} />
          )}
          {menu === "threat" && (
            <Threat threats={threats} setThreats={setThreats} vulns={vulns} />
          )}

          {/* FITUR 7-12: Melewatkan ROLE ke Komponen Risk */}
          {menu === "risk" && (
            <Risk
              assets={assets}
              vulns={vulns}
              threats={threats}
              risks={risks}
              setRisks={setRisks}
              addLog={addLog}
              userRole={userRole}
            />
          )}

          {/* Menu Control & History Tetap Sesuai Code Anda */}
          {menu === "control" && (
            <div className="card p-4 shadow border-0">
              <h2 className="mb-4 text-danger">Control & Monitoring</h2>
              <table className="table table-hover">
                <thead className="table-danger">
                  <tr>
                    <th>Asset</th>
                    <th>Risk</th>
                    <th>Strategy</th>
                    <th>Control Action</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-bold">{r.asset}</td>
                      <td>{r.threat}</td>
                      <td>
                        <span className="badge bg-info">{r.treatment}</span>
                      </td>
                      <td>{r.control || "No control defined"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {menu === "history" && (
            <div className="card p-4 shadow border-0">
              <h2 className="mb-4 text-danger">Risk History Log</h2>
              <ul className="list-group">
                {logs.map((log, i) => (
                  <li
                    key={i}
                    className="list-group-item border-start border-danger border-4 mb-2"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-danger">{log.user}</strong>
                      <small className="text-muted">{log.time}</small>
                    </div>
                    <div className="mt-1">{log.action}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
