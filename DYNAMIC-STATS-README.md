# Sistema de Estadísticas Dinámicas - Good to Save

## Descripción

Este sistema permite que todas las cifras y números en el index y about us sean dinámicos y se actualicen automáticamente. Las estadísticas se cargan desde un archivo JSON centralizado y se pueden actualizar en tiempo real.

## Archivos del Sistema

### Archivos Principales

1. **`public/assets/data/dynamic-stats.json`** - Archivo de datos centralizado con todas las estadísticas
2. **`public/js/dynamic-stats.js`** - Gestor principal de estadísticas dinámicas
3. **`public/js/real-time-updates.js`** - Sistema de actualizaciones en tiempo real

### Archivos Modificados

- `public/pages/index.html` - Agregado script de estadísticas dinámicas
- `public/pages/about.html` - Agregado script de estadísticas dinámicas
- `public/js/home.js` - Integrado con el sistema de estadísticas
- `public/js/about.js` - Integrado con el sistema de estadísticas

## Estructura de Datos

### Estadísticas de la Plataforma (`platform_stats`)
```json
{
  "active_deals": 150,
  "total_savings": 2500,
  "happy_customers": 2800,
  "average_order_time": "2.5 min",
  "average_savings": 60,
  "availability": "24/7",
  "active_partners": 2500,
  "monthly_revenue": 45000,
  "waste_reduction": 85,
  "average_rating": "4.9/5",
  "satisfied_users": 15000,
  "satisfaction_rate": 98
}
```

### Estadísticas de Impacto (`impact_stats`)
```json
{
  "food_saved_kg": 15680,
  "co2_reduced_kg": 12450,
  "families_helped": 4200,
  "euros_saved": 89000
}
```

### Problema Global (`global_problem`)
```json
{
  "food_waste_percentage": 33,
  "co2_emissions_percentage": 8,
  "annual_waste_tons": "1.3B"
}
```

### Testimonios (`testimonials`)
```json
{
  "maria_gonzalez": {
    "savings_per_month": 200,
    "orders": 15
  },
  "ana_martinez": {
    "savings_per_month": 150,
    "orders": 12
  }
}
```

### Historias de Éxito (`success_stories`)
```json
{
  "el_horno_bakery": {
    "food_saved_per_day": "50kg",
    "income_increase": 15
  },
  "central_market": {
    "waste_reduction": 70,
    "new_customers": 200
  }
}
```

## Funcionalidades

### 1. Carga Automática de Estadísticas
- Las estadísticas se cargan automáticamente al cargar la página
- Si falla la carga, se usan valores por defecto
- Actualización automática cada 5 minutos

### 2. Animaciones de Contadores
- Los números se animan al entrar en el viewport
- Animación suave de 0 al valor objetivo
- Formateo automático (K, M, %, etc.)

### 3. Actualizaciones en Tiempo Real (Opcional)
- Simula actividad en tiempo real
- Incrementa estadísticas automáticamente
- Notificaciones sutiles de actualización

## Uso desde la Consola

### Comandos Disponibles

```javascript
// Obtener una estadística específica
window.dynamicStats.getStat('platform_stats', 'active_deals');

// Actualizar una estadística específica
window.dynamicStats.updateStat('platform_stats', 'active_deals', 200);

// Exportar todas las estadísticas
window.dynamicStats.exportStats();

// Activar actualizaciones en tiempo real
window.startRealTimeUpdates();

// Detener actualizaciones en tiempo real
window.stopRealTimeUpdates();

// Alternar actualizaciones en tiempo real
window.toggleRealTimeUpdates();

// Verificar estado de actualizaciones en tiempo real
window.getRealTimeStatus();
```

### Ejemplos de Uso

```javascript
// Incrementar el número de clientes felices
const currentCustomers = window.dynamicStats.getStat('platform_stats', 'happy_customers');
window.dynamicStats.updateStat('platform_stats', 'happy_customers', currentCustomers + 10);

// Actualizar ahorros totales
window.dynamicStats.updateStat('platform_stats', 'total_savings', 3000);

// Activar modo de demostración con actualizaciones en tiempo real
window.startRealTimeUpdates();
```

## Personalización

### Modificar Valores por Defecto

Para cambiar los valores por defecto, edita el método `useDefaultStats()` en `dynamic-stats.js`:

```javascript
useDefaultStats() {
    this.stats = {
        platform_stats: {
            active_deals: 200, // Cambiar aquí
            total_savings: 3000, // Cambiar aquí
            // ... más estadísticas
        },
        // ... más categorías
    };
    this.loaded = true;
}
```

### Agregar Nuevas Estadísticas

1. Agrega la nueva estadística al archivo `dynamic-stats.json`
2. Actualiza el método `updateIndexStats()` o `updateAboutStats()` en `dynamic-stats.js`
3. Agrega el selector CSS correspondiente

### Ejemplo: Agregar Nueva Estadística

```javascript
// En dynamic-stats.json
{
  "platform_stats": {
    "new_metric": 1000
  }
}

// En dynamic-stats.js - updateIndexStats()
this.updateElement('.new-stat .stat-number', `${stats.new_metric}+`);
```

## Configuración Avanzada

### Frecuencia de Actualización

Cambiar la frecuencia de actualización automática en `dynamic-stats.js`:

```javascript
setupAutoUpdate() {
    // Cambiar de 5 minutos a 2 minutos
    this.updateInterval = setInterval(() => {
        this.updateAllStats();
    }, 2 * 60 * 1000); // 2 minutos
}
```

### Actualizaciones en Tiempo Real

Cambiar la frecuencia de actualizaciones en tiempo real en `real-time-updates.js`:

```javascript
// Cambiar de 30 segundos a 60 segundos
this.updateInterval = setInterval(() => {
    this.simulateRealTimeActivity();
}, 60000); // 60 segundos
```

## Troubleshooting

### Problemas Comunes

1. **Las estadísticas no se cargan**
   - Verificar que el archivo `dynamic-stats.json` existe
   - Revisar la consola del navegador para errores
   - Verificar que los scripts se cargan en el orden correcto

2. **Las animaciones no funcionan**
   - Verificar que los elementos tienen los selectores CSS correctos
   - Asegurar que los elementos tienen el atributo `data-target`

3. **Las actualizaciones en tiempo real no funcionan**
   - Verificar que el sistema está activado con `window.startRealTimeUpdates()`
   - Revisar el estado con `window.getRealTimeStatus()`

### Debug

```javascript
// Verificar estado del sistema
console.log('Dynamic Stats Status:', {
    loaded: window.dynamicStats?.loaded,
    stats: window.dynamicStats?.stats
});

// Verificar elementos en el DOM
console.log('Trending stats elements:', document.querySelectorAll('.trending-stat .stat-number'));
```

## Rendimiento

- Las estadísticas se cargan una sola vez al inicio
- Las actualizaciones son incrementales y eficientes
- Las animaciones usan `requestAnimationFrame` para mejor rendimiento
- El sistema incluye fallbacks para casos de error

## Compatibilidad

- Compatible con todos los navegadores modernos
- Funciona con JavaScript ES6+
- No requiere dependencias externas
- Compatible con el sistema de temas existente
