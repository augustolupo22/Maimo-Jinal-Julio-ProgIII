# TP4: Desarrollo de un Ecommerce con Productos Customizables

**Materia:** Programación 3  
**Tecnologías:** Next.js 16, React 19, MongoDB, Mongoose, TailwindCSS 4, Recharts

---

## Descripción

Aplicación web de ecommerce que permite publicar, visualizar y comprar productos con opciones de customización. El usuario puede seleccionar atributos personalizados, agregar productos al carrito, marcar favoritos y finalizar compras generando órdenes en MongoDB.

---

## Funcionalidades implementadas

### Modelos (MongoDB/Mongoose)
- **Product**: nombre, descripción, precio, stock, imagen, categorías (relación many-to-many por ID), atributos customizables
- **Category**: nombre, descripción
- **User**: nombre, email, password (encriptado con bcryptjs), favoritos
- **Order**: número secuencial, userId, snapshot de productos (nombre, imagen, precio, cantidad, customizaciones, subtotal), dirección, contacto, notas, estados (Active/Closed/Shipped/Canceled)
- **Counter**: contador para números secuenciales de órdenes

### Pantallas públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo con búsqueda, filtros por categoría y precio |
| `/categories` | Listado de categorías |
| `/category/[id]` | Productos de una categoría |
| `/product/[id]` | Detalle con customizaciones, selector de cantidad, agregar al carrito, favoritos, productos relacionados |

### Pantallas de usuario (client-side)
| Ruta | Descripción |
|------|-------------|
| `/cart` | Carrito con ajuste de cantidades, eliminación, total |
| `/favorites` | Favoritos (temporales sin login, persistidos con login) |
| `/checkout` | Formulario con datos de contacto, dirección, simulación de pago |
| `/user` | Panel con datos del usuario y listado de órdenes |
| `/user/order/[id]` | Detalle de orden (solo lectura) |

### Pantallas de administración
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Resumen con métricas, órdenes recientes, usuarios, stock bajo, gráficos |
| `/dashboard/products` | CRUD de productos y categorías |
| `/dashboard/orders` | Listado de órdenes con cambio de estado |
| `/dashboard/order/[id]` | Detalle administrativo con cambio de estado |

### Context Global
Estados: `cart`, `favorites`, `activeUser`  
Funciones: addToCart, removeFromCart, updateQuantity, clearCart, toggleFavorite, toggleFavoriteWithUser, isFavorite, login, loginWithFavorites, logout

### APIs implementadas
- `GET/POST /api/products` — listar / crear productos
- `GET/PUT/DELETE /api/products/[id]` — obtener / actualizar / eliminar producto
- `GET /api/products/public` — listado público con filtros (search, category, minPrice, maxPrice)
- `GET/POST /api/categories` — listar / crear categorías
- `GET/PUT/DELETE /api/categories/[id]` — obtener / actualizar / eliminar categoría
- `POST /api/orders` — crear orden
- `GET /api/orders` — listar órdenes (admin)
- `GET/PUT /api/orders/[id]` — obtener / actualizar estado de orden
- `PATCH /api/orders/[id]/status` — cambiar estado
- `POST /api/auth/register` — registrar usuario
- `POST /api/auth/login` — login con verificación de contraseña
- `GET/PUT /api/users/[id]` — obtener / actualizar usuario
- `GET/POST/DELETE/PUT /api/users/[id]/favorites` — CRUD de favoritos + sync
- `GET /api/users/[id]/orders` — órdenes del usuario
- `GET /api/users/[id]/orders/[orderId]` — detalle de orden del usuario

### Opcionales implementados (4/11)
1. Simulación de pago con tarjeta (formulario con validación en checkout)
2. Búsqueda de productos por nombre/descripción
3. Filtros por categoría y precio
4. Gráficos en dashboard (ingresos por mes con BarChart, ingresos por estado con PieChart)

---

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd ecommerce-tp4

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env
# Editar .env con la URI de MongoDB

# 4. Cargar datos de prueba
npm run seed

# 5. Iniciar el servidor
npm run dev
```

Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## Datos de prueba

El seed (`npm run seed`) carga:

**Categorías:** Cookies, Brownies, Tortas, Alfajores

**Productos:** Cookie Clásica, Brownie Especial, Torta Personalizada, Alfajor de Maicena, Cookie Red Velvet, Brownie de Nutella — todos con atributos customizables y categorías asociadas.

**Usuarios:**

| Email | Contraseña |
|-------|-----------|
| juan@test.com | password123 |
| maria@test.com | password123 |
| admin@test.com | password123 |

**Órdenes de ejemplo:** #1000 (Active), #1001 (Shipped) — con snapshot de productos, customizaciones y datos de envío.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # register, login
│   │   ├── products/  # CRUD + public
│   │   ├── categories/ # CRUD
│   │   ├── orders/    # CRUD + status
│   │   └── users/     # perfil, favoritos, órdenes
│   ├── cart/
│   ├── categories/
│   ├── category/[id]/
│   ├── checkout/
│   ├── dashboard/
│   │   ├── orders/
│   │   ├── order/[id]/
│   │   └── products/
│   ├── favorites/
│   ├── product/[id]/
│   ├── user/
│   │   └── order/[id]/
│   ├── actions/       # Server Actions
│   ├── layout.js
│   ├── page.js
│   └── HomeFilters.js
├── components/        # Componentes reutilizables
├── containers/        # Containers del dashboard
├── lib/               # Utilidades, context, helpers
└── models/            # Modelos Mongoose
```

---

## Uso de IA

Este proyecto fue desarrollado con asistencia de **opencode** (agente de codigo AI) para:

- Generación y revisión de código
- Depuración de errores en rutas API y componentes
- Implementación de funcionalidades complejas (carrito con customizaciones, sincronización de favoritos, dashboard con métricas, buscador y filtros)
- Verificación de cumplimiento de la consigna
- Refactorización y corrección de bugs (login con verificación de contraseña)

### Reflexión

El proceso arrancó con una base que ya tenía CRUD de productos y categorías, y a partir de ahí fuimos construyendo cada módulo paso a paso. Lo primero fue definir los modelos de Mongoose (User, Order, Counter) y el context global con cart, favorites y activeUser, que terminó siendo el eje de toda la interacción del lado cliente.

Con el context funcionando, implementamos las pantallas de catálogo, detalle de producto con customizaciones, carrito y checkout. La parte más compleja fue coordinar los favoritos entre el estado temporal del context y la persistencia en MongoDB según si el usuario estaba logueado o no. También hubo que ajustar la sincronización al iniciar sesión para combinar favoritos locales con los de la base de datos sin duplicados.

Del lado administrativo, armamos el dashboard con métricas, gráficos (Recharts), gestión de productos y categorías con Server Actions, y el panel de órdenes con cambio de estado. Las pantallas de usuario (perfil, historial y detalle de órdenes) consumen APIs propias que validan que cada usuario vea solo sus órdenes.

Durante el desarrollo, la IA ayudó a generar estructura rápida y detectar errores, pero varias decisiones importantes se resolvieron de forma manual: la lógica del carrito con customizaciones, la validación de seguridad del login (que inicialmente no verificaba la contraseña y hubo que corregirla), y el diseño visual con TailwindCSS. También se eligieron 4 opcionales (simulación de pago, búsqueda, filtros y gráficos) que están integrados en las pantallas correspondientes.

El resultado final cumple con todos los requerimientos obligatorios de la consigna: modelos, rutas APIs, pantallas públicas, panel de usuario, dashboard admin, carrito persistente, favoritos sincronizados, órdenes con número secuencial y snapshot de productos. La IA funcionó como asistente de codificación, pero el criterio de implementación, la validación de la lógica de negocio y el diseño quedaron del lado humano.
