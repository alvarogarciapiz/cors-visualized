# 🌐 CORS Visualized

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com/)

> **Domina el Intercambio de Recursos de Origen Cruzado de una vez por todas.**
>
> 🚀 **Demo en vivo:** [https://cors-visualized.lvrpiz.com](https://cors-visualized.lvrpiz.com)

**CORS Visualized** es la herramienta educativa interactiva definitiva para desarrolladores, estudiantes y entusiastas de la seguridad. Deja de adivinar por qué fallan tus peticiones y empieza a visualizar el saludo invisible entre tu navegador y el servidor.

---

<div align="center">
  <video src="https://github.com/user-attachments/assets/f607babb-3daf-4bc5-81ab-3d2c9f2fa872" width="100%" controls autoplay loop muted></video>
</div>

---

## 🧐 ¿Qué es CORS?

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad del navegador que restringe las peticiones HTTP de origen cruzado. Es la razón por la que tu frontend en `localhost:3000` no puede hablar simplemente con tu backend en `api.ejemplo.com` sin permiso explícito.

Esta herramienta convierte cabeceras abstractas y documentación árida en un **patio de recreo visual e interactivo**.

## ✨ Características Principales

### 🎮 Simulación Interactiva
Diseña tus propios escenarios de Cliente vs Servidor. Ajusta el `Origen`, `Métodos`, `Cabeceras` y `Credenciales` en tiempo real y observa cómo se despliega la lógica de decisión del navegador.

### 🏆 Modo Desafío (Aprendizaje Gamificado)
Pon a prueba tus habilidades con **5 niveles de dificultad creciente**:
1.  **El Bloqueo Básico:** Soluciona desajustes simples de origen.
2.  **Método Desconocido:** Maneja peticiones Preflight para DELETE/PUT.
3.  **Credenciales Cruzadas:** Domina las reglas complejas de `Access-Control-Allow-Credentials`.
4.  **Cabeceras Personalizadas:** Aprende a permitir API Keys (`X-Api-Key`).
5.  **Nivel Experto:** Expón cabeceras ocultas (`Access-Control-Expose-Headers`) al frontend.

### 🛡️ Auditoría de Seguridad
Recibe feedback instantáneo sobre tu configuración. La herramienta analiza tu configuración en busca de vulnerabilidades comunes:
*   Uso de comodín (`*`) con Credenciales.
*   Exposición excesiva de cabeceras sensibles.
*   Configuraciones de caché `Max-Age` inseguras.

### 💻 Generador de Código Multi-Lenguaje
No solo lo aprendas, impleméntalo. Genera configuraciones CORS listas para producción para tu stack tecnológico:
*   **Node.js** (Express)
*   **Python** (FastAPI)
*   **Java** (Spring Boot)
*   **Go** (Gin)
*   **C#** (ASP.NET Core)
*   **Infraestructura:** Nginx, Apache, AWS S3, Vercel, Next.js.

## 🚀 Empezando

Clona el repositorio y ejecútalo localmente para experimentar sin necesidad de acceso a internet.

```bash
# Clona el repositorio
git clone https://github.com/alvarogarciapiz/cors-visualized.git

# Entra en el directorio
cd cors-visualized

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

## 🛠️ Stack Tecnológico

Construido con cariño y estándares web modernos:
*   **React 18** (Librería de UI)
*   **Vite** (Herramienta de construcción ultrarrápida)
*   **Tailwind CSS** (Estilos utility-first)
*   **Framer Motion** (Animaciones fluidas)
*   **Lucide React** (Iconos hermosos)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Ya sea un nuevo nivel de desafío, una traducción o la corrección de un bug. Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el fichero [LICENSE](LICENSE) para más detalles.

## 🔗 Créditos y Recursos

*   Creado por **[@lvrpiz](https://github.com/alvarogarciapiz)**.
*   Basado en un artículo de **[The lvrpiz Newsletter](https://www.blog.lvrpiz.com)**.
*   Echa un vistazo a mi web: [lvrpiz.com](https://lvrpiz.com).

---

### 🔍 Palabras Clave para Descubrimiento
CORS, Intercambio de Recursos de Origen Cruzado, Seguridad Web, Herramientas de Desarrollador, Educativo, React, Simulación Interactiva, Política CORS, Desarrollo Frontend, Configuración Backend, Express, FastAPI, Spring Boot, Nginx, Apache, AWS S3, Vercel, Next.js, Desarrollo Web, Cabeceras HTTP, Petición Preflight, SOP, Política de Mismo Origen.
