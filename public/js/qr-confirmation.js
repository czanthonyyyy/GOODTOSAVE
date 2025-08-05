/**
 * QR Confirmation JavaScript
 * Funcionalidad para la página de confirmación de pago con QR único
 */
class QRConfirmation {
    constructor() {
        this.orderData = null;
        this.qrCanvas = null;
        this.init();
    }

    init() {
        this.loadOrderData();
        this.bindEvents();
        this.generateOrderId();
        this.displayOrderDetails();
        this.generateQR();
        this.setOrderDate();
    }

    bindEvents() {
        // Download QR button
        document.getElementById('download-qr')?.addEventListener('click', () => {
            this.downloadQR();
        });

        // Share QR button
        document.getElementById('share-qr')?.addEventListener('click', () => {
            this.shareQR();
        });

        // Navigation buttons
        document.getElementById('back-to-home')?.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('new-order')?.addEventListener('click', () => {
            window.location.href = 'marketplace.html';
        });
    }

    loadOrderData() {
        // Try to get order data from localStorage
        const checkoutItems = localStorage.getItem('checkoutItems');
        const cartItems = localStorage.getItem('cartItems');
        
        let items = [];
        if (checkoutItems) {
            items = JSON.parse(checkoutItems);
        } else if (cartItems) {
            items = JSON.parse(cartItems);
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.04; // 4% tax
        const total = subtotal + tax;

        this.orderData = {
            items: items,
            subtotal: subtotal,
            tax: tax,
            total: total,
            orderId: this.generateOrderId(),
            timestamp: new Date().toISOString()
        };
    }

    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const orderId = `GTS-${timestamp}-${random}`;
        
        // Update the order ID in the DOM
        const orderIdElement = document.getElementById('order-id');
        if (orderIdElement) {
            orderIdElement.textContent = orderId;
        }
        
        return orderId;
    }

    setOrderDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = now.toLocaleDateString('es-ES', options);
        
        const orderDateElement = document.getElementById('order-date');
        if (orderDateElement) {
            orderDateElement.textContent = formattedDate;
        }
    }

    displayOrderDetails() {
        const orderDetailsElement = document.getElementById('order-details');
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        if (!this.orderData || !orderDetailsElement) return;

        // Display order items
        let itemsHTML = '';
        this.orderData.items.forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <span class="item-name">${item.title}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                    </div>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });

        orderDetailsElement.innerHTML = itemsHTML;

        // Display totals
        if (subtotalElement) subtotalElement.textContent = `$${this.orderData.subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${this.orderData.tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${this.orderData.total.toFixed(2)}`;
    }

    async generateQR() {
        if (!this.orderData) return;

        const qrCanvas = document.getElementById('qr-canvas');
        if (!qrCanvas) return;

        // Create unique QR content for this payment
        const qrContent = {
            orderId: this.orderData.orderId,
            total: this.orderData.total,
            items: this.orderData.items.map(item => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price
            })),
            timestamp: this.orderData.timestamp,
            merchant: 'GTS',
            type: 'payment_confirmation'
        };

        const qrString = JSON.stringify(qrContent);

        try {
            // Generate QR code
            await QRCode.toCanvas(qrCanvas, qrString, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#39b54a', // GTS green
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'M'
            });

            this.qrCanvas = qrCanvas;
            this.showNotification('QR generado exitosamente', 'success');
        } catch (error) {
            console.error('Error generating QR:', error);
            this.showNotification('Error al generar el QR', 'error');
        }
    }

    async downloadQR() {
        if (!this.qrCanvas) {
            this.showNotification('No hay QR para descargar', 'error');
            return;
        }

        try {
            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                this.qrCanvas.toBlob(resolve, 'image/png');
            });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `GTS-Payment-${this.orderData.orderId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showNotification('QR descargado exitosamente', 'success');
        } catch (error) {
            console.error('Error downloading QR:', error);
            this.showNotification('Error al descargar el QR', 'error');
        }
    }

    async shareQR() {
        if (!this.orderData) {
            this.showNotification('No hay datos para compartir', 'error');
            return;
        }

        try {
            const shareData = {
                title: 'Confirmación de Pago GTS',
                text: `Mi pago ha sido confirmado. Orden: ${this.orderData.orderId} - Total: $${this.orderData.total.toFixed(2)}`,
                url: window.location.href
            };

            if (navigator.share) {
                await navigator.share(shareData);
                this.showNotification('Compartido exitosamente', 'success');
            } else {
                // Fallback: copy to clipboard
                const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                await navigator.clipboard.writeText(shareText);
                this.showNotification('Enlace copiado al portapapeles', 'success');
            }
        } catch (error) {
            console.error('Error sharing QR:', error);
            this.showNotification('Error al compartir', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        return icons[type] || icons.info;
    }
}

// Initialize when DOM is loaded
let qrConfirmation;
document.addEventListener('DOMContentLoaded', function() {
    qrConfirmation = new QRConfirmation();
}); 