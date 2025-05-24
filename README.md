# Longevo Podcasts

Una aplicación moderna de podcasts hecha con React, TypeScript y Vite que te permite descubrir, escuchar y guardar tus podcasts favoritos.

## 🚀 Características

- 🎧 Reproducí podcasts directamente en el navegador
- 📱 Diseño responsive pensado primero para celulares
- ⭐ Sistema de favoritos con persistencia local
- 🔍 Buscá y filtrá episodios
- 📱 Interfaz optimizada para celulares con gestos táctiles
- 🎨 Interfaz re linda con animaciones suaves
- 🌓 Diseño moderno con efecto glassmorphism
- ♿ Características de accesibilidad incluidas
- 💾 Almacenamiento local para mantener tus favoritos

## 🛠️ Tecnologías

- **Framework Frontend**: React 19
- **Lenguaje**: TypeScript
- **Herramienta de Build**: Vite
- **Estilos**: TailwindCSS
- **Animaciones**: Framer Motion
- **Manejo de Estado**: React Query
- **Almacenamiento**: Local Storage
- **Testing**: Vitest + React Testing Library
- **Calidad de Código**: ESLint
- **Gestor de Paquetes**: pnpm

## 📦 Requisitos

- Node.js (versión 18 o más nueva)
- pnpm (versión 8 o más nueva)

## 🚀 Para Empezar

1. Cloná el repositorio:

```bash
git clone https://github.com/tuusuario/longevo-podcast-ejercicio.git
cd longevo-podcasts-ejercicio
```

2. Instalá las dependencias:

```bash
pnpm install
```

3. Arrancá el servidor de desarrollo:

```bash
pnpm dev
```

4. Armá la versión de producción:

```bash
pnpm build
```

## 🏗️ Estructura del Proyecto

```
src/
├── api/          # Integración con APIs y servicios
├── assets/       # Archivos estáticos (íconos, imágenes)
├── components/   # Componentes React reutilizables
├── features/     # Módulos basados en funcionalidades
│   ├── favorites/    # Manejo de podcasts favoritos
│   ├── playback/     # Reproducción de audio
│   ├── podcasts/     # Listado y búsqueda de podcasts
│   └── search/       # Funcionalidad de búsqueda
├── hooks/        # Hooks personalizados de React
├── types/        # Definiciones de tipos de TypeScript
├── App.tsx       # Componente principal de la aplicación
└── main.tsx      # Punto de entrada de la aplicación
```

## 🎯 Componentes y Utilidades Principales

- **PodcastDetailModal**: Muestra la info detallada del podcast con la lista de episodios y botón de favoritos en móvil
- **PlaybackContext**: Maneja el estado de reproducción del audio
- **ModalContext**: Controla la visualización y estado de los modales
- **favoritesUtils**: Maneja la persistencia y gestión de podcasts favoritos
- **Custom Hooks**: Varios hooks para media queries e integración con APIs

## 🔧 Configuración

La aplicación usa Vite para desarrollo y build. La configuración la encontrás en:

- `vite.config.ts`: Configuración de Vite
- `tsconfig.json`: Configuración de TypeScript
- `eslint.config.js`: Reglas de ESLint

## 🎨 Estilos

La aplicación usa TailwindCSS para los estilos con configuraciones personalizadas para:

- Colores
- Tipografía
- Animaciones
- Puntos de quiebre responsive

## 📱 Características para Celular

- Modal tipo bottom sheet con gestos de deslizar
- Controles optimizados para touch
- Botón de favoritos en el modal de detalles
- Adaptaciones de diseño responsive
- Elementos de UI específicos para celular

## 🖥️ Características para Escritorio

- Panel lateral
- Navegación con teclado
- Estados de hover
- UI mejorada para pantallas grandes
- Botón de favoritos en las tarjetas de podcast

## 🧪 Testing

La aplicación utiliza Vitest junto con React Testing Library para testing. Los tests están organizados en las siguientes categorías:

- **Tests de Componentes**: Pruebas de componentes React individuales
- **Tests de Hooks**: Pruebas de hooks personalizados
- **Tests de Integración**: Pruebas de interacción entre componentes
- **Tests de Utilidades**: Pruebas de funciones utilitarias (ej: favoritesUtils)

### Comandos de Testing

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests de un archivo específico
pnpm test ruta/al/archivo.test.ts

# Ejecutar tests con interfaz visual
pnpm test:ui
```

### Estructura de Tests

```
src/
├── components/
│   └── __tests__/        # Tests de componentes
├── hooks/
│   └── __tests__/        # Tests de hooks
├── features/
│   └── __tests__/        # Tests de features
└── test/
    ├── setup.ts          # Configuración global de tests
    └── test-utils.tsx    # Utilidades comunes para testing
```

### Mocks y Configuración de Tests

El proyecto incluye mocks para:

- localStorage para persistencia de favoritos
- matchMedia para testing responsive
- IntersectionObserver para infinite scroll
- Audio API para reproducción de podcasts
- Scroll behavior para modales

### Cobertura de Tests

Los tests cubren:

- Renderizado de componentes
- Interacciones de usuario
- Llamadas a API
- Estados de carga y error
- Responsive design
- Gestión de estado
- Navegación y routing
- Persistencia de datos

## 💾 Almacenamiento Local

La aplicación utiliza Local Storage para:

- **Favoritos**: Guarda tus podcasts favoritos para acceder incluso después de cerrar el navegador
- **Persistencia**: Mantiene el estado de tus preferencias entre sesiones
- **Manejo Offline**: Acceso a tus favoritos incluso sin conexión

### Estructura del Almacenamiento

```
localStorage/
├── favorites    # Array de podcasts favoritos
└── ...         # Otras configuraciones
```

## 📱 Progressive Web App (PWA)

La aplicación está configurada como una Progressive Web App (PWA), lo que significa que puede instalarse en dispositivos móviles y funcionar offline. Características principales:

- **Instalable**: Se puede instalar como una aplicación nativa en dispositivos móviles y escritorio
- **Offline First**: Funciona sin conexión a internet gracias a las estrategias de caché
- **Actualizaciones Automáticas**: Notifica al usuario cuando hay una nueva versión disponible

### Estrategias de Caché

- **NetworkFirst**: Para el listado de podcasts, asegurando contenido actualizado
- **StaleWhileRevalidate**: Para episodios, permitiendo acceso rápido mientras se actualiza en background
- **CacheFirst**: Para archivos de audio, optimizando el uso de datos

### Servir la Aplicación

Después de construir la aplicación con `pnpm build`, podés servirla localmente usando:

```bash
pnpm dlx serve dist --listen 3000
```

Esto iniciará un servidor estático en `http://localhost:3000` donde podrás probar todas las características de la PWA, incluyendo:

- Prompt de instalación
- Funcionamiento offline
- Notificaciones de actualización
- Caché de contenido

Para un ambiente de producción, podés usar cualquier servidor web estático como Nginx, Apache, o servicios de hosting como Vercel, Netlify o GitHub Pages.
