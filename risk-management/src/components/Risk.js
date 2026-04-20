import { useState } from "react";

function Risk({ assets, vulns, threats, risks, setRisks }) {

  const [asset, setAsset] = useState("");
  const [vuln, setVuln] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState("");
  const [impact, setImpact] = useState("");

  const tambahRisk = () => {
    if (!asset || !vuln || !threat || !likelihood || !impact) {
      return alert("Lengkapi semua!");
    }

    const score = Number(likelihood) * Number(impact);
    let level = score <= 3 ? "Low" : score <= 6 ? "Medium" : "High";

    setRisks([...risks, {
      asset, vuln, threat, likelihood, impact, score, level
    }]);

    setAsset("");
    setVuln("");
    setThreat("");
    setLikelihood("");
    setImpact("");
  };

  return (
    <>
      <h2>Risk</h2>

      {/* ===== ASSET ===== */}
      <select 
        className="form-control mb-2" 
        value={asset} 
        onChange={(e)=>{
          setAsset(e.target.value);
          setVuln("");   // reset vuln
          setThreat(""); // reset threat
        }}
      >
        <option value="">Asset</option>
        {assets.map((a,i)=><option key={i}>{a.nama}</option>)}
      </select>

      {/* ===== VULNERABILITY (FILTER BY ASSET) ===== */}
      <select 
        className="form-control mb-2" 
        value={vuln} 
        onChange={(e)=>{
          setVuln(e.target.value);
          setThreat(""); // reset threat
        }}
      >
        <option value="">Vulnerability</option>
        {vulns
          .filter((v) => v.asset === asset)
          .map((v,i)=><option key={i}>{v.nama}</option>)
        }
      </select>

      {/* ===== THREAT (FILTER BY VULN) ===== */}
      <select 
        className="form-control mb-2" 
        value={threat} 
        onChange={(e)=>setThreat(e.target.value)}
      >
        <option value="">Threat</option>
        {threats
          .filter((t) => t.vuln === vuln)
          .map((t,i)=><option key={i}>{t.nama}</option>)
        }
      </select>

      {/* ===== INPUT ===== */}
      <input 
        type="number" 
        className="form-control mb-2" 
        placeholder="Likelihood (1-3)" 
        value={likelihood} 
        onChange={(e)=>setLikelihood(e.target.value)} 
      />

      <input 
        type="number" 
        className="form-control mb-2" 
        placeholder="Impact (1-3)" 
        value={impact} 
        onChange={(e)=>setImpact(e.target.value)} 
      />

      <button className="btn btn-danger mb-3" onClick={tambahRisk}>
        Hitung
      </button>

      {/* ===== TABLE ===== */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Vuln</th>
            <th>Threat</th>
            <th>Score</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((r,i)=>(
            <tr key={i}>
              <td>{r.asset}</td>
              <td>{r.vuln}</td>
              <td>{r.threat}</td>
              <td>{r.score}</td>
              <td className={
                r.level === "High" ? "text-danger" :
                r.level === "Medium" ? "text-warning" :
                "text-success"
              }>
                {r.level}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== RISK MATRIX ===== */}
      <h3 className="mt-4">Risk Matrix</h3>
      <p><strong>Impact ↑</strong></p>  

      <div className="matrix">
        {[3,2,1].map((impactRow) => (
          <div className="matrix-row" key={impactRow}>
            {[1,2,3].map((likeCol) => {

              const found = risks.find(
                (r) =>
                  Number(r.likelihood) === likeCol &&
                  Number(r.impact) === impactRow
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

      <p><strong>Likelihood →</strong></p>

    </>
  );
}

export default Risk;