// Get references to DOM elements
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const linkInput = document.getElementById('linkInput');
const correctionLevelSelect = document.getElementById('correctionLevel');
const qrcodeContainer = document.getElementById('qrcode');

const decodeBtn = document.getElementById('decodeBtn');
const qrInput = document.getElementById('qrInput');
const decodedInfo = document.getElementById('decodedInfo');
const highlightedImage = document.getElementById('highlightedImage');

const showGenerateBtn = document.getElementById('showGenerateBtn');
const showDecodeBtn = document.getElementById('showDecodeBtn');

const generateSection = document.getElementById('generateSection');
const decodeSection = document.getElementById('decodeSection');

let qrCode; // Variable to store the QR code instance

// Function to toggle active button styling
function setActiveButton(activeButton, inactiveButton) {
    activeButton.classList.add('active');
    inactiveButton.classList.remove('active');
}

// Event Listener for Show Generate Section Button
showGenerateBtn.addEventListener('click', () => {
    generateSection.style.display = 'block';
    decodeSection.style.display = 'none';
    setActiveButton(showGenerateBtn, showDecodeBtn);
});

// Event Listener for Show Decode Section Button
showDecodeBtn.addEventListener('click', () => {
    decodeSection.style.display = 'block';
    generateSection.style.display = 'none';
    setActiveButton(showDecodeBtn, showGenerateBtn);
});

// Event Listener for Generating QR Code
generateBtn.addEventListener('click', () => {
    const link = linkInput.value;
    const correctionLevel = correctionLevelSelect.value;

    if (link.trim() === '') {
        alert('Please enter a link.');
        return;
    }

    // Clear previous QR code
    qrcodeContainer.innerHTML = '';
    downloadBtn.disabled = true;

    // Generate new QR code with selected correction level
    qrCode = new QRCode(qrcodeContainer, {
        text: link,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel[correctionLevel]
    });

    // Enable the download button after QR code is generated
    setTimeout(() => {
        downloadBtn.disabled = false;
    }, 500);
});

// Event Listener for Downloading QR Code
downloadBtn.addEventListener('click', () => {
    // Check if QR code is generated as an image
    const img = qrcodeContainer.querySelector('img');

    if (img) {
        const imgSrc = img.src;

        // Create a temporary link to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = imgSrc;
        downloadLink.download = 'qr_code.png';

        // Append the link to the body and trigger click
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Remove the link after downloading
        document.body.removeChild(downloadLink);
    } else {
        alert('Please generate a QR code first.');
    }
});

// Event Listener for Decoding QR Code
decodeBtn.addEventListener('click', () => {
    const file = qrInput.files[0];

    if (!file) {
        alert('Please select a QR code image to decode.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function() {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set canvas dimensions to image dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Get image data from the canvas
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Use jsQR to decode the QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                decodedInfo.textContent = `Decoded Information: ${code.data}`;
                // Highlight the QR code area
                highlightQRCode(context, code.location);
            } else {
                decodedInfo.textContent = 'No QR code found. Please try another image.';
                // Optionally, you can clear any previously highlighted images
                // highlightedImage.innerHTML = '';
            }

            // Display the image (with or without highlighting)
            const displayCanvas = document.createElement('canvas');
            displayCanvas.width = canvas.width;
            displayCanvas.height = canvas.height;
            const displayCtx = displayCanvas.getContext('2d');
            displayCtx.drawImage(canvas, 0, 0);

            // Clear previous image and display the new one
            highlightedImage.innerHTML = '';
            highlightedImage.appendChild(displayCanvas);
        };
    };

    reader.readAsDataURL(file);
});

/**
 * Highlight the QR code area on the image
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} location - QR code location data from jsQR
 */
function highlightQRCode(ctx, location) {
    // Draw a red rectangle around the QR code
    ctx.beginPath();
    ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
