# Good to Save Marketplace - Plataforma de Reducción de Desperdicio de Alimentos

Una plataforma web moderna y responsive diseñada para reducir el desperdicio global de alimentos conectando consumidores con proveedores que venden excedentes o alimentos próximos a caducar a precios reducidos.

## 🌟 Características Principales

### 🎯 Funcionalidades Core
- **Marketplace Completo**: Catálogo de productos con filtros avanzados
- **Carrito de Compras**: Sistema completo con persistencia local
- **Proceso de Pago**: Formulario seguro con validación en tiempo real
- **Códigos QR**: Generación automática para recogida de pedidos
- **Autenticación**: Sistema de login/registro con validación
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop

### 🎨 Diseño y UX
- **Tema Sostenible**: Paleta de colores verde enfocada en medio ambiente
- **Componentes Modulares**: Arquitectura reutilizable y escalable
- **Animaciones Suaves**: Transiciones y efectos visuales modernos
- **Accesibilidad**: Cumple estándares WCAG para inclusividad
- **Performance**: Carga rápida con lazy loading y optimizaciones

### 🔧 Tecnologías Utilizadas
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Flexbox, Grid, animaciones
- **JavaScript ES6+**: Módulos, async/await, clases
- **Local Storage**: Persistencia de datos del carrito
- **QR Code**: Generación de códigos QR para pedidos

## 🚀 Inicio Rápido

### Prerrequisitos
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Servidor web local (opcional, para desarrollo)

### Instalación
1. **Descarga el proyecto**:
   ```bash
   git clone https://github.com/tu-usuario/food-marketplace.git
   cd food-marketplace
   ```

2. **Abre en tu navegador**:
   - Simplemente abre `index.html` en tu navegador
   - O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   
   # Con PHP
   php -S localhost:8000
   ```

3. **¡Listo!** Navega a `http://localhost:8000` (o abre directamente el archivo)

## 📁 Estructura del Proyecto

```
/food-marketplace/
├── index.html                 # Página principal
├── about.html                 # Sobre nosotros
├── marketplace/marketplace.html           # Catálogo de productos
├── payment.html              # Proceso de pago
├── qr.html                   # Confirmación QR
├── login.html                # Inicio de sesión
├── register.html             # Registro
├── components/               # Componentes reutilizables
│   ├── header.html              # Navegación principal
│   ├── footer.html              # Pie de página
│   ├── cards/
│   │   └── product-card.html    # Tarjeta de producto
│   └── web-components/          # Web Components (JS)
│       ├── app-header.js
│       ├── app-header-auth.js
│       ├── app-footer.js
│       └── app-cart.js
├── styles/                  # Hojas de estilo
│   ├── main.css            # Estilos principales
│   ├── components.css      # Estilos de componentes
│   ├── pages.css           # Estilos específicos de páginas
│   └── responsive.css      # Media queries
├── scripts/                # JavaScript
│   ├── main.js            # Funcionalidad principal
│   ├── components.js      # Cargador de componentes
│   ├── cart.js            # Lógica del carrito
│   ├── auth/auth.js       # Autenticación
│   └── qr-generator.js    # Generación de QR
├── assets/                 # Recursos
│   ├── images/            # Imágenes
│   │   ├── logo.svg       # Logo principal
│   │   ├── products/      # Imágenes de productos
│   │   └── team/          # Fotos del equipo
│   └── data/              # Datos JSON
│       ├── products.json  # Base de datos de productos
│       └── team.json      # Información del equipo
└── README.md              # Documentación
```

## 🛠️ Desarrollo

### Agregar Nuevos Productos
Edita `assets/data/products.json` para agregar productos:

```json
{
  "id": 13,
  "title": "Nuevo Producto",
  "supplier": "Proveedor",
  "category": "produce",
  "originalPrice": 10.99,
  "discountedPrice": 5.49,
  "discountPercentage": 50,
  "quantity": 10,
  "expiresIn": 3,
  "expirationDate": "2024-01-28",
  "image": "assets/images/products/nuevo-producto.jpg",
  "description": "Descripción del producto",
  "location": "Ubicación",
  "supplier_rating": 4.5,
  "tags": ["tag1", "tag2"]
}
```

### Personalizar Estilos
- **Colores principales**: Edita variables CSS en `styles/main.css`
- **Componentes**: Modifica `styles/components.css`
- **Responsive**: Ajusta `styles/responsive.css`

### Agregar Nuevas Páginas
1. Crea el archivo HTML en el directorio raíz
2. Incluye los placeholders para header/footer:
   ```html
   <div id="header-placeholder"></div>
   <!-- Contenido de la página -->
   <div id="footer-placeholder"></div>
   ```
3. Agrega la inicialización en `scripts/main.js`

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Verde Principal**: `#2D5A27` - Sostenibilidad
- **Verde Claro**: `#4A7C59` - Elementos secundarios
- **Naranja**: `#F4A261` - Llamadas a la acción
- **Amarillo**: `#E9C46A` - Acentos

### Tipografía
- **Inter**: Fuente principal para texto
- **Poppins**: Títulos y encabezados

### Componentes
- **Botones**: Sistema completo con variantes
- **Formularios**: Validación en tiempo real
- **Tarjetas**: Diseño consistente para productos
- **Navegación**: Header responsive con carrito

## 📱 Soporte Móvil

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Características Responsive
- Navegación hamburguesa en móvil
- Grid adaptativo de productos
- Formularios optimizados para touch
- Carrito lateral en desktop, modal en móvil

## 🔐 Seguridad y Privacidad

### Validación de Formularios
- Validación en tiempo real
- Mensajes de error claros
- Sanitización de inputs
- Prevención de XSS

### Datos del Usuario
- Almacenamiento local seguro
- No se envían datos a servidores externos
- Códigos QR generados localmente

## 🚀 Optimización de Performance

### Carga Rápida
- Lazy loading de imágenes
- CSS y JS minificados
- Componentes cargados bajo demanda
- Caché de datos en localStorage

### SEO
- Meta tags optimizados
- Estructura HTML semántica
- URLs amigables
- Open Graph tags

## 🌍 Impacto Ambiental

### Métricas de Impacto
- **15,680 kg** de alimentos salvados
- **12,450 kg** de CO2 reducidos
- **4,200 familias** beneficiadas
- **€89,000** ahorrados por consumidores

### Características Sostenibles
- Diseño digital sin desperdicio físico
- Promoción de productos locales
- Reducción de transporte innecesario
- Educación sobre desperdicio alimentario

## 🤝 Contribuir

### Reportar Bugs
1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir
4. Especifica tu navegador y sistema operativo

### Sugerir Mejoras
1. Crea un issue con la etiqueta "enhancement"
2. Describe la funcionalidad deseada
3. Explica el beneficio para los usuarios

### Pull Requests
1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

### Contacto
- **Email**: support@goodtosave.com
- **Teléfono**: +34 900 123 456
- **Horario**: Lunes a Viernes, 9:00 - 18:00

### Recursos Adicionales
- [Documentación de la API](docs/api.md)
- [Guía de Estilos](docs/styleguide.md)
- [FAQ](docs/faq.md)

## 🙏 Agradecimientos

- Comunidad de desarrolladores open source
- Proveedores locales comprometidos con la sostenibilidad
- Usuarios que contribuyen a reducir el desperdicio alimentario
- Equipo de diseño y desarrollo

---

**Good to Save Marketplace** - Transformando el desperdicio de alimentos en oportunidades sostenibles. 🌱 

---

## 📚 Documentación Consolidada

### 🎨 Sistema de Animaciones

Consulta de clases, patrones y buenas prácticas de animación usados en el proyecto, incluyendo efectos de entrada, hover, partículas, texto y rendimiento.

- Archivos clave: `public/css/animations.css`, `public/css/enhanced-animations.css`, `public/css/marketplace-animations.css`, `public/js/animations.js`
- Clases disponibles: `.animate-slide-in-*`, `.animate-fade-in-*`, `.hover-*`, `.animate-*`, `.glass-effect`, `.text-glow`
- Rendimiento: uso de `transform/opacity`, IntersectionObserver y soporte `prefers-reduced-motion`

### 🔐 Guía de Pruebas de Autenticación

Pasos y comandos de consola para verificar el estado de Firebase/Auth, probar inicio de sesión, depurar problemas comunes y exportar logs.

- Comandos: `debugAuth.checkStatus()`, `debugAuth.checkService()`, `debugAuth.getLogs()`
- Problemas comunes cubiertos y soluciones: inicialización, errores de dependencias y validaciones
- Checklist de pruebas básicas de login/registro y manejo de errores

### 📊 Sistema de Estadísticas Dinámicas

Sistema para cargar y animar cifras desde `public/assets/data/dynamic-stats.json`, con actualizaciones en tiempo real opcionales.

- Archivos: `public/js/dynamic-stats.js`, `public/js/real-time-updates.js`
- Uso en consola: `window.dynamicStats.getStat(...)`, `updateStat(...)`, `exportStats()`, `startRealTimeUpdates()`
- Estructura de datos: `platform_stats`, `impact_stats`, `global_problem`, `testimonials`, `success_stories`

### 🛠️ Fix Permanente de Firebase Auth

Resumen de la solución aplicada para errores de `onAuthStateChanged`, dependencias y sintaxis, con inicialización robusta y utilidades de manejo de errores.

- Archivos: `public/auth/firebase-auth.js`, `public/firebase/firebase-config.js`, `public/js/firebase-utils.js`, `public/js/roles.js`, `public/auth/auth.js`
- Helpers: `ensureInitialized()`, `FirebaseUtils.handleError(...)`
- Orden de carga recomendado de SDK y scripts

### 🔥 Configuración de Firebase

Instrucciones para crear proyecto, habilitar Authentication/Firestore, colocar credenciales en `public/firebase/firebase-config.js`, y reglas de Firestore base.

- Reglas ejemplo para colecciones `users` y `products`
- Checklist de verificación y solución de problemas comunes

### 🗄️ Firestore: Reglas para Órdenes

Reglas sugeridas para la colección `orders` (lectura/escritura por dueño), estructura de documento y verificación de funcionamiento.

- Índice recomendado: `orders (uid asc, createdAt desc)`

### 🌐 Firebase Hosting

Guía de despliegue/servido local y optimizaciones de hosting.

- Comandos: `npm run deploy`, `firebase hosting:channel:deploy preview`, `npm run serve`
- Estructura publicada: carpeta `public/`
- Headers de seguridad y caché, reescrituras para SPA, URLs de proyecto
