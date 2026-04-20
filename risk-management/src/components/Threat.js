import { useState } from "react";

function Threat({ threats, setThreats, vulns }) {

  const [nama, setNama] = useState("");
  const [selectedVuln, setSelectedVuln] = useState("");

  const tambah = () => {
    if (!nama || !selectedVuln) return alert("Lengkapi data!");

    const dataBaru = {
      nama: nama,
      vuln: selectedVuln
    };

    setThreats([...threats, dataBaru]);

    setNama("");
    setSelectedVuln("");
  };

  return (
    <>
      <h2>Threat</h2>

      {/* PILIH VULNERABILITY */}
      <select
        className="form-control mb-2"
        value={selectedVuln}
        onChange={(e) => setSelectedVuln(e.target.value)}
      >
        <option value="">Pilih Vulnerability</option>
        {vulns.map((v, i) => (
          <option key={i}>{v.nama}</option>
        ))}
      </select>

      {/* INPUT NAMA */}
      <input
        className="form-control mb-2"
        placeholder="Nama Threat"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <button className="btn btn-danger mb-3" onClick={tambah}>
        Tambah
      </button>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Vulnerability</th>
            <th>Threat</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((t, i) => (
            <tr key={i}>
              <td>{t.vuln}</td>
              <td>{t.nama}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
    </>
  );
}

export default Threat;