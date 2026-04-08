import { useState } from "react";

function Asset({ assets, setAssets }) {

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  const tambahAsset = () => {
    if (!nama || !harga) return alert("Isi semua data!");

    setAssets([...assets, { nama, harga }]);
    setNama("");
    setHarga("");
  };

  return (
    <>
      <h2>Asset</h2>

      <input className="form-control mb-2" placeholder="Nama Asset" value={nama} onChange={(e)=>setNama(e.target.value)} />
      <input className="form-control mb-2" placeholder="Harga" value={harga} onChange={(e)=>setHarga(e.target.value)} />

      <button className="btn btn-danger mb-3" onClick={tambahAsset}>Tambah</button>

      <table className="table table-bordered">
        <tbody>
          {assets.map((a,i)=>(
            <tr key={i}>
              <td>{a.nama}</td>
              <td>{a.harga}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
    </>
  );
}

export default Asset;