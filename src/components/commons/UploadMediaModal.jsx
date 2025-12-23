import React, { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaImage, FaVideo, FaFilePdf } from "react-icons/fa";
import PdfPreview from "./PdfPreview";

const MEDIA_TYPES = {
    image: {
        label: "Image",
        icon: FaImage,
        accept: ".jpg,.jpeg,.png",
        maxSize: 50 * 1024 * 1024, // 50MB
        maxSizeLabel: "50MB",
    },
    video: {
        label: "Video",
        icon: FaVideo,
        accept: ".mp4",
        maxSize: 250 * 1024 * 1024, // 250MB
        maxSizeLabel: "250MB",
    },
    document: {
        label: "Document",
        icon: FaFilePdf,
        accept: ".pdf",
        maxSize: 100 * 1024 * 1024, // 100MB
        maxSizeLabel: "100MB",
    },
};

const UploadMediaModal = ({ onClose, onProceed }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Cleanup blob URLs when component unmounts or preview changes
    React.useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setSelectedFile(null);
        setPreview(null);
        setError("");
    };

    const validateFile = (file, type) => {
        const config = MEDIA_TYPES[type];

        // Check file type
        const validExtensions = config.accept.split(",").map((ext) => ext.trim().toLowerCase());
        const fileExt = "." + file.name.split(".").pop().toLowerCase();
        if (!validExtensions.includes(fileExt)) {
            return `Invalid file type. Please select a ${validExtensions.join(", ")} file.`;
        }

        // Check file size
        if (file.size > config.maxSize) {
            return `File too large. Maximum size is ${config.maxSizeLabel}.`;
        }

        return null;
    };

    const handleFileSelect = (file) => {
        if (!selectedType) {
            setError("Please select a media type first.");
            return;
        }

        const validationError = validateFile(file, selectedType);
        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        setError("");
        setSelectedFile(file);

        // Generate preview for images, documents, and videos
        if (selectedType === "image" || selectedType === "document") {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else if (selectedType === "video") {
            // Create object URL for video preview
            const videoUrl = URL.createObjectURL(file);
            setPreview(videoUrl);
        } else {
            setPreview(null);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleProceed = async () => {
        if (!selectedFile) {
            setError("Please select a file first.");
            return;
        }

        // Convert to base64 and call onProceed
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                filename: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
                mediaType: selectedType,
                base64: e.target.result,
            };
            console.log("📤 Upload Media - File Data:", fileData);
            if (onProceed) {
                onProceed(fileData);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 shadow-xl rounded-xl w-[450px] font-sans text-gray-800 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    <AiOutlineClose size={20} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold mb-1 text-gray-900">Upload Media</h2>
                <p className="text-gray-500 text-sm mb-5">
                    Select a media type and upload your file.
                </p>

                {/* Media Type Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Media Type
                    </label>
                    <div className="flex gap-3">
                        {Object.entries(MEDIA_TYPES).map(([key, config]) => {
                            const Icon = config.icon;
                            const isSelected = selectedType === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleTypeSelect(key)}
                                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${isSelected
                                        ? "border-purple-500 bg-purple-50 text-purple-700"
                                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                                        }`}
                                >
                                    <Icon size={24} />
                                    <span className="mt-1 text-sm font-medium">{config.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* File Input Area */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select File
                    </label>
                    <div
                        onClick={() => selectedType && fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${!selectedType
                            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                            : isDragging
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-300 hover:border-purple-400"
                            }`}
                    >
                        {selectedFile ? (
                            <div className="flex flex-col items-center">
                                {selectedType === "image" && preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-32 max-w-full rounded-lg mb-2"
                                    />
                                ) : selectedType === "video" && preview ? (
                                    <video
                                        src={preview}
                                        controls
                                        className="max-h-32 max-w-full rounded-lg mb-2"
                                    />
                                ) : selectedType === "document" && preview ? (
                                    <div className="w-full">
                                        <PdfPreview
                                            base64={preview}
                                            filename={selectedFile.name}
                                            compact={true}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                        {selectedType === "document" && <FaFilePdf size={32} className="text-red-500" />}
                                    </div>
                                )}
                                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500">
                                    {selectedType
                                        ? `Drag & drop or click to browse`
                                        : "Select a media type first"}
                                </p>
                                {selectedType && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {MEDIA_TYPES[selectedType].accept} • Max {MEDIA_TYPES[selectedType].maxSizeLabel}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={selectedType ? MEDIA_TYPES[selectedType].accept : ""}
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleProceed}
                        disabled={!selectedFile}
                        className={`px-8 py-2 rounded-md font-bold transition shadow-md ${selectedFile
                            ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadMediaModal;
