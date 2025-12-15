import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Uploadexcel() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate()

  // Handle file selection
  const inputHandler = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData, // 👈 important
      });

      const data = await response.json();
      console.log(data);
      alert("File uploaded successfully");
      navigate("/pricetrend")

    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
  <form
    onSubmit={handleUpload}
    className="bg-white p-4 rounded shadow border"
    style={{ width: "100%", maxWidth: "400px" }}
  >
    <h5 className="mb-3 text-center">Upload Excel File</h5>

    <div className="mb-3">
      <label className="form-label">Select Excel File</label>
      <input
        type="file"
        className="form-control"
        accept=".xls,.xlsx"
        onChange={inputHandler}
      />
    </div>

    <button type="submit" className="btn btn-primary w-100">
      Upload
    </button>
  </form>
</div>

  );
}

export default Uploadexcel;
