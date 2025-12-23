import React, { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FaChevronLeft, FaChevronRight, FaFilePdf } from "react-icons/fa";

// Set worker source - use local worker from node_modules
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * PdfPreview - Renders PDF pages as a carousel
 * @param {string} base64 - Base64 encoded PDF data (data:application/pdf;base64,...)
 * @param {string} filename - Name of the PDF file
 * @param {number} maxHeight - Maximum height of the preview container
 * @param {boolean} compact - If true, shows smaller preview (for modal)
 */
const PdfPreview = ({ base64, filename, maxHeight = 400, compact = false }) => {
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const canvasRefs = useRef([]);

    useEffect(() => {
        if (!base64) return;

        const loadPdf = async () => {
            try {
                setLoading(true);
                setError(null);

                // Convert base64 to ArrayBuffer
                const pdfData = atob(base64.split(",")[1]);
                const pdfArray = new Uint8Array(pdfData.length);
                for (let i = 0; i < pdfData.length; i++) {
                    pdfArray[i] = pdfData.charCodeAt(i);
                }

                // Load PDF document
                const pdf = await pdfjsLib.getDocument({ data: pdfArray }).promise;
                setTotalPages(pdf.numPages);

                // Render all pages (limit to first 10 for performance)
                const maxPagesToRender = Math.min(pdf.numPages, 10);
                const pageImages = [];

                for (let i = 1; i <= maxPagesToRender; i++) {
                    const page = await pdf.getPage(i);
                    const scale = compact ? 1 : 1.5;
                    const viewport = page.getViewport({ scale });

                    // Create canvas
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Render page to canvas
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                    }).promise;

                    // Convert to image URL
                    pageImages.push(canvas.toDataURL("image/png"));
                }

                setPages(pageImages);
                setCurrentPage(0);
            } catch (err) {
                console.error("PDF loading error:", err);
                setError("Failed to load PDF preview");
            } finally {
                setLoading(false);
            }
        };

        loadPdf();
    }, [base64, compact]);

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
    };

    if (loading) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-gray-50 rounded-lg"
                style={{ height: compact ? 150 : maxHeight }}
            >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
                <p className="text-sm text-gray-500">Loading PDF preview...</p>
            </div>
        );
    }

    if (error || pages.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-gray-50 rounded-lg"
                style={{ height: compact ? 150 : maxHeight }}
            >
                <FaFilePdf size={compact ? 32 : 48} className="text-red-500 mb-2" />
                <p className="font-medium text-gray-700">{filename}</p>
                <p className="text-sm text-gray-500">{error || "PDF preview unavailable"}</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Page Display */}
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
                style={{ maxHeight: compact ? 200 : maxHeight }}
            >
                <img
                    src={pages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    className="max-w-full object-contain"
                    style={{ maxHeight: compact ? 200 : maxHeight }}
                />
            </div>

            {/* Navigation Controls */}
            {pages.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md transition ${currentPage === 0
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        <FaChevronLeft size={compact ? 12 : 16} />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === pages.length - 1}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md transition ${currentPage === pages.length - 1
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        <FaChevronRight size={compact ? 12 : 16} />
                    </button>

                    {/* Page Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white text-xs">
                        {currentPage + 1} / {pages.length}
                        {totalPages > 10 && pages.length === 10 && " (max 10)"}
                    </div>
                </>
            )}

            {/* File Name */}
            {compact && (
                <p className="text-center text-sm text-gray-600 mt-2 truncate">
                    {filename}
                </p>
            )}
        </div>
    );
};

export default PdfPreview;
