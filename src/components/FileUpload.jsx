import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function FileUpload({ onDataLoaded }) {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split(".")[0] || file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onDataLoaded(jsonData, file);
      } catch (error) {
        console.error("Error reading file:", error);
        setFileName("");
      }
    };

    reader.readAsBinaryString(file);
  };

  const sendSheetData = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("message", "Upload successful");

      const res = await axios.post("http://localhost:3000/api/v1/tests/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        // Add error handling configurations
        timeout: 10000, // 10 second timeout
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Accept only success status codes
        }
      });

      if (res.data?.files?.[0]) {
        window.localStorage.setItem("fileName", res.data.files[0]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error gracefully without throwing
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className="upload-section">
      <label htmlFor="file-upload" className="input-div">
        <input
          id="file-upload"
          className="input"
          name="file"
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(e);
              sendSheetData(file);
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          strokeLinejoin="round"
          strokeLinecap="round"
          viewBox="0 0 24 24"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
          className="icon"
        >
          <polyline points="16 16 12 12 8 16"></polyline>
          <line y2="21" x2="12" y1="12" x1="12"></line>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
          <polyline points="16 16 12 12 8 16"></polyline>
        </svg>
      </label>
      {fileName && <p className="file-name">{fileName}</p>}
    </div>
  );
}

export default FileUpload;