import React, { useState } from 'react';
import { Document, Page,pdfjs  } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import samplePdf from'../../public/Get_Started_With_Smallpdf.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ReactPDFViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={samplePdf} // You can also use a URL or imported file
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
      <button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}>Next</button>
    </div>
  );
}

export default ReactPDFViewer;
