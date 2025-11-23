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
      exposedHeaders,
      maxAge
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
    const simpleMethods = ['GET', 'HEAD', 'POST'];
    const simpleContentTypes = [
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain'
    ];

    // Parse headers to find Content-Type
    const requestHeaderKeys = headers.split('\n').map(h => h.split(':')[0].trim()).filter(h => h);
    const contentTypeHeader = headers.split('\n').find(h => h.toLowerCase().startsWith('content-type:'));
    const contentTypeValue = contentTypeHeader ? contentTypeHeader.split(':')[1].trim().split(';')[0] : null;

    let isSimpleRequest = simpleMethods.includes(method);
    
    // If POST, check Content-Type
    if (method === 'POST' && contentTypeValue) {
      if (!simpleContentTypes.includes(contentTypeValue.toLowerCase())) {
        isSimpleRequest = false;
      }
    }
    
    // If custom headers are present (other than simple headers), it's not simple
    // Simple headers: Accept, Accept-Language, Content-Language, Content-Type (with restrictions)
    const simpleHeaders = ['accept', 'accept-language', 'content-language', 'content-type'];
    const hasCustomHeaders = requestHeaderKeys.some(h => !simpleHeaders.includes(h.toLowerCase()));
    
    if (hasCustomHeaders) {
      isSimpleRequest = false;
    }

    const isMethodAllowed = allowedMethods.includes(method);

    if (!isMethodAllowed) {
       // If it's a preflight check failure
       if (!isSimpleRequest) {
         status = 0;
         error = `Error de CORS: El método '${method}' no está permitido por Access-Control-Allow-Methods en la respuesta Preflight.`;
         logs.push({ type: 'error', message: `Preflight fallido: El método '${method}' no está en los métodos permitidos: ${allowedMethods.join(', ')}` });
       } else {
         // Simple requests don't preflight, but if method is not allowed by server logic (not CORS), it fails differently.
         // But strictly CORS-wise, if the method is not in A-C-A-Methods, it might still work if it's a simple method AND the server accepts it.
         // However, usually A-C-A-Methods is relevant for Preflight.
         // For simple requests, the browser checks A-C-A-Origin.
       }
    } else {
      if (!isSimpleRequest) {
         logs.push({ type: 'success', message: `Preflight Exitoso: El método '${method}' está permitido.` });
         responseHeaders['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
         if (maxAge) {
            responseHeaders['Access-Control-Max-Age'] = maxAge;
            logs.push({ type: 'info', message: `Preflight Cache: Validez de ${maxAge} segundos.` });
         }
      }
    }

    // 3. Check Headers
    const allowedHeadersList = allowedHeaders.map(h => h.toLowerCase());
    const invalidHeaders = requestHeaderKeys.filter(h => !allowedHeadersList.includes(h.toLowerCase()));

    if (!isSimpleRequest && invalidHeaders.length > 0) {
      status = 0;
      error = `Error de CORS: La(s) cabecera(s) de solicitud '${invalidHeaders.join(', ')}' no están permitidas por Access-Control-Allow-Headers en la respuesta Preflight.`;
      logs.push({ type: 'error', message: `Preflight fallido: Cabeceras no permitidas: ${invalidHeaders.join(', ')}` });
    } else if (requestHeaderKeys.length > 0) {
      if (!isSimpleRequest) {
          logs.push({ type: 'success', message: `Preflight Exitoso: Todas las cabeceras están permitidas.` });
          responseHeaders['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
      }
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

    // 5. Expose Headers
    if (exposedHeaders && exposedHeaders.length > 0) {
        responseHeaders['Access-Control-Expose-Headers'] = exposedHeaders.join(', ');
    }

    setResult({
      status,
      statusText: status === 0 ? 'Network Error' : statusText,
      headers: responseHeaders,
      logs,
      error,
      method // Pass method for visualization
    });
  };

  return { result, simulateRequest };
};
