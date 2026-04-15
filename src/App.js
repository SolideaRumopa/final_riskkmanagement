import { useState } from "react";
import Asset from "./components/Asset";
import Vulnerability from "./components/Vulnerability";
import Threat from "./components/Threat";
import Risk from "./components/Risk";
import "./style.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [threats, setThreats] = useState([]);
  const [risks, setRisks] = useState([]);
  const [logs, setLogs] = useState([]);

  const [menu, setMenu] = useState("dashboard");
  const addLog = (action) => {
    const newLog = {
      action,
      time: new Date().toLocaleString(),
      user: "Admin Richeese", //bisa di sesuaikan
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-danger">
        <div className="container-fluid">
          <span className="navbar-brand">Risk Management System</span>
        </div>
      </nav>

      <div className="d-flex">
        {/* SIDEBAR */}
        <div
          className="sidebar text-white p-3"
          style={{ width: "250px", minHeight: "100vh" }}
        >
          <h4>Menu</h4>
          <ul className="nav flex-column">
            <li
              className="nav-item mb-2"
              onClick={() => setMenu("dashboard")}
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </li>

            <li
              className="nav-item mb-2"
              onClick={() => setMenu("asset")}
              style={{ cursor: "pointer" }}
            >
              Asset
            </li>

            <li
              className="nav-item mb-2"
              onClick={() => setMenu("vuln")}
              style={{ cursor: "pointer" }}
            >
              Vulnerability
            </li>

            <li
              className="nav-item mb-2"
              onClick={() => setMenu("threat")}
              style={{ cursor: "pointer" }}
            >
              Threat
            </li>

            <li
              className="nav-item mb-2"
              onClick={() => setMenu("risk")}
              style={{ cursor: "pointer" }}
            >
              Risk
            </li>

            <li
              className="nav-item mb-2"
              onClick={() => setMenu("control")}
              style={{ cursor: "pointer" }}
            >
              Control Management
            </li>
            <li
              className="nav-item mb-2"
              onClick={() => setMenu("history")}
              style={{ cursor: "pointer" }}
            >
              Risk History
            </li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="p-4 w-100 content">
          {/* ===== DASHBOARD ===== */}
          {menu === "dashboard" && (
            <>
              <h2 className="mb-4">Dashboard</h2>

              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card shadow text-center p-3">
                    <h6>Total Asset</h6>
                    <h3>{assets.length}</h3>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow text-center p-3">
                    <h6>Total Vulnerability</h6>
                    <h3>{vulns.length}</h3>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow text-center p-3">
                    <h6>Total Threat</h6>
                    <h3>{threats.length}</h3>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card shadow text-center p-3">
                    <h6>Total Risk</h6>
                    <h3>{risks.length}</h3>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== MENU RENDER ===== */}

          {menu === "asset" && <Asset assets={assets} setAssets={setAssets} />}

          {menu === "vuln" && (
            <Vulnerability
              vulns={vulns}
              setVulns={setVulns}
              assets={assets} // 🔥 INI YANG DITAMBAHKAN
            />
          )}

          {menu === "threat" && (
            <Threat
              threats={threats}
              setThreats={setThreats}
              vulns={vulns} // 🔥 SIAP UNTUK STEP BERIKUTNYA
            />
          )}

          {menu === "risk" && (
            <Risk
              assets={assets}
              vulns={vulns}
              threats={threats}
              risks={risks}
              setRisks={setRisks}
              addLog={addLog}
            />
          )}

          {menu === "control" && (
            <div className="card p-4 shadow">
              <h2>Control & Monitoring</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Risk</th>
                    <th>Treatment Strategy</th>
                    <th>Control Action</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r, i) => (
                    <tr key={i}>
                      <td>{r.asset}</td>
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
            <div className="card p-4 shadow">
              <h2>Risk History Log</h2>
              <ul className="list-group">
                {logs.map((log, i) => (
                  <li key={i} className="list-group-item">
                    <small className="text-danger font-weight-bold">
                      {log.user}
                    </small>{" "}
                    - {log.action}
                    <br />
                    <small className="text-muted">{log.time}</small>
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
