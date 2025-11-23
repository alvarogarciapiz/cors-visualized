# CORS Visualized

![CORS Visualized Banner](https://cors-visualized.lvrpiz.com/og.webp)

> **Accede a la herramienta aquí:** [https://cors-visualized.lvrpiz.com](https://cors-visualized.lvrpiz.com)

**CORS Visualized** es una herramienta educativa interactiva diseñada para desmitificar el **Intercambio de Recursos de Origen Cruzado (CORS)**. Permite a desarrolladores web, estudiantes y curiosos visualizar en tiempo real cómo interactúan las políticas de seguridad del navegador con las configuraciones del servidor.

## ¿Qué es CORS?

**CORS (Cross-Origin Resource Sharing)** es un mecanismo basado en cabeceras HTTP que permite a un servidor indicar cualquier origen (dominio, esquema o puerto) distinto del suyo desde el que un navegador debería permitir la carga de recursos.

Es una medida de seguridad fundamental en la web moderna, pero a menudo es una fuente de frustración y confusión para los desarrolladores. Esta herramienta busca cambiar eso.

### Conceptos Clave que Aprenderás

*   **Same-Origin Policy (SOP):** La regla de seguridad base que restringe cómo un documento o script de un origen puede interactuar con recursos de otro origen.
*   **Preflight Requests:** Entiende por qué y cuándo tu navegador envía una petición `OPTIONS` antes de la petición real.
*   **Cabeceras HTTP:** Visualiza el impacto de `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, y más.
*   **Credenciales:** Aprende a configurar correctamente el envío de Cookies y cabeceras de autorización entre dominios.

## Características de la Herramienta

*   **Simulador Interactivo:** Configura libremente las cabeceras del "Cliente" y del "Servidor" para ver si la petición tiene éxito o falla.
*   **Presets Educativos:** Carga escenarios predefinidos como "Petición Simple", "Error de Preflight", o "Credenciales Rechazadas" para aprender casos específicos.
*   **Logs Detallados:** Recibe feedback inmediato y explicaciones claras de por qué una petición fue bloqueada por el navegador.
*   **Guía Visual:** Una interfaz moderna y clara que hace que los conceptos abstractos sean tangibles.

## Uso

Simplemente visita [https://cors-visualized.lvrpiz.com](https://cors-visualized.lvrpiz.com). No necesitas instalar nada. La aplicación se ejecuta enteramente en tu navegador.

## Tecnologías

Este proyecto ha sido construido con tecnologías web modernas para ofrecer una experiencia fluida y reactiva:

*   **React**
*   **Vite**
*   **Tailwind CSS**
*   **Framer Motion**

## Autor

Creado por **Álvaro García Pizarro**.

*   Web: [lvrpiz.com](https://www.lvrpiz.com)
*   Twitter: [@lvrpiz](https://twitter.com/lvrpiz)
*   GitHub: [@alvarogarciapiz](https://github.com/alvarogarciapiz)

---

*Esta herramienta es puramente educativa y realiza simulaciones locales. No realiza peticiones reales a servidores externos.*
