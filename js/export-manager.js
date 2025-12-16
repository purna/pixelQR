/**
 * export-manager.js - Export functionality for QR Code Generator
 */

class ExportManager {
    constructor(appInstance) {
        this.app = appInstance;
        this.config = window.Config;
    }

    /**
     * Main export function - handles different export formats
     */
    exportQRCode() {
        if (!this.app.currentQRCode) {
            notificationManager.error('No QR code to export');
            return;
        }

        const format = document.getElementById('export-format-select').value;

        switch (format) {
            case 'png':
                this.downloadQRCode();
                break;
            case 'svg':
                this.exportAsSVG();
                break;
            case 'pdf':
                this.exportAsPDF();
                break;
            default:
                notificationManager.error('Unsupported export format');
        }
    }

    /**
     * Download QR code as PNG
     */
    downloadQRCode() {
        if (!this.app.currentQRCode) {
            notificationManager.error('No QR code to download');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.png`;
            link.href = this.app.currentQRCode.canvas.toDataURL();
            link.click();

            notificationManager.success('QR code downloaded!');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            notificationManager.error('Error downloading QR code');
        }
    }

    /**
     * Export QR code as SVG
     */
    exportAsSVG() {
        if (!this.app.currentQRCode) {
            notificationManager.error('No QR code to export');
            return;
        }

        try {
            const { qr, size, foregroundColor, backgroundColor } = this.app.currentQRCode;
            const cellSize = size / qr.getModuleCount();
            const margin = parseInt(this.config.QR_CODE.DEFAULT_MARGIN) * cellSize;
            const totalSize = size + (margin * 2);

            // Generate SVG path data
            let svgPath = '';
            for (let row = 0; row < qr.getModuleCount(); row++) {
                for (let col = 0; col < qr.getModuleCount(); col++) {
                    if (qr.isDark(row, col)) {
                        const x = Math.round(col * cellSize) + margin;
                        const y = Math.round(row * cellSize) + margin;
                        const width = Math.ceil(cellSize);
                        const height = Math.ceil(cellSize);
                        svgPath += `M${x} ${y}h${width}v${height}h-${width}z`;
                    }
                }
            }

            // Create SVG content
            const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">
    <rect width="100%" height="100%" fill="${backgroundColor}"/>
    <path d="${svgPath}" fill="${foregroundColor}"/>
</svg>`;

            // Create and download file
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();

            // Clean up
            URL.revokeObjectURL(link.href);

            notificationManager.success('SVG exported successfully!');
        } catch (error) {
            console.error('Error exporting SVG:', error);
            notificationManager.error('Error exporting SVG: ' + error.message);
        }
    }

    /**
     * Export QR code as PDF
     */
    exportAsPDF() {
        if (!this.app.currentQRCode) {
            notificationManager.error('No QR code to export');
            return;
        }

        try {
            const { canvas, size } = this.app.currentQRCode;

            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit on page with margins
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2);

            // Calculate scale to fit QR code on page
            const scale = Math.min(availableWidth / size, availableHeight / size) * 0.8;
            const qrSize = size * scale;
            const qrX = (pageWidth - qrSize) / 2;
            const qrY = (pageHeight - qrSize) / 2;

            // Add QR code to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);

            // Add metadata
            pdf.setProperties({
                title: 'QR Code',
                subject: 'Generated QR Code',
                creator: 'PixelQR Generator'
            });

            // Save PDF
            pdf.save(`qrcode-${Date.now()}.pdf`);

            notificationManager.success('PDF exported successfully!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            notificationManager.error('Error exporting PDF: ' + error.message);
        }
    }
}