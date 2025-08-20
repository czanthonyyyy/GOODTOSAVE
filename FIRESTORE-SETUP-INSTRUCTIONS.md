# Firestore Setup Instructions for Orders

## Configuración de Reglas de Seguridad

Para que el sistema de órdenes funcione correctamente, necesitas configurar las reglas de seguridad en Firestore.

### 1. Ir a Firebase Console
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Selecciona tu proyecto `proto-gts`
- En el menú lateral, ve a **Firestore Database**

### 2. Configurar Reglas de Seguridad
Ve a la pestaña **Rules** y reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Explicación de las Reglas

- **`/users/{userId}`**: Los usuarios solo pueden leer/escribir su propio perfil
- **`/orders/{orderId}`**: Los usuarios solo pueden leer/escribir órdenes donde `uid` coincida con su ID
- **`allow create`**: Permite crear nuevas órdenes solo si el `uid` en los datos coincide con el usuario autenticado
- **Default deny**: Por seguridad, todo lo demás está bloqueado

### 4. Estructura de Datos de Órdenes

Cada orden se guardará con esta estructura:

```javascript
{
  uid: "user_id_from_auth",
  orderId: "ORD-1234567890-abc123def",
  items: [
    {
      title: "Product Name",
      price: 9.99,
      quantity: 2
    }
  ],
  subtotal: 19.98,
  tax: 0.80,
  total: 20.78,
  status: "paid",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

### 5. Verificar Funcionamiento

Después de configurar las reglas:

1. Haz login con un usuario
2. Completa una orden en el marketplace
3. Ve al dashboard y verifica que aparezca en "My Orders"
4. Haz otra orden y verifica que se acumule al historial

### 6. Solución de Problemas

Si las órdenes no se guardan:

1. **Verifica la consola del navegador** para errores
2. **Confirma que las reglas estén publicadas** (botón "Publish" en Rules)
3. **Verifica que el usuario esté autenticado** antes de hacer la orden
4. **Revisa que la colección `orders` se cree automáticamente** en Firestore

### 7. Índices Recomendados

Para mejor rendimiento, crea estos índices en Firestore:

- **Collection**: `orders`
- **Fields**: `uid` (Ascending), `createdAt` (Descending)
- **Query scope**: Collection

Esto optimizará las consultas por usuario ordenadas por fecha.
