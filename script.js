const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const linkInput = document.getElementById('linkInput');
const correctionLevelSelect = document.getElementById('correctionLevel');
const qrcodeContainer = document.getElementById('qrcode');

let qrCode; // Variable to store the QR code instance

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