import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

const UploadSection = ({ onUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const downloadSampleCSV = () => {
    if (window.confirm('Download sample CSV file?')) {
      const csvContent = `Equipment Name,Type,Flowrate,Pressure,Temperature
Reactor A,CSTR,150,2.5,85
Reactor B,PFR,200,3.2,90
Separator A,Centrifuge,75,1.8,60
Mixer X,Agitated,120,1.2,45
Tank Y,Storage,50,0.8,25
Filter Z,Plate,95,1.5,70
Reactor C,CSTR,180,2.8,88
Separator B,Decanter,65,1.6,55`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_equipment_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="upload-section">
      <div className="section-header">
        <FileSpreadsheet size={32} />
        <h2>Upload Equipment Data</h2>
        <p>Upload a CSV file to analyze chemical equipment parameters</p>
      </div>

      <div className="upload-zone-container">
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <Upload size={48} />
            <h3>{dragActive ? 'Drop your CSV here' : 'Drag & drop your CSV file'}</h3>
            <p>or click to browse</p>
            <div className="file-requirements">
              <span>Supports: .csv files only</span>
              <span>Required columns: Equipment Name, Type, Flowrate, Pressure, Temperature</span>
            </div>
          </div>
        </div>

        <div className="upload-actions">
          <button 
            className="btn-primary"
            onClick={onButtonClick}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload size={20} />
                Browse Files
              </>
            )}
          </button>
          
          <div className="sample-link">
            <AlertCircle size={16} />
            <span 
              className="sample-link-text"
              onClick={downloadSampleCSV}
            >
              Download sample CSV template
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;