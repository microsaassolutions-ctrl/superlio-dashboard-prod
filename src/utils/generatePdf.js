import jsPDF from "jspdf";

// **Convert file to base64**
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      // const base64 = reader.result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel" + Date.now() + ".pdf"
// ) => {
//   // "px" does not match real-world PDF size. Millimeters (mm) match true page size in PDF viewers.
//   const widthMM = 110; //1in = 96px = 25.4mm,,  415px ÷ 96 = ~4.32 inches → 4.32 × 25.4 = ~110mm
//   const heightMM = 132;

//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "mm", // <-- important
//     format: [widthMM, heightMM],
//   });

//   for (let i = 0; i < images.length; i++) {
//     const imageSrc = images[i];

//     try {
//       const img = await loadImage(imageSrc);

//       const imgWidth = img.width;
//       const imgHeight = img.height;

//       // scale to fit inside page
//       const ratio = Math.min(widthMM * 3.78 / imgWidth, heightMM * 3.78 / imgHeight);
//       const displayWidth = imgWidth * ratio / 3.78;
//       const displayHeight = imgHeight * ratio / 3.78;

//       const offsetX = (widthMM - displayWidth) / 2;
//       const offsetY = (heightMM - displayHeight) / 2;

//       if (i !== 0) pdf.addPage([widthMM, heightMM]);
//       pdf.addImage(imageSrc, "PNG", offsetX, offsetY, displayWidth, displayHeight);
//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   const pdfBlob = pdf.output("blob");

//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: new Date().getTime(),
//   });

//   return file;
// };

// **********************************
// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel" + Date.now() + ".pdf"
// ) => {
//   const DPI = 300; // high-res for print and upload
//   const PX_TO_MM = 25.4 / DPI;

//   const firstImage = await loadImage(images[0]);
//   const imgWidthPx = firstImage.width;
//   const imgHeightPx = firstImage.height;

//   const widthMM = imgWidthPx * PX_TO_MM;
//   const heightMM = imgHeightPx * PX_TO_MM;

//   const pdf = new jsPDF({
//     unit: "mm",
//     format: [widthMM, heightMM]
//   });

//   // First image
//   pdf.addImage(images[0], "PNG", 0, 0, widthMM, heightMM);

//   // Remaining images
//   for (let i = 1; i < images.length; i++) {
//     try {
//       const img = await loadImage(images[i]);
//       const widthMM = img.width * PX_TO_MM;
//       const heightMM = img.height * PX_TO_MM;

//       pdf.addPage([widthMM, heightMM]);
//       pdf.addImage(images[i], "PNG", 0, 0, widthMM, heightMM);
//     } catch (error) {
//       console.error("Error processing image:", error);
//     }
//   }

//   const pdfBlob = pdf.output("blob");

//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: Date.now(),
//   });

//   return file;
// };
export const exportCarouselToPDF = async (
  images = [],
  fileName = "carousel" + Date.now() + ".pdf"
) => {
  const DPI = 300;
  const PX_TO_MM = 25.4 / DPI;

  const targetWidthMM = 1080 * PX_TO_MM;  // ~91.44 mm
  const targetHeightMM = 1350 * PX_TO_MM; // ~114.3 mm

  const pdf = new jsPDF({
    unit: "mm",
    format: [targetWidthMM, targetHeightMM]
  });

  // First image
  pdf.addImage(images[0], "PNG", 0, 0, targetWidthMM, targetHeightMM);

  // Remaining images
  for (let i = 1; i < images.length; i++) {
    try {
      if (images[i]) {
        pdf.addPage([targetWidthMM, targetHeightMM]);
        pdf.addImage(images[i], "PNG", 0, 0, targetWidthMM, targetHeightMM);
      } else {
        console.error(`Image at index ${i} is undefined or null.`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }

  const pdfBlob = pdf.output("blob");

  const file = new File([pdfBlob], fileName, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  return file;
};
// ****************** NEW CODE *************************
// ****************** NEW CODE *************************
// **********************************
// import jsPDF from "jspdf";

// // **Convert file to base64**
// export const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result.split(",")[1];
//       resolve(base64);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel.pdf"
// ) => {
//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "px",
//     format: "a4",
//   });

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();

//   // Loop through the images and add them to the PDF
//   for (let i = 0; i < images.length; i++) {
//     const imageSrc = images[i];

//     try {
//       const imgWithRoundedCorners = await drawRoundedImage(
//         imageSrc,
//         pdfWidth,
//         pdfHeight,
//         20 // Adjust radius here
//       );

//       if (i !== 0) pdf.addPage();
//       pdf.addImage(imgWithRoundedCorners, "PNG", 0, 0, pdfWidth, pdfHeight);
//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   // Generate the PDF as a Blob
//   const pdfBlob = pdf.output("blob");

//   // Create a File object from the Blob
//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: new Date().getTime(),
//   });

//   // Return the file object
//   return file;
// };

// // Helper function to draw rounded image (same as previous)
// const drawRoundedImage = (imgSrc, width, height, radius = 7) => {
//   return new Promise((resolve, reject) => {
//     const scale = 2;
//     const canvas = document.createElement("canvas");
//     canvas.width = width * scale;
//     canvas.height = height * scale;
//     const ctx = canvas.getContext("2d");

//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       ctx.scale(scale, scale);
//       ctx.clearRect(0, 0, width, height);

//       // Draw rounded rect path
//       ctx.beginPath();
//       roundedRect(ctx, 0, 0, width, height, radius);
//       ctx.clip();

//       // Draw image inside rounded rect
//       ctx.drawImage(img, 0, 0, width, height);
//       const finalImage = canvas.toDataURL("image/png", 1.0);
//       resolve(finalImage);
//     };

//     img.onerror = reject;
//     img.src = imgSrc;
//   });
// };

// // Helper function to create rounded rectangle path
// function roundedRect(ctx, x, y, width, height, radius) {
//   ctx.beginPath();
//   ctx.moveTo(x + radius, y);
//   ctx.lineTo(x + width - radius, y);
//   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//   ctx.lineTo(x + width, y + height - radius);
//   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//   ctx.lineTo(x + radius, y + height);
//   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//   ctx.lineTo(x, y + radius);
//   ctx.quadraticCurveTo(x, y, x + radius, y);
//   ctx.closePath();
// }

// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel_" + Date.now() + ".pdf"
// ) => {
//   // Full HD: 1920 x 1080 px => 508mm x 285mm approx (assuming 96 DPI)
//   const pxToMM = (px) => px * 25.4 / 96;
//   const widthMM = pxToMM(1920);  // ≈ 508mm
//   const heightMM = pxToMM(1980); // ≈ 285mm

//   const pdf = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: [widthMM, heightMM],
//   });

//   for (let i = 0; i < images.length; i++) {
//     const imageSrc = images[i];

//     try {
//       const img = await loadImage(imageSrc);

//       const imgWidth = pxToMM(img.width);
//       const imgHeight = pxToMM(img.height);

//       // Scale image to fill entire page without keeping aspect ratio (crop if necessary)
//       const fitWidth = widthMM;
//       const fitHeight = heightMM;

//       if (i !== 0) pdf.addPage([widthMM, heightMM]);

//       pdf.addImage(imageSrc, "PNG", 0, 0, fitWidth, fitHeight); // No offset, full-page

//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   const pdfBlob = pdf.output("blob");

//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: new Date().getTime(),
//   });

//   return file;
// };

// const loadImage = (src) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });
// };



// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel" + Date.now() + ".pdf"
// ) => {
//   // "px" does not match real-world PDF size. Millimeters (mm) match true page size in PDF viewers.
//   const widthMM = 110; //1in = 96px = 25.4mm,,  415px ÷ 96 = ~4.32 inches → 4.32 × 25.4 = ~110mm
//   const heightMM = 132;

//   const img = await loadImage(images[0]);
//   const imgWidth = img.width;
//   const imgHeight = img.height;

//   const dpi = 3.78;
//   const ratio = widthMM * dpi / imgWidth;
//   const displayWidth = widthMM;
//   const displayHeight = (imgHeight * ratio) / dpi;

//   // Create the PDF with the correct first page size
//   const pdf = new jsPDF({
//     unit: "mm",
//     format: [displayWidth, displayHeight]
//   });

//   // Add the first image
//   pdf.addImage(images[0], "PNG", 0, 0, displayWidth, displayHeight);

//   // Add remaining images
//   for (let i = 1; i < images.length; i++) {
//     const imageSrc = images[i];
//     try {
//       const img = await loadImage(imageSrc);
//       const imgWidth = img.width;
//       const imgHeight = img.height;

//       const ratio = widthMM * dpi / imgWidth;
//       const displayHeight = (imgHeight * ratio) / dpi;

//       pdf.addPage([widthMM, displayHeight]);
//       pdf.addImage(imageSrc, "PNG", 0, 0, widthMM, displayHeight);
//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   const pdfBlob = pdf.output("blob");

//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: new Date().getTime(),
//   });

//   return file;
// };

// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel" + Date.now() + ".pdf"
// ) => {
//   const DPI = 96; // screen DPI, adjust if using higher DPI (e.g., 300 for print quality)
//   const PX_TO_MM = 25.4 / DPI;

//   const firstImg = await loadImage(images[0]);
//   const imgWidthPx = firstImg.width;
//   const imgHeightPx = firstImg.height;

//   const widthMM = imgWidthPx * PX_TO_MM;
//   const heightMM = imgHeightPx * PX_TO_MM;

//   // Initialize PDF with first image dimensions
//   const pdf = new jsPDF({
//     unit: "mm",
//     format: [widthMM, heightMM]
//   });

//   // Add first image
//   pdf.addImage(images[0], "PNG", 0, 0, widthMM, heightMM);

//   // Loop through remaining images
//   for (let i = 1; i < images.length; i++) {
//     try {
//       const img = await loadImage(images[i]);
//       const widthMM = img.width * PX_TO_MM;
//       const heightMM = img.height * PX_TO_MM;

//       pdf.addPage([widthMM, heightMM]);
//       pdf.addImage(images[i], "PNG", 0, 0, widthMM, heightMM);
//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   const pdfBlob = pdf.output("blob");
//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: Date.now(),
//   });

//   return file;
// };
//  hd And Working
// export const exportCarouselToPDF = async (
//   images = [],
//   fileName = "carousel" + Date.now() + ".pdf"
// ) => {
//   const DPI = 300; // High-resolution for print
//   const PX_TO_MM = 25.4 / DPI;

//   const firstImg = await loadImage(images[0]);
//   const imgWidthPx = firstImg.width;
//   const imgHeightPx = firstImg.height;

//   const widthMM = imgWidthPx * PX_TO_MM;
//   const heightMM = imgHeightPx * PX_TO_MM;

//   const pdf = new jsPDF({
//     unit: "mm",
//     format: [widthMM, heightMM],
//   });

//   pdf.addImage(images[0], "PNG", 0, 0, widthMM, heightMM);

//   for (let i = 1; i < images.length; i++) {
//     try {
//       const img = await loadImage(images[i]);
//       const imgWidth = img.width;
//       const imgHeight = img.height;
//       const widthMM = imgWidth * PX_TO_MM;
//       const heightMM = imgHeight * PX_TO_MM;

//       pdf.addPage([widthMM, heightMM]);
//       pdf.addImage(images[i], "PNG", 0, 0, widthMM, heightMM);
//     } catch (err) {
//       console.error("Error processing image:", err);
//     }
//   }

//   const pdfBlob = pdf.output("blob");

//   const file = new File([pdfBlob], fileName, {
//     type: "application/pdf",
//     lastModified: Date.now(),
//   });

//   return file;
// };