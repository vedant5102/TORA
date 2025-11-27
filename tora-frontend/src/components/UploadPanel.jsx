import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export default function UploadPanel({
  files,
  setFiles,
  scale,
  page,
  setPage,
  numPages,
  setNumPages,
}) {
  function handleFiles(e) {
    const selected = Array.from(e.target.files);

    if (selected.length > 0) {
      // MERGE with existing files
      const merged = [...files, ...selected];
      setFiles(merged);
      setPage(merged.length - selected.length); // start from first new image
    }
  }

  const currentFile = files.length > 0 ? files[page] : null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Image / PDF Viewer</h3>

      {/* MULTIPLE FILE UPLOAD */}
      <input
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleFiles}
        className="mb-3"
      />

      {/* Main viewer */}
      <div className="w-full h-80 bg-black rounded-lg flex items-center justify-center overflow-hidden">
        {!currentFile && <p className="text-slate-400">Upload files to preview</p>}

        {currentFile && currentFile.type !== "application/pdf" && (
          <img
            src={URL.createObjectURL(currentFile)}
            className="max-h-full max-w-full transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        )}

        {currentFile && currentFile.type === "application/pdf" && (
          <Document
            file={currentFile}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={1} scale={scale} />
          </Document>
        )}
      </div>

      {/* Horizontal thumbnails */}
      {files.length > 1 && (
        <div className="flex overflow-x-auto gap-3 mt-4 pb-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              onClick={() => setPage(idx)}
              className={`cursor-pointer min-w-[80px] rounded-lg overflow-hidden ${
                idx === page ? "border-2 border-green-400" : "border border-slate-600"
              }`}
            >
              {file.type === "application/pdf" ? (
                <div className="h-20 w-[80px] bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                  PDF
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  className="h-20 w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
