import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityAudit = ({ serverConfig }) => {
  const { allowedOrigins, allowedMethods, allowedHeaders, allowCredentials } = serverConfig;
  
  const getSecurityIssues = () => {
    const issues = [];
    
    // 1. Wildcard Origin with Credentials
    if (allowedOrigins.includes('*') && allowCredentials) {
      issues.push({
        severity: 'critical',
        title: 'Configuración Inválida Crítica',
        desc: 'No puedes usar "Access-Control-Allow-Origin: *" junto con "Access-Control-Allow-Credentials: true". Los navegadores bloquearán esta petición por seguridad.',
        recommendation: 'Especifica el origen exacto (ej: https://mi-app.com) en lugar de usar *.'
      });
    }
    
    // 2. Wildcard Origin (General)
    else if (allowedOrigins.includes('*')) {
      issues.push({
        severity: 'warning',
        title: 'Acceso Público Global',
        desc: 'Estás permitiendo el acceso desde CUALQUIER sitio web (*). Esto es aceptable solo para APIs 100% públicas (como datos del clima o noticias).',
        recommendation: 'Si tu API maneja datos de usuario, restringe los orígenes permitidos.'
      });
    }
    
    // 3. Dangerous Methods
    if (allowedMethods.includes('*')) {
       issues.push({
        severity: 'warning',
        title: 'Métodos sin Restricción',
        desc: 'Permitir todos los métodos (*) puede exponer endpoints administrativos (DELETE, PUT) que no deberían ser públicos.',
        recommendation: 'Lista explícitamente los métodos necesarios (ej: GET, POST).'
      });
    }

    // 4. Credentials enabled
    if (allowCredentials && !allowedOrigins.includes('*')) {
      issues.push({
        severity: 'info',
        title: 'Credenciales Habilitadas',
        desc: 'El servidor acepta cookies y headers de autenticación. Asegúrate de que tu backend valide correctamente la sesión.',
        recommendation: 'Verifica que el token CSRF esté implementado si usas cookies.'
      });
    }

    // 5. Sensitive Headers Exposed
    if (serverConfig.exposedHeaders && serverConfig.exposedHeaders.some(h => ['authorization', 'set-cookie', 'cookie'].includes(h.toLowerCase()))) {
        issues.push({
            severity: 'warning',
            title: 'Exposición de Headers Sensibles',
            desc: 'Estás exponiendo headers sensibles (Authorization o Cookies) al código JavaScript del cliente. Esto raramente es necesario y puede ser un riesgo.',
            recommendation: 'Evita exponer credenciales. El navegador las maneja automáticamente.'
        });
    }

    // 6. Max Age Issues
    if (serverConfig.maxAge === 0) {
        issues.push({
            severity: 'info',
            title: 'Sin Caché de Preflight',
            desc: 'Max-Age es 0. Esto obligará al navegador a hacer una petición OPTIONS antes de CADA petición real, lo que puede aumentar la latencia.',
            recommendation: 'Considera un valor como 600 (10 min) o 86400 (24h) para producción.'
        });
    } else if (serverConfig.maxAge > 86400) {
         issues.push({
            severity: 'info',
            title: 'Caché de Preflight Muy Larga',
            desc: `Max-Age es ${serverConfig.maxAge}s. Si cambias tu configuración CORS, los usuarios tardarán en recibir la actualización.`,
            recommendation: 'Asegúrate de que esto es intencional. El límite máximo en muchos navegadores es 24h (86400s).'
        });
    }

    return issues;
  };

  const issues = getSecurityIssues();

  if (issues.length === 0) {
    return (
      <div className="mt-8 bg-green-900/10 border border-green-500/20 rounded-xl p-6 flex items-start gap-4">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <ShieldCheck size={24} className="text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-400 mb-1">Configuración Segura</h3>
          <p className="text-sm text-green-300/80">
            No se han detectado riesgos evidentes en tu política CORS actual.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <ShieldAlert size={16} /> Auditoría de Seguridad
      </h3>
      
      <div className="grid gap-4">
        {issues.map((issue, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-5 rounded-xl border flex items-start gap-4 ${
              issue.severity === 'critical' ? 'bg-red-900/10 border-red-500/30' :
              issue.severity === 'warning' ? 'bg-yellow-900/10 border-yellow-500/30' :
              'bg-blue-900/10 border-blue-500/30'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              issue.severity === 'critical' ? 'bg-red-500/20' :
              issue.severity === 'warning' ? 'bg-yellow-500/20' :
              'bg-blue-500/20'
            }`}>
              {issue.severity === 'critical' && <ShieldAlert size={20} className="text-red-500" />}
              {issue.severity === 'warning' && <AlertTriangle size={20} className="text-yellow-500" />}
              {issue.severity === 'info' && <Info size={20} className="text-blue-500" />}
            </div>
            
            <div>
              <h4 className={`text-base font-bold mb-1 ${
                issue.severity === 'critical' ? 'text-red-400' :
                issue.severity === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>
                {issue.title}
              </h4>
              <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                {issue.desc}
              </p>
              <div className="text-xs font-mono bg-black/30 px-3 py-2 rounded border border-white/5 text-gray-400">
                <span className="text-gray-500 font-bold mr-2">RECOMENDACIÓN:</span>
                {issue.recommendation}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAudit;