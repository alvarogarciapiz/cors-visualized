import React, { useState, useRef, useEffect } from 'react';
import { Play, RefreshCw, Settings, Server, Globe, ChevronDown, ShieldCheck, AlertTriangle, Lock } from 'lucide-react';
import { useCorsSimulation } from '../hooks/useCorsSimulation';
import ResponseViewer from './ResponseViewer';
import RequestVisualizer from './RequestVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_GROUPS = [
  {
    label: "Básico",
    items: [
      {
        name: "Acceso Público (GET)",
        desc: "API abierta a todo el mundo (*)",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: '', credentials: false },
        server: { allowedOrigins: ['*'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false }
      },
      {
        name: "Bloqueo de Origen",
        desc: "El servidor no confía en este dominio",
        client: { origin: 'https://sitio-malicioso.com', method: 'GET', headers: '', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false }
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
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false }
      },
      {
        name: "Auth Token (JWT)",
        desc: "Header Authorization permitido",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: 'Authorization: Bearer 123', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET', 'OPTIONS'], allowedHeaders: ['Authorization'], allowCredentials: false }
      },
      {
        name: "Header Prohibido",
        desc: "Fallo: Header no listado en el servidor",
        client: { origin: 'https://mi-web.com', method: 'POST', headers: 'X-Secret-Key: 123', credentials: false },
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false }
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
        server: { allowedOrigins: ['https://mi-web.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true }
      },
      {
        name: "Configuración Inválida",
        desc: "Credenciales + Wildcard (*) = Error",
        client: { origin: 'https://mi-web.com', method: 'GET', headers: '', credentials: true },
        server: { allowedOrigins: ['*'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true }
      }
    ]
  }
];

const SimulationPanel = () => {
	const [clientConfig, setClientConfig] = useState(PRESET_GROUPS[0].items[0].client);
	const [serverConfig, setServerConfig] = useState(PRESET_GROUPS[0].items[0].server);
	const [showPresets, setShowPresets] = useState(false);
	const [isSimulating, setIsSimulating] = useState(false);
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
					<button
						onClick={() => setShowPresets(!showPresets)}
						className="group flex items-center gap-2 px-5 py-2.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-full text-sm font-medium text-gray-300 transition-all duration-200 shadow-sm"
					>
						<Settings size={16} className="text-gray-500 group-hover:text-white transition-colors" />
						<span>Cargar Escenario</span>
						<ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${showPresets ? 'rotate-180' : ''}`} />
					</button>

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
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Origen (Origin)
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
							<label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
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
					</div>
				</div>
			</div>

			<div className="flex justify-center mb-12">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleSimulate}
					className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
				>
					<Play size={20} className="fill-black" />
					<span>Ejecutar Simulación</span>
				</motion.button>
			</div>

			<RequestVisualizer result={result} isSimulating={isSimulating} />

			<ResponseViewer result={result} />
		</section>
	);
};

export default SimulationPanel;
