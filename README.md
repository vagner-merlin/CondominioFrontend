# My Home - Frontend

Frontend para la aplicación de condominio "My Home" desarrollado con React + Vite.

## 🎨 Diseño
- **Colores principales**: Púrpura claro (#8b5cf6) y blanco
- **Estilo**: Moderno, minimalista con gradientes suaves
- **Responsive**: Adaptado para móviles y desktop

## 🚀 Características actuales
- ✅ Login con validación de formularios
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Estructura organizada de componentes
- ✅ Utilidades para conexión con API (preparadas)

## 📁 Estructura del proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── Login.jsx       # Componente de login
│   └── Login.css       # Estilos del login
├── pages/              # Páginas de la aplicación
│   └── LoginPage.jsx   # Página de login
├── styles/             # Estilos globales
│   └── common.css      # Clases CSS comunes
├── utils/              # Utilidades y helpers
│   └── auth.js         # Funciones de autenticación
└── assets/             # Recursos estáticos
```

## 🛠️ Instalación y ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

## 🔗 Conexión con API

El archivo `src/utils/auth.js` está preparado para conectar con tu API. Solo necesitas:

1. Cambiar la URL base en `API_BASE_URL`
2. Ajustar los endpoints según tu API
3. El sistema de autenticación ya está implementado

## 📱 Próximas características
- [ ] Registro de usuarios
- [ ] Dashboard principal
- [ ] Gestión de condominios
- [ ] Rutas protegidas
- [ ] Y más funcionalidades según tus necesidades

## 🎯 Tecnologías utilizadas
- React 19
- Vite
- CSS3 con variables CSS
- JavaScript ES6+

---

**Desarrollado para My Home** 🏠+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
