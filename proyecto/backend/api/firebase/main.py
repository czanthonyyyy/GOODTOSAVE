from flask import Flask, request, jsonify
from firebase_config import initialize_firebase, get_firestore_client, get_auth_client
import json

app = Flask(__name__)

# Inicializar Firebase
db = initialize_firebase()

@app.route('/api/products', methods=['GET'])
def get_products():
    """
    Obtiene todos los productos
    """
    try:
        products_ref = db.collection('products')
        products = []
        
        for doc in products_ref.stream():
            product = doc.to_dict()
            product['id'] = doc.id
            products.append(product)
            
        return jsonify(products), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """
    Obtiene un producto específico
    """
    try:
        product_ref = db.collection('products').document(product_id)
        product = product_ref.get()
        
        if product.exists:
            product_data = product.to_dict()
            product_data['id'] = product.id
            return jsonify(product_data), 200
        else:
            return jsonify({'error': 'Producto no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """
    Crea una nueva orden
    """
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or 'items' not in data:
            return jsonify({'error': 'Datos de orden requeridos'}), 400
            
        # Crear orden en Firestore
        order_ref = db.collection('orders').add(data)
        
        return jsonify({
            'message': 'Orden creada exitosamente',
            'order_id': order_ref[1].id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 