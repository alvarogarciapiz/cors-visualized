import React, { useState } from 'react';
import { Copy, Check, Code, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { id: 'express', name: 'Node.js (Express)', icon: 'JS' },
  { id: 'fastapi', name: 'Python (FastAPI)', icon: 'PY' },
  { id: 'springboot', name: 'Java (Spring Boot)', icon: 'JV' },
  { id: 'go', name: 'Go (Gin)', icon: 'GO' },
  { id: 'aspnet', name: 'C# (ASP.NET Core)', icon: 'CS' },
  { id: 'nginx', name: 'Nginx', icon: 'NG' },
  { id: 'apache', name: 'Apache', icon: 'AP' },
  { id: 's3', name: 'AWS S3', icon: 'AWS' },
  { id: 'vercel', name: 'Vercel', icon: 'VC' },
  { id: 'nextjs', name: 'Next.js', icon: 'NX' },
];

const CodeGenerator = ({ serverConfig }) => {
  const [activeTab, setActiveTab] = useState('express');
  const [copied, setCopied] = useState(false);

  const generateCode = (lang) => {
    const { allowedOrigins, allowedMethods, allowedHeaders, allowCredentials, exposedHeaders, maxAge } = serverConfig;
    const originsStr = allowedOrigins.includes('*') ? "'*'" : JSON.stringify(allowedOrigins).replace(/"/g, "'");
    const methodsStr = JSON.stringify(allowedMethods).replace(/"/g, "'");
    const headersStr = JSON.stringify(allowedHeaders).replace(/"/g, "'");
    const exposedStr = exposedHeaders && exposedHeaders.length > 0 ? JSON.stringify(exposedHeaders).replace(/"/g, "'") : null;

    switch (lang) {
      case 'express':
        return `const cors = require('cors');
const app = express();

const corsOptions = {
  origin: ${allowedOrigins.includes('*') ? "'*'" : `[${allowedOrigins.map(o => `'${o}'`).join(', ')}]`},
  methods: [${allowedMethods.map(m => `'${m}'`).join(', ')}],
  allowedHeaders: [${allowedHeaders.map(h => `'${h}'`).join(', ')}],
  ${exposedStr ? `exposedHeaders: [${exposedHeaders.map(h => `'${h}'`).join(', ')}],` : ''}
  ${maxAge ? `maxAge: ${maxAge},` : ''}
  credentials: ${allowCredentials}
};

app.use(cors(corsOptions));`;

      case 'fastapi':
        return `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=${allowedOrigins.includes('*') ? "['*']" : `[${allowedOrigins.map(o => `'${o}'`).join(', ')}]`},
    allow_credentials=${allowCredentials ? 'True' : 'False'},
    allow_methods=[${allowedMethods.map(m => `'${m}'`).join(', ')}],
    allow_headers=[${allowedHeaders.map(h => `'${h}'`).join(', ')}],
    ${exposedStr ? `expose_headers=[${exposedHeaders.map(h => `'${h}'`).join(', ')}],` : ''}
    ${maxAge ? `max_age=${maxAge},` : ''}
)`;

      case 'springboot':
        return `@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(${allowedOrigins.includes('*') ? '"*"' : allowedOrigins.map(o => `"${o}"`).join(', ')})
            .allowedMethods(${allowedMethods.map(m => `"${m}"`).join(', ')})
            .allowedHeaders(${allowedHeaders.map(h => `"${h}"`).join(', ')})
            ${exposedStr ? `.exposedHeaders(${exposedHeaders.map(h => `"${h}"`).join(', ')})` : ''}
            ${maxAge ? `.maxAge(${maxAge})` : ''}
            .allowCredentials(${allowCredentials});
    }
}`;

      case 'go':
        return `package main

import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "time"
)

func main() {
    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{${allowedOrigins.includes('*') ? '"*"' : allowedOrigins.map(o => `"${o}"`).join(', ')}},
        AllowMethods:     []string{${allowedMethods.map(m => `"${m}"`).join(', ')}},
        AllowHeaders:     []string{${allowedHeaders.map(h => `"${h}"`).join(', ')}},
        ${exposedHeaders && exposedHeaders.length > 0 ? `ExposeHeaders:     []string{${exposedHeaders.map(h => `"${h}"`).join(', ')}},` : ''}
        AllowCredentials: ${allowCredentials},
        ${maxAge ? `MaxAge:           ${maxAge} * time.Second,` : ''}
    }))

    r.Run()
}`;

      case 'aspnet':
        return `var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyCorsPolicy",
        policy =>
        {
            policy${allowedOrigins.includes('*') ? '.AllowAnyOrigin()' : `.WithOrigins(${allowedOrigins.map(o => `"${o}"`).join(', ')})`}
                  ${allowedMethods.includes('*') ? '.AllowAnyMethod()' : `.WithMethods(${allowedMethods.map(m => `"${m}"`).join(', ')})`}
                  ${allowedHeaders.includes('*') ? '.AllowAnyHeader()' : `.WithHeaders(${allowedHeaders.map(h => `"${h}"`).join(', ')})`}
                  ${allowCredentials ? '.AllowCredentials()' : ''}
                  ${exposedHeaders && exposedHeaders.length > 0 ? `.WithExposedHeaders(${exposedHeaders.map(h => `"${h}"`).join(', ')})` : ''};
        });
});

var app = builder.Build();
app.UseCors("MyCorsPolicy");`;

      case 'nginx':
        const isWildcard = allowedOrigins.includes('*');
        const exposedNginx = exposedHeaders && exposedHeaders.length > 0 ? `add_header 'Access-Control-Expose-Headers' '${exposedHeaders.join(', ')}' always;` : '';
        const maxAgeNginx = maxAge ? `add_header 'Access-Control-Max-Age' ${maxAge} always;` : '';
        
        if (isWildcard) {
            return `server {
    location /api/ {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' '${allowedMethods.join(', ')}';
        add_header 'Access-Control-Allow-Headers' '${allowedHeaders.join(', ')}';
        ${exposedHeaders && exposedHeaders.length > 0 ? `add_header 'Access-Control-Expose-Headers' '${exposedHeaders.join(', ')}';` : ''}
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' '${allowedMethods.join(', ')}';
            add_header 'Access-Control-Allow-Headers' '${allowedHeaders.join(', ')}';
            ${maxAge ? `add_header 'Access-Control-Max-Age' ${maxAge};` : ''}
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}`;
        } else {
            const originRegex = allowedOrigins.map(o => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            return `server {
    location /api/ {
        set $cors_origin "";
        if ($http_origin ~* "^(${originRegex})$") {
            set $cors_origin $http_origin;
        }

        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Methods' '${allowedMethods.join(', ')}' always;
        add_header 'Access-Control-Allow-Headers' '${allowedHeaders.join(', ')}' always;
        add_header 'Access-Control-Allow-Credentials' '${allowCredentials ? 'true' : 'false'}' always;
        ${exposedNginx}

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' $cors_origin always;
            add_header 'Access-Control-Allow-Methods' '${allowedMethods.join(', ')}' always;
            add_header 'Access-Control-Allow-Headers' '${allowedHeaders.join(', ')}' always;
            add_header 'Access-Control-Allow-Credentials' '${allowCredentials ? 'true' : 'false'}' always;
            ${maxAgeNginx}
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}`;
        }

      case 'apache':
        const originPattern = allowedOrigins.includes('*') 
            ? "*" 
            : `^(${allowedOrigins.map(o => o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`;
        
        const exposedApache = exposedHeaders && exposedHeaders.length > 0 ? `Header set Access-Control-Expose-Headers "${exposedHeaders.join(', ')}"` : '';
        const maxAgeApache = maxAge ? `Header set Access-Control-Max-Age "${maxAge}"` : '';

        return `<IfModule mod_headers.c>
    SetEnvIf Origin "${originPattern}" AccessControlAllowOrigin=$0
    ${allowedOrigins.includes('*') ? 'SetEnvIf Origin ".*" AccessControlAllowOrigin=*' : ''}

    Header set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header set Access-Control-Allow-Methods "${allowedMethods.join(', ')}"
    Header set Access-Control-Allow-Headers "${allowedHeaders.join(', ')}"
    ${allowCredentials ? 'Header set Access-Control-Allow-Credentials "true"' : ''}
    ${exposedApache}
    
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=204,L]
    ${maxAgeApache}
</IfModule>`;

      case 's3':
        return JSON.stringify([
          {
            "AllowedHeaders": allowedHeaders.includes('*') ? ["*"] : allowedHeaders,
            "AllowedMethods": allowedMethods,
            "AllowedOrigins": allowedOrigins.includes('*') ? ["*"] : allowedOrigins,
            "ExposeHeaders": exposedHeaders || [],
            "MaxAgeSeconds": maxAge || 3000
          }
        ], null, 2);

      case 'vercel':
        return JSON.stringify({
          "headers": [
            {
              "source": "/api/(.*)",
              "headers": [
                { "key": "Access-Control-Allow-Credentials", "value": allowCredentials ? "true" : "false" },
                { "key": "Access-Control-Allow-Origin", "value": allowedOrigins.includes('*') ? "*" : allowedOrigins.join(', ') },
                { "key": "Access-Control-Allow-Methods", "value": allowedMethods.join(', ') },
                { "key": "Access-Control-Allow-Headers", "value": allowedHeaders.join(', ') },
                ...(exposedHeaders && exposedHeaders.length > 0 ? [{ "key": "Access-Control-Expose-Headers", "value": exposedHeaders.join(', ') }] : []),
                ...(maxAge ? [{ "key": "Access-Control-Max-Age", "value": maxAge.toString() }] : [])
              ]
            }
          ]
        }, null, 2);

      case 'nextjs':
        return `module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "${allowCredentials}" },
          { key: "Access-Control-Allow-Origin", value: "${allowedOrigins.includes('*') ? "*" : allowedOrigins.join(', ')}" },
          { key: "Access-Control-Allow-Methods", value: "${allowedMethods.join(', ')}" },
          { key: "Access-Control-Allow-Headers", value: "${allowedHeaders.join(', ')}" },
          ${exposedHeaders && exposedHeaders.length > 0 ? `{ key: "Access-Control-Expose-Headers", value: "${exposedHeaders.join(', ')}" },` : ''}
          ${maxAge ? `{ key: "Access-Control-Max-Age", value: "${maxAge}" },` : ''}
        ]
      }
    ]
  }
}`;

      default:
        return '// Select a language';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode(activeTab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 bg-[#050505] border border-[#222] rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 border-b border-[#222] bg-[#0a0a0a] gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-white">Implementación en Servidor</h3>
        </div>
        <div className="flex flex-wrap gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveTab(lang.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === lang.id 
                  ? 'bg-[#222] text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#111]'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#333] text-xs font-medium"
            title="Copiar código"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="text-green-500">Copiado</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        
        <pre className="p-6 pt-12 md:pt-6 overflow-x-auto custom-scrollbar bg-[#050505] text-sm font-mono leading-relaxed">
          <code className="language-javascript text-gray-300">
            {generateCode(activeTab)}
          </code>
        </pre>
      </div>
      
      <div className="px-4 py-2 bg-[#111] border-t border-[#222] text-[10px] text-gray-500 flex items-center gap-2">
        <Terminal size={12} />
        <span>Copia y pega este código en tu configuración de backend para replicar la política CORS actual.</span>
      </div>
    </div>
  );
};

export default CodeGenerator;
