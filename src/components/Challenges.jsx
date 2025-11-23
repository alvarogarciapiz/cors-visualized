import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, CheckCircle, XCircle, RefreshCw, HelpCircle, BookOpen, Award, Download, RotateCcw } from 'lucide-react';
import { useCorsSimulation } from '../hooks/useCorsSimulation';

const CHALLENGES = [
  {
    id: 1,
    title: "El Bloqueo Básico",
    difficulty: "Fácil",
    description: "El cliente intenta acceder desde 'https://mi-app.com' pero el servidor solo permite 'https://sitio-oficial.com'. ¡Arréglalo!",
    client: { origin: 'https://mi-app.com', method: 'GET', headers: '', credentials: false },
    initialServer: { allowedOrigins: ['https://sitio-oficial.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false, exposedHeaders: [], maxAge: 0 },
    hint: "Revisa la lista de orígenes permitidos (Access-Control-Allow-Origin)."
  },
  {
    id: 2,
    title: "Método Desconocido",
    difficulty: "Medio",
    description: "Tu frontend está enviando una petición DELETE para borrar un recurso, pero el servidor la rechaza en el Preflight.",
    client: { origin: 'https://admin.panel.com', method: 'DELETE', headers: 'Authorization: Bearer 123', credentials: false },
    initialServer: { allowedOrigins: ['https://admin.panel.com'], allowedMethods: ['GET', 'POST'], allowedHeaders: ['Authorization'], allowCredentials: false, exposedHeaders: [], maxAge: 0 },
    hint: "Asegúrate de que DELETE esté en Access-Control-Allow-Methods."
  },
  {
    id: 3,
    title: "Credenciales Cruzadas",
    difficulty: "Difícil",
    description: "Necesitamos enviar cookies de sesión (credenciales), pero el navegador bloquea la respuesta por seguridad.",
    client: { origin: 'https://tienda.com', method: 'POST', headers: 'Content-Type: application/json', credentials: true },
    initialServer: { allowedOrigins: ['*'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: true, exposedHeaders: [], maxAge: 0 },
    hint: "No puedes usar wildcard (*) cuando allowCredentials es true. Debes ser específico."
  },
  {
    id: 4,
    title: "Cabecera Personalizada",
    difficulty: "Difícil",
    description: "El cliente envía una cabecera 'X-Api-Key' para autenticarse, pero el servidor la rechaza en el Preflight.",
    client: { origin: 'https://dashboard.com', method: 'GET', headers: 'X-Api-Key: secret123', credentials: false },
    initialServer: { allowedOrigins: ['https://dashboard.com'], allowedMethods: ['GET', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false, exposedHeaders: [], maxAge: 0 },
    hint: "Añade 'X-Api-Key' a la lista de Access-Control-Allow-Headers."
  },
  {
    id: 5,
    title: "Exponer Información",
    difficulty: "Experto",
    description: "El cliente necesita leer la cabecera 'X-Total-Count' de la respuesta para la paginación, pero el navegador la oculta.",
    client: { origin: 'https://lista.com', method: 'GET', headers: '', credentials: false },
    initialServer: { allowedOrigins: ['https://lista.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false, exposedHeaders: [], maxAge: 0 },
    hint: "Usa Access-Control-Expose-Headers para hacer visible 'X-Total-Count'."
  }
];

const Results = ({ attempts, onRestart, onExit }) => {
  const score = Math.max(0, 1000 - (attempts * 50));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <div className="bg-[#111] border border-[#333] rounded-xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
              <Trophy size={64} className="text-yellow-500" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">¡Desafío Completado!</h2>
          <p className="text-gray-400 mb-8">Has demostrado un gran dominio de las políticas CORS.</p>

          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto mb-10">
            <div className="bg-[#050505] p-4 rounded-lg border border-[#222]">
              <div className="text-3xl font-bold text-blue-500">{score}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Puntuación</div>
            </div>
            <div className="bg-[#050505] p-4 rounded-lg border border-[#222]">
              <div className="text-3xl font-bold text-purple-500">{attempts}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Intentos</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={18} /> Volver a Jugar
            </button>
            <button 
              onClick={onExit}
              className="flex items-center gap-2 px-6 py-3 bg-[#222] text-gray-300 font-medium rounded-full hover:bg-[#333] hover:text-white transition-colors border border-[#333]"
            >
              Volver al Simulador
            </button>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute right-0 top-0 transform translate-x-1/3 -translate-y-1/3">
                <RefreshCw size={300} />
            </div>
            <div className="absolute left-0 bottom-0 transform -translate-x-1/3 translate-y-1/3">
                <Trophy size={300} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const Challenges = ({ onExit }) => {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [serverConfig, setServerConfig] = useState(CHALLENGES[0].initialServer);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const challenge = CHALLENGES[activeChallengeIdx];
  const { result, simulateRequest } = useCorsSimulation(challenge.client, serverConfig);

  const handleCheck = () => {
    simulateRequest();
    setAttempts(p => p + 1);
    setTotalAttempts(p => p + 1);
  };

  // Watch for success
  React.useEffect(() => {
    if (result && result.status === 200 && attempts > 0) {
      // Special check for Level 5 (Exposed Headers)
      if (challenge.id === 5) {
        if (serverConfig.exposedHeaders.includes('X-Total-Count')) {
           setShowSuccess(true);
        } else {
           setShowSuccess(false);
        }
      } else {
        setShowSuccess(true);
      }
    }
  }, [result, attempts, challenge.id, serverConfig.exposedHeaders]);

  const nextChallenge = () => {
    if (activeChallengeIdx < CHALLENGES.length - 1) {
      const nextIdx = activeChallengeIdx + 1;
      setActiveChallengeIdx(nextIdx);
      setServerConfig(CHALLENGES[nextIdx].initialServer);
      setShowSuccess(false);
      setAttempts(0);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setActiveChallengeIdx(0);
    setServerConfig(CHALLENGES[0].initialServer);
    setShowSuccess(false);
    setAttempts(0);
    setTotalAttempts(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return <Results attempts={totalAttempts} onRestart={handleRestart} onExit={onExit} />;
  }

  const handleServerOriginChange = (e) => {
    setServerConfig(prev => ({ ...prev, allowedOrigins: e.target.value.split(',').map(s => s.trim()) }));
  };
  
  const handleServerMethodsChange = (e) => {
    setServerConfig(prev => ({ ...prev, allowedMethods: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleServerHeadersChange = (e) => {
    setServerConfig(prev => ({ ...prev, allowedHeaders: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleServerExposedHeadersChange = (e) => {
    setServerConfig(prev => ({ ...prev, exposedHeaders: e.target.value.split(',').map(s => s.trim()) }));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <button onClick={onExit} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors self-start md:self-auto">
          <ArrowRight className="rotate-180" size={20} /> Volver al Simulador
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
          <Trophy size={16} />
          <span className="text-sm font-bold">Modo Desafío: Nivel {activeChallengeIdx + 1}/{CHALLENGES.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Challenge Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-[#333] rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                challenge.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-400' :
                challenge.difficulty === 'Medio' ? 'bg-yellow-500/20 text-yellow-400' :
                challenge.difficulty === 'Difícil' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {challenge.description}
            </p>
            
            <div className="bg-[#050505] rounded-lg p-4 border border-[#222] space-y-3 overflow-hidden">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cliente (Bloqueado)</div>
              <div className="text-sm text-gray-300 font-mono space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-blue-400 shrink-0">Origin:</span>
                  <span className="break-all text-right">{challenge.client.origin}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-purple-400 shrink-0">Method:</span>
                  <span className="text-right">{challenge.client.method}</span>
                </div>
                {challenge.client.headers && (
                   <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                   <span className="text-orange-400 shrink-0">Headers:</span>
                   <span className="text-right break-all text-xs">{challenge.client.headers}</span>
                 </div>
                )}
                {challenge.client.credentials && (
                   <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                   <span className="text-yellow-400 shrink-0">Creds:</span>
                   <span className="text-right">true</span>
                 </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
            <HelpCircle className="text-blue-400 shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-blue-400 mb-1">Pista</h4>
              <p className="text-xs text-blue-300/80 leading-relaxed">{challenge.hint}</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Config */}
        <div className="lg:col-span-2">
          <div className="bg-[#050505] border border-[#222] rounded-xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <RefreshCw size={100} />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
              <RefreshCw size={20} className="text-green-500" />
              Configura el Servidor
            </h3>

            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Allowed Origins</label>
                <input
                  type="text"
                  value={serverConfig.allowedOrigins.join(', ')}
                  onChange={handleServerOriginChange}
                  className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-sm text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder-gray-700"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Allowed Methods</label>
                    <input
                    type="text"
                    value={serverConfig.allowedMethods.join(', ')}
                    onChange={handleServerMethodsChange}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-sm text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    placeholder="GET, POST..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Allowed Headers</label>
                    <input
                    type="text"
                    value={serverConfig.allowedHeaders.join(', ')}
                    onChange={handleServerHeadersChange}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-sm text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    placeholder="Content-Type..."
                    />
                </div>
              </div>

              {challenge.id === 5 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Exposed Headers</label>
                    <input
                      type="text"
                      value={serverConfig.exposedHeaders.join(', ')}
                      onChange={handleServerExposedHeadersChange}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-sm text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                      placeholder="X-Total-Count..."
                    />
                  </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setServerConfig(p => ({...p, allowCredentials: !p.allowCredentials}))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    serverConfig.allowCredentials 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-[#111] text-gray-500 border border-[#333] hover:border-gray-500'
                  }`}
                >
                  {serverConfig.allowCredentials ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-600" />}
                  Allow Credentials
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCheck}
                className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10"
              >
                Probar Configuración
              </button>
            </div>
          </div>

          {/* Result Area */}
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-500 text-black p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between shadow-xl shadow-green-500/20 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black/10 rounded-full">
                    <Trophy size={32} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">¡Correcto!</h3>
                    <p className="text-black/70 text-sm">Has solucionado el problema de CORS.</p>
                  </div>
                </div>
                <button
                  onClick={nextChallenge}
                  className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {activeChallengeIdx < CHALLENGES.length - 1 ? 'Siguiente Nivel' : 'Finalizar'} <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : result && attempts > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={attempts} // Re-animate on new attempt
                className="mt-6 bg-red-500/10 border border-red-500/20 p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <XCircle className="text-red-500 shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-1">Sigue intentando</h3>
                    <p className="text-red-300/80 text-sm mb-3">{result.error || (challenge.id === 5 ? "La petición pasó, pero la cabecera no está expuesta." : "La configuración aún no es correcta.")}</p>
                    <div className="text-xs font-mono bg-black/30 p-3 rounded text-gray-400 break-all">
                      {result.logs.find(l => l.type === 'error')?.message || "Revisa los requisitos del desafío."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
