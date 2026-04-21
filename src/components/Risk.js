import { useState } from "react";

function Risk({ assets, vulns, threats, risks, setRisks, addLog, userRole }) {
  // ⭐ Ditambahkan props: addLog & userRole
  const [asset, setAsset] = useState("");
  const [vuln, setVuln] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState("");
  const [impact, setImpact] = useState("");
  const [treatment, setTreatment] = useState("Mitigate"); // Fitur 10
  const [control, setControl] = useState(""); // Fitur 11

  const tambahRisk = () => {
    if (!asset || !vuln || !threat || !likelihood || !impact || !control) {
      return alert("Lengkapi semua data termasuk rencana kontrol!");
    }

    const score = Number(likelihood) * Number(impact);
    let level = score <= 3 ? "Low" : score <= 6 ? "Medium" : "High";

    const newRisk = {
      asset,
      vuln,
      threat,
      likelihood,
      impact,
      score,
      level,
      treatment,
      control,
    };

    setRisks([...risks, newRisk]);

    // ⭐ Fitur 13: Mencatat ke History (DIPERBAIKI penulisan backtick-nya)
    if (addLog) {
      addLog(
        `Menambahkan risiko baru: ${threat} pada asset ${asset} dengan strategi ${treatment}`,
      );
    }

    setAsset("");
    setVuln("");
    setThreat("");
    setLikelihood("");
    setImpact("");
    setControl(""); // Reset field control
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Risk Management & Treatment</h2>
        <span className="badge bg-dark">Role: {userRole}</span>
      </div>

      {/* Form Input hanya muncul jika bukan Crew (Opsional sesuai Prototype) */}
      {userRole !== "crew" && (
        <div className="card p-3 shadow-sm mb-4 border-0">
          <label className="fw-bold small">
            Pilih Asset, Vulnerability & Threat
          </label>
          <select
            className="form-control mb-2"
            value={asset}
            onChange={(e) => {
              setAsset(e.target.value);
              setVuln("");
              setThreat("");
            }}
          >
            <option value="">Asset</option>
            {assets.map((a, i) => (
              <option key={i}>{a.nama}</option>
            ))}
          </select>

          <select
            className="form-control mb-2"
            value={vuln}
            onChange={(e) => {
              setVuln(e.target.value);
              setThreat("");
            }}
          >
            <option value="">Vulnerability</option>
            {vulns
              .filter((v) => v.asset === asset)
              .map((v, i) => (
                <option key={i}>{v.nama}</option>
              ))}
          </select>

          <select
            className="form-control mb-2"
            value={threat}
            onChange={(e) => setThreat(e.target.value)}
          >
            <option value="">Threat</option>
            {threats
              .filter((t) => t.vuln === vuln)
              .map((t, i) => (
                <option key={i}>{t.nama}</option>
              ))}
          </select>

          <div className="d-flex gap-2 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Likelihood (1-3)"
              value={likelihood}
              onChange={(e) => setLikelihood(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Impact (1-3)"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>

          <label className="mt-2 fw-bold small">
            Risk Treatment Strategy (Fitur 10)
          </label>
          <select
            className="form-control mb-2"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          >
            <option value="Avoid">Avoid (Menghindari)</option>
            <option value="Mitigate">Mitigate (Mengurangi)</option>
            <option value="Transfer">Transfer (Memindahkan)</option>
            <option value="Accept">Accept (Menerima)</option>
          </select>

          <label className="fw-bold small">
            Control Management Plan (Fitur 11)
          </label>
          <textarea
            className="form-control mb-2"
            placeholder="Rencana Kontrol / Mitigasi (Contoh: Pelatihan staf atau pemasangan alat)"
            value={control}
            onChange={(e) => setControl(e.target.value)}
          />

          <button className="btn btn-danger w-100" onClick={tambahRisk}>
            Simpan & Hitung Risiko
          </button>
        </div>
      )}

      {/* ===== TABLE MONITORING (FITUR 12) ===== */}
      <h3 className="mt-4">Risk Monitoring Board</h3>
      <table className="table table-bordered bg-white shadow-sm">
        <thead className="table-danger">
          <tr>
            <th>Asset</th>
            <th>Threat</th>
            <th>Score</th>
            <th>Level</th>
            <th>Treatment</th> {/* ⭐ Ditambahkan kolom */}
            <th>Control Plan</th> {/* ⭐ Ditambahkan kolom */}
          </tr>
        </thead>
        <tbody>
          {risks.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Belum ada data risiko.
              </td>
            </tr>
          ) : (
            risks.map((r, i) => (
              <tr key={i}>
                <td>{r.asset}</td>
                <td>{r.threat}</td>
                <td>{r.score}</td>
                <td
                  className={
                    r.level === "High"
                      ? "text-danger fw-bold"
                      : r.level === "Medium"
                        ? "text-warning fw-bold"
                        : "text-success fw-bold"
                  }
                >
                  {r.level}
                </td>
                <td>
                  <span className="badge bg-info text-dark">{r.treatment}</span>
                </td>
                <td>
                  <small>{r.control}</small>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== RISK MATRIX (Tetap sama) ===== */}
      <h3 className="mt-5">Risk Matrix Heatmap</h3>
      <p>
        <strong>Impact ↑</strong>
      </p>
      <div className="matrix mb-2">
        {[3, 2, 1].map((impactRow) => (
          <div className="matrix-row" key={impactRow}>
            {[1, 2, 3].map((likeCol) => {
              const found = risks.find(
                (r) =>
                  Number(r.likelihood) === likeCol &&
                  Number(r.impact) === impactRow,
              );
              let level = found ? found.level : "";
              return (
                <div
                  key={likeCol}
                  className={`matrix-cell ${level.toLowerCase()}`}
                >
                  {level || "-"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p>
        <strong>Likelihood →</strong>
      </p>
    </>
  );
}

export default Risk;
