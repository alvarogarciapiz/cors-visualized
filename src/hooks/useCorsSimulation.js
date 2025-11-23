import { useState, useEffect } from 'react';

export const useCorsSimulation = (clientConfig, serverConfig) => {
  const [result, setResult] = useState(null);

  const simulateRequest = () => {
    const { origin, method, headers, credentials } = clientConfig;
    const { 
      allowedOrigins, 
      allowedMethods, 
      allowedHeaders, 
      allowCredentials,
      exposedHeaders 
    } = serverConfig;

    let status = 200;
    let statusText = 'OK';
    let responseHeaders = {};
    let logs = [];
    let error = null;

    // 1. Check Origin
    const isOriginAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);
    
    if (!isOriginAllowed) {
      status = 0; // Network Error / Blocked by CORS
      error = `Error de CORS: El origen '${origin}' no está permitido por Access-Control-Allow-Origin.`;
      logs.push({ type: 'error', message: `El origen '${origin}' no coincide con los orígenes permitidos: ${allowedOrigins.join(', ')}` });
    } else {
      logs.push({ type: 'success', message: `El origen '${origin}' está permitido.` });
      responseHeaders['Access-Control-Allow-Origin'] = allowedOrigins.includes('*') ? '*' : origin;
    }

    // Check Credentials (Client side requirement)
    if (credentials && !allowCredentials) {
      status = 0;
      error = "Error de CORS: El valor de la cabecera 'Access-Control-Allow-Credentials' en la respuesta es '' lo cual debe ser 'true' cuando el modo de credenciales de la solicitud es 'include'.";
      logs.push({ type: 'error', message: "El cliente envió credenciales, pero el servidor no las permitió." });
    }

    // 2. Check Method (Preflight simulation)
    // Simple requests: GET, HEAD, POST (with specific content-types)
    // We will assume a preflight is needed for non-simple methods or custom headers for educational purposes
    const isSimpleMethod = ['GET', 'HEAD', 'POST'].includes(method);
    const isMethodAllowed = allowedMethods.includes(method);

    if (!isMethodAllowed) {
       // If it's a preflight check failure
       if (!isSimpleMethod) {
         status = 204; // Preflight might return 204 but fail the check effectively blocking the main request
         // But in browser console it shows as CORS error
         status = 0;
         error = `Error de CORS: El método '${method}' no está permitido por Access-Control-Allow-Methods.`;
         logs.push({ type: 'error', message: `El método '${method}' no está en los métodos permitidos: ${allowedMethods.join(', ')}` });
       } else {
         // Simple methods might still fail on server side logic, but CORS-wise, 
         // if the server doesn't send the header, browser blocks it? 
         // Actually for simple requests, the request goes through, but browser hides response if A-C-A-O is missing.
         // Since we handled A-C-A-O above, we just check if method is supported by server.
         // But for the sake of CORS simulation, let's assume we are checking against A-C-A-Methods for preflight logic mainly.
       }
    } else {
      if (!isSimpleMethod) {
         logs.push({ type: 'success', message: `El método '${method}' está permitido (Preflight aprobado).` });
         responseHeaders['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
      }
    }

    // 3. Check Headers
    // Split headers string into array
    const requestHeaderKeys = headers.split('\n').map(h => h.split(':')[0].trim()).filter(h => h);
    const allowedHeadersList = allowedHeaders.map(h => h.toLowerCase());
    
    const invalidHeaders = requestHeaderKeys.filter(h => !allowedHeadersList.includes(h.toLowerCase()));

    if (invalidHeaders.length > 0) {
      status = 0;
      error = `Error de CORS: La(s) cabecera(s) de solicitud '${invalidHeaders.join(', ')}' no están permitidas por Access-Control-Allow-Headers.`;
      logs.push({ type: 'error', message: `Cabeceras no permitidas: ${invalidHeaders.join(', ')}` });
    } else if (requestHeaderKeys.length > 0) {
      logs.push({ type: 'success', message: `Todas las cabeceras de la solicitud están permitidas.` });
      responseHeaders['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
    }

    // 4. Credentials
    if (allowCredentials) {
      responseHeaders['Access-Control-Allow-Credentials'] = 'true';
      // Note: if credentials are true, Origin cannot be '*'
      if (responseHeaders['Access-Control-Allow-Origin'] === '*') {
        logs.push({ type: 'warning', message: `Advertencia de Configuración: Access-Control-Allow-Credentials es true, pero Access-Control-Allow-Origin es '*'. Esto es inválido según la especificación.` });
        // In strict simulation this fails
        status = 0;
        error = "Error de CORS: Las credenciales no son soportadas si la cabecera CORS 'Access-Control-Allow-Origin' es '*'";
      }
    }

    setResult({
      status,
      statusText: status === 0 ? 'Network Error' : statusText,
      headers: responseHeaders,
      logs,
      error
    });
  };

  return { result, simulateRequest };
};
