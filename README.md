# CORS Visualizer

A modern, interactive React application to visualize and understand Cross-Origin Resource Sharing (CORS).

## Features

- **Interactive Simulation**: Configure client requests and server CORS policies to see how they interact in real-time.
- **Visual Feedback**: Clear indicators for success/failure, with detailed logs explaining *why* a request failed.
- **Educational Content**: Learn about Same-Origin Policy, Preflight requests, and common pitfalls.
- **Modern UI**: Built with a "Deep Space" aesthetic using React, Vite, and Framer Motion.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Technologies Used

-   **React 19**
-   **Vite**
-   **Framer Motion** (Animations)
-   **Lucide React** (Icons)
-   **CSS Modules / Variables** (Styling)

## License

MIT

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
