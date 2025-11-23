import React, { useState, useRef, useEffect } from 'react';
import { Play, RefreshCw, Settings, Server, Globe, ChevronDown, ShieldCheck, AlertTriangle, Lock, Share2, Info, Terminal, Trophy, BookOpen } from 'lucide-react';
import { useCorsSimulation } from '../hooks/useCorsSimulation';
import ResponseViewer from './ResponseViewer';
import RequestVisualizer from './RequestVisualizer';
import CodeGenerator from './CodeGenerator';
import SecurityAudit from './SecurityAudit';
import Challenges from './Challenges';
import Glossary from './Glossary';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_GROUPS = [
  {
    label: "Básico",
    items: [
      {
        name: "Acceso Público (GET)",
        desc: "API abierta a todo el mundo (*)",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: '', credentials: false },
        server: { allowedOrigins: ['*'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false, exposedHeaders: [], maxAge: 0 }
      },
      {
        name: "Bloqueo de Origen",
        desc: "El servidor no confía en este dominio",
        client: { origin: 'https://sitio-malicioso.com', method: 'GET', headers: '', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false, exposedHeaders: [], maxAge: 0 }
      }
    ]
  },
  {
    label: "Preflight & Headers",
    items: [
      {
        name: "POST con JSON",
        desc: "Dispara Preflight por Content-Type",
        client: { origin: 'https://mi-web.com', method: 'POST', headers: 'Content-Type: application/json', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false, exposedHeaders: [], maxAge: 86400 }
      },
      {
        name: "Auth Token (JWT)",
        desc: "Header Authorization permitido",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: 'Authorization: Bearer 123', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET', 'OPTIONS'], allowedHeaders: ['Authorization'], allowCredentials: false, exposedHeaders: [], maxAge: 0 }
      },
      {
        name: "Header Prohibido",
        desc: "Fallo: Header no listado en el servidor",
        client: { origin: 'https://mi-web.com', method: 'POST', headers: 'X-Secret-Key: 123', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false, exposedHeaders: [], maxAge: 0 }
      }
    ]
  },
  {
    label: "Credenciales",
    items: [
      {
        name: "Cookies Seguras",
        desc: "Requiere origen explícito (no *)",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: '', credentials: true },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true, exposedHeaders: [], maxAge: 0 }
      },
      {
        name: "Configuración Inválida",
        desc: "Credenciales + Wildcard (*) = Error",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: '', credentials: true },
        server: { allowedOrigins: ['*'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true, exposedHeaders: [], maxAge: 0 }
      }
    ]
  }
];

const SimulationPanel = () => {
	const [clientConfig, setClientConfig] = useState(PRESET_GROUPS[0].items[0].client);
	const [serverConfig, setServerConfig] = useState(PRESET_GROUPS[0].items[0].server);
	const [showPresets, setShowPresets] = useState(false);
	const [isSimulating, setIsSimulating] = useState(false);
	const [showShareTooltip, setShowShareTooltip] = useState(false);
	const [showCurlTooltip, setShowCurlTooltip] = useState(false);
	const [showGlossary, setShowGlossary] = useState(false);
	const [mode, setMode] = useState('simulation'); // 'simulation' | 'challenges'
	const dropdownRef = useRef(null);

	const { result, simulateRequest } = useCorsSimulation(clientConfig, serverConfig);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowPresets(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Load config from URL params on mount
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const config = params.get('config');
		if (config) {
			try {
				const decoded = JSON.parse(atob(config));
				if (decoded.client && decoded.server) {
					setClientConfig(decoded.client);
					setServerConfig(decoded.server);
				}
			} catch (e) {
				console.error("Error parsing config from URL", e);
			}
		}
	}, []);

	const handleShare = () => {
		const config = btoa(JSON.stringify({ client: clientConfig, server: serverConfig }));
		const url = `${window.location.origin}${window.location.pathname}?config=${config}`;
		navigator.clipboard.writeText(url);
		setShowShareTooltip(true);
		setTimeout(() => setShowShareTooltip(false), 2000);
	};

	const generateCurl = () => {
		const { origin, method, headers } = clientConfig;
		let cmd = `curl -v -X ${method} "https://api.ejemplo.com/v1"`;
		cmd += ` \\\n  -H "Origin: ${origin}"`;
		
		if (headers) {
			headers.split('\n').forEach(h => {
				if (h.trim()) cmd += ` \\\n  -H "${h.trim()}"`;
			});
		}
		return cmd;
	};

	const handleCopyCurl = () => {
		const curl = generateCurl();
		navigator.clipboard.writeText(curl);
		setShowCurlTooltip(true);
		setTimeout(() => setShowCurlTooltip(false), 2000);
	};

	const handleSimulate = () => {
		setIsSimulating(false);
		setTimeout(() => {
			simulateRequest();
			setIsSimulating(true);
		}, 100);
	};

	const loadPreset = (preset) => {
		setClientConfig(preset.client);
		setServerConfig(preset.server);
		setShowPresets(false);
		setIsSimulating(false);
	};

	const handleServerOriginChange = (e) => {
		const val = e.target.value;
		setServerConfig((prev) => ({
			...prev,
			allowedOrigins: val.split(',').map((s) => s.trim()),
		}));
	};

	const handleServerMethodsChange = (e) => {
		const val = e.target.value;
		setServerConfig((prev) => ({
			...prev,
			allowedMethods: val.split(',').map((s) => s.trim()),
		}));
	};

	const handleServerHeadersChange = (e) => {
		const val = e.target.value;
		setServerConfig((prev) => ({
			...prev,
			allowedHeaders: val.split(',').map((s) => s.trim()),
		}));
	};

	const handleServerExposedHeadersChange = (e) => {
		const val = e.target.value;
		setServerConfig((prev) => ({
			...prev,
			exposedHeaders: val.split(',').map((s) => s.trim()).filter(s => s.length > 0),
		}));
	};

	if (mode === 'challenges') {
		return <Challenges onExit={() => setMode('simulation')} />;
	}

	return (
		<section id="simulation" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
			<div className="mb-12 text-center relative">
				<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
					Simulación <span className="text-blue-500">Interactiva</span>
				</h2>
				<p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
					Diseña escenarios de comunicación entre cliente y servidor.
				</p>

				<div className="relative inline-block text-left" ref={dropdownRef}>
					<div className="flex gap-3 justify-center">
						<button
							onClick={() => setShowPresets(!showPresets)}
							className="group flex items-center gap-2 px-5 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-full text-sm font-medium text-gray-300 transition-all duration-200 shadow-sm"
						>
							<Settings size={16} className="text-gray-500 group-hover:text-white transition-colors" />
							<span>Cargar Escenario</span>
							<ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${showPresets ? 'rotate-180' : ''}`} />
						</button>

						<div className="relative">
							<button
								onClick={handleShare}
								className="group flex items-center gap-2 px-5 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-full text-sm font-medium text-gray-300 transition-all duration-200 shadow-sm"
								title="Compartir configuración actual"
							>
								<Share2 size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
								<span>Compartir</span>
							</button>
							<AnimatePresence>
								{showShareTooltip && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-md whitespace-nowrap z-50"
									>
										¡Enlace copiado!
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<button
							onClick={() => setMode('challenges')}
							className="group flex items-center gap-2 px-5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-full text-sm font-medium text-yellow-500 transition-all duration-200 shadow-sm"
						>
							<Trophy size={16} />
							<span>Modo Desafío</span>
						</button>

						<button
							onClick={() => setShowGlossary(true)}
							className="group flex items-center gap-2 px-3 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-full text-sm font-medium text-gray-300 transition-all duration-200 shadow-sm"
							title="Glosario de términos"
						>
							<BookOpen size={16} className="text-gray-500 group-hover:text-white transition-colors" />
						</button>
					</div>

					<AnimatePresence>
						{showPresets && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								transition={{ duration: 0.15 }}
								className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl bg-[#0a0a0a] ring-1 ring-white/10 border border-[#333] z-50 overflow-hidden backdrop-blur-xl"
							>
								<div className="max-h-[400px] overflow-y-auto custom-scrollbar py-2">
									{PRESET_GROUPS.map((group, groupIdx) => (
										<div key={groupIdx} className="mb-2 last:mb-0">
											<div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#111]/50 border-y border-[#222] first:border-t-0">
												{group.label}
											</div>
											{group.items.map((preset, idx) => (
												<button
													key={idx}
													onClick={() => loadPreset(preset)}
													className="w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a] last:border-0 group"
												>
													<div className="flex items-center justify-between mb-1">
														<span className="text-sm font-medium text-gray-200 group-hover:text-white">{preset.name}</span>
														{preset.name.includes('Bloqueo') || preset.name.includes('Fallo') || preset.name.includes('Inválida') ? (
															<AlertTriangle size={12} className="text-red-500" />
														) : (
															<ShieldCheck size={12} className="text-green-500" />
														)}
													</div>
													<p className="text-xs text-gray-500 group-hover:text-gray-400 line-clamp-1">{preset.desc}</p>
												</button>
											))}
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Client Side */}
				<div className="bg-[#050505] border border-[#222] rounded-xl p-6 relative overflow-hidden shadow-sm hover:border-[#333] transition-colors">
					<div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
						<div className="p-2 bg-blue-500/10 rounded-lg">
							<Globe size={20} className="text-blue-500" />
						</div>
						<div>
							<h3 className="text-base font-semibold text-white">Cliente</h3>
							<p className="text-xs text-gray-500">Configuración del Navegador</p>
						</div>
					</div>

					<div className="space-y-5">
						<div>
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
								Origen (Origin)
								<div className="group relative cursor-help">
									<Info size={12} className="text-gray-600 hover:text-gray-400" />
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#222] border border-[#333] rounded text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 normal-case font-normal leading-relaxed">
										El dominio desde donde sale la petición (ej: tu frontend en React).
									</div>
								</div>
							</label>
							<input
								type="text"
								value={clientConfig.origin}
								onChange={(e) =>
									setClientConfig({ ...clientConfig, origin: e.target.value })
								}
								className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-700"
								placeholder="https://..."
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div className="col-span-1">
								<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
									Método
								</label>
								<div className="relative">
									<select
										value={clientConfig.method}
										onChange={(e) =>
											setClientConfig({ ...clientConfig, method: e.target.value })
										}
										className="w-full appearance-none bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
									>
										{['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].map((m) => (
											<option key={m} value={m}>
												{m}
											</option>
										))}
									</select>
									<ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
								</div>
							</div>
							<div className="col-span-2">
								<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
									Destino
								</label>
								<input
									type="text"
									value="https://api.ejemplo.com/v1"
									disabled
									className="w-full bg-[#111]/50 border border-[#222] rounded-lg px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
								/>
							</div>
						</div>

						<div>
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Cabeceras (Headers)
							</label>
							<textarea
								value={clientConfig.headers}
								onChange={(e) =>
									setClientConfig({ ...clientConfig, headers: e.target.value })
								}
								className="w-full h-24 bg-[#111] border border-[#333] rounded-lg px-3 py-2 font-mono text-xs text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder-gray-700"
								placeholder="Authorization: Bearer..."
							/>
						</div>

						<div className="flex items-center justify-between pt-2 px-1">
							<label className="text-xs font-medium text-gray-400 flex items-center gap-2 cursor-pointer" onClick={() => setClientConfig(p => ({...p, credentials: !p.credentials}))}>
								<Lock size={14} />
								Incluir Credenciales
							</label>
							<button
								role="switch"
								aria-checked={clientConfig.credentials}
								onClick={() =>
									setClientConfig((prev) => ({
										...prev,
										credentials: !prev.credentials,
									}))
								}
								className={`w-10 h-5 rounded-full transition-colors relative ${
									clientConfig.credentials ? 'bg-blue-600' : 'bg-[#333]'
								}`}
							>
								<div
									className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${
										clientConfig.credentials ? 'left-6' : 'left-1'
									}`}
								></div>
							</button>
						</div>
					</div>
				</div>

				{/* Server Side */}
				<div className="bg-[#050505] border border-[#222] rounded-xl p-6 relative overflow-hidden shadow-sm hover:border-[#333] transition-colors">
					<div className="flex items-center justify-end gap-3 mb-6 pb-4 border-b border-[#222]">
						<div className="text-right">
							<h3 className="text-base font-semibold text-white">Servidor</h3>
							<p className="text-xs text-gray-500">Política CORS (Backend)</p>
						</div>
						<div className="p-2 bg-gray-800/50 rounded-lg">
							<Server size={20} className="text-gray-400" />
						</div>
					</div>

					<div className="space-y-5 text-right">
						<div>
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
								<div className="group relative cursor-help text-left">
									<Info size={12} className="text-gray-600 hover:text-gray-400" />
									<div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#222] border border-[#333] rounded text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 normal-case font-normal leading-relaxed">
										Lista de dominios en los que confía este servidor. Si el origen del cliente no está aquí, el navegador bloqueará la respuesta.
									</div>
								</div>
								Access-Control-Allow-Origin
							</label>
							<input
								type="text"
								value={serverConfig.allowedOrigins.join(', ')}
								onChange={handleServerOriginChange}
								className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 text-right focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all placeholder-gray-700"
							/>
							<p className="text-[10px] text-gray-600 mt-1.5">
								Usa <code className="bg-[#222] px-1 rounded text-gray-400">*</code> para permitir todos
							</p>
						</div>

						<div>
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Access-Control-Allow-Methods
							</label>
							<input
								type="text"
								value={serverConfig.allowedMethods.join(', ')}
								onChange={handleServerMethodsChange}
								className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 text-right focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
							/>
						</div>

						<div>
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Access-Control-Allow-Headers
							</label>
							<input
								type="text"
								value={serverConfig.allowedHeaders.join(', ')}
								onChange={handleServerHeadersChange}
								className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 text-right focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
							/>
						</div>

						<div className="flex items-center justify-end gap-4 pt-2 px-1">
							<label className="text-xs font-medium text-gray-400 cursor-pointer" onClick={() => setServerConfig(p => ({...p, allowCredentials: !p.allowCredentials}))}>
								Access-Control-Allow-Credentials
							</label>
							<button
								role="switch"
								aria-checked={serverConfig.allowCredentials}
								onClick={() =>
									setServerConfig((prev) => ({
										...prev,
										allowCredentials: !prev.allowCredentials,
									}))
								}
								className={`w-10 h-5 rounded-full transition-colors relative ${
									serverConfig.allowCredentials ? 'bg-green-600' : 'bg-[#333]'
								}`}
							>
								<div
									className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${
										serverConfig.allowCredentials ? 'left-6' : 'left-1'
									}`}
								></div>
							</button>
						</div>

						<div className="pt-4 border-t border-[#222] mt-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
										<div className="group relative cursor-help text-left">
											<Info size={12} className="text-gray-600 hover:text-gray-400" />
											<div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#222] border border-[#333] rounded text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 normal-case font-normal leading-relaxed">
												Tiempo en segundos que el navegador puede cachear la respuesta Preflight. Evita hacer peticiones OPTIONS repetidas.
											</div>
										</div>
										Max-Age (Cache)
									</label>
									<input
										type="number"
										value={serverConfig.maxAge || 0}
										onChange={(e) => setServerConfig(p => ({...p, maxAge: parseInt(e.target.value) || 0}))}
										className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 text-right focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
										placeholder="0"
									/>
								</div>
								<div>
									<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
										<div className="group relative cursor-help text-left">
											<Info size={12} className="text-gray-600 hover:text-gray-400" />
											<div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#222] border border-[#333] rounded text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 normal-case font-normal leading-relaxed">
												Cabeceras que el navegador puede leer en la respuesta (ej: Content-Length, Authorization).
											</div>
										</div>
										Expose-Headers
									</label>
									<input
										type="text"
										value={serverConfig.exposedHeaders ? serverConfig.exposedHeaders.join(', ') : ''}
										onChange={handleServerExposedHeadersChange}
										className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-gray-200 text-right focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
										placeholder="Content-Length"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center mb-12 gap-4">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSimulate}
					className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
				>
					<Play size={20} className="fill-black" />
					<span>Ejecutar Simulación</span>
				</motion.button>

				<div className="relative">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleCopyCurl}
						className="group relative inline-flex items-center gap-3 px-6 py-4 bg-[#111] text-gray-300 border border-[#333] rounded-full font-semibold text-lg hover:bg-[#222] hover:text-white transition-all duration-300"
						title="Copiar comando cURL"
					>
						<Terminal size={20} />
						<span>cURL</span>
					</motion.button>
					<AnimatePresence>
						{showCurlTooltip && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md whitespace-nowrap z-50"
							>
								¡Copiado!
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<RequestVisualizer result={result} isSimulating={isSimulating} />

			<ResponseViewer result={result} />
			
			<SecurityAudit serverConfig={serverConfig} />

			<CodeGenerator serverConfig={serverConfig} />

			<Glossary isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
		</section>
	);
};

export default SimulationPanel;
