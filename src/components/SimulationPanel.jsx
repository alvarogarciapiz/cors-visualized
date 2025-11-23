import React, { useState } from 'react';
import { Play, RefreshCw, Settings, Server, Globe, ChevronDown } from 'lucide-react';
import { useCorsSimulation } from '../hooks/useCorsSimulation';
import ResponseViewer from './ResponseViewer';
import { motion } from 'framer-motion';

const PRESETS = [
  {
    name: "Petición Simple (Éxito)",
    client: { origin: 'https://mi-app.com', method: 'GET', headers: '', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false }
  },
  {
    name: "Preflight Requerido (Éxito)",
    client: { origin: 'https://mi-app.com', method: 'POST', headers: 'Content-Type: application/json', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type'], allowCredentials: false }
  },
  {
    name: "JSON con Token (Preflight Correcto)",
    client: { origin: 'https://mi-app.com', method: 'POST', headers: 'Content-Type: application/json\nAuthorization: Bearer token', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'], allowCredentials: false }
  },
  {
    name: "Error Preflight (Falta OPTIONS)",
    client: { origin: 'https://mi-app.com', method: 'POST', headers: 'Content-Type: application/json\nAuthorization: Bearer token', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['POST'], allowedHeaders: ['Content-Type', 'Authorization'], allowCredentials: false }
  },
  {
    name: "Credenciales (Éxito)",
    client: { origin: 'https://mi-app.com', method: 'GET', headers: '', credentials: true },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true }
  },
  {
    name: "Error Credenciales (Wildcard)",
    client: { origin: 'https://mi-app.com', method: 'GET', headers: '', credentials: true },
    server: { allowedOrigins: ['*'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: true }
  },
  {
    name: "Error CORS (Origen Incorrecto)",
    client: { origin: 'https://sitio-malicioso.com', method: 'GET', headers: '', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['GET'], allowedHeaders: [], allowCredentials: false }
  },
  {
    name: "Error CORS (Método no Permitido)",
    client: { origin: 'https://mi-app.com', method: 'DELETE', headers: '', credentials: false },
    server: { allowedOrigins: ['https://mi-app.com'], allowedMethods: ['GET', 'POST'], allowedHeaders: [], allowCredentials: false }
  }
];

const SimulationPanel = () => {
	const [clientConfig, setClientConfig] = useState(PRESETS[0].client);
	const [serverConfig, setServerConfig] = useState(PRESETS[0].server);
	const [showPresets, setShowPresets] = useState(false);

	const { result, simulateRequest } = useCorsSimulation(clientConfig, serverConfig);

	const loadPreset = (preset) => {
		setClientConfig(preset.client);
		setServerConfig(preset.server);
		setShowPresets(false);
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
			<div className="mb-10 text-center relative">
				<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
					Simulación <span className="text-[#5978F5]">Interactiva</span>
				</h2>
				<p className="text-gray-400 max-w-2xl mx-auto mb-8">
					Configura la petición del cliente y la política CORS del servidor para ver cómo interactúan.
					Experimenta con diferentes orígenes y cabeceras para provocar errores.
				</p>

				<div className="relative inline-block text-left">
					<button
						onClick={() => setShowPresets(!showPresets)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-[#101C48] border border-[#2C4399] rounded-lg text-sm font-medium text-white hover:bg-[#2C4399] transition-colors"
					>
						Cargar Preset <ChevronDown size={16} />
					</button>

					{showPresets && (
						<div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-[#101C48] ring-1 ring-black ring-opacity-5 border border-[#2C4399] z-10">
							<div className="py-1">
								{PRESETS.map((preset, idx) => (
									<button
										key={idx}
										onClick={() => loadPreset(preset)}
										className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2C4399] hover:text-white"
									>
										{preset.name}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Client Side */}
				<motion.div
					initial={{ x: -50, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					viewport={{ once: true }}
					className="glass-panel p-6 relative overflow-hidden"
				>
					<div className="absolute top-0 left-0 w-1 h-full bg-[#5978F5]"></div>
					<div className="flex items-center gap-3 mb-6">
						<Globe className="text-[#5978F5]" />
						<h3 className="text-xl font-bold text-white">Petición del Cliente</h3>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Origen (Navegador)
							</label>
							<input
								type="text"
								value={clientConfig.origin}
								onChange={(e) =>
									setClientConfig({ ...clientConfig, origin: e.target.value })
								}
								className="w-full bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#5978F5] text-gray-200"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Método
								</label>
								<select
									value={clientConfig.method}
									onChange={(e) =>
										setClientConfig({ ...clientConfig, method: e.target.value })
									}
									className="w-full bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#5978F5] text-gray-200"
								>
									{['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].map((m) => (
										<option key={m} value={m}>
											{m}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									URL Destino
								</label>
								<input
									type="text"
									value="https://api.ejemplo.com/datos"
									disabled
									className="w-full bg-[#0C0F19]/50 border-[#2C4399] text-gray-500 cursor-not-allowed"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Cabeceras (Headers)
							</label>
							<textarea
								value={clientConfig.headers}
								onChange={(e) =>
									setClientConfig({ ...clientConfig, headers: e.target.value })
								}
								className="w-full h-24 bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#5978F5] font-mono text-sm text-gray-200"
								placeholder="Clave: Valor"
							/>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<label className="text-sm font-medium text-gray-400" id="client-credentials-label">
								Incluir Credenciales (cookies/auth)
							</label>
							<button
								role="switch"
								aria-checked={clientConfig.credentials}
								aria-labelledby="client-credentials-label"
								onClick={() =>
									setClientConfig((prev) => ({
										...prev,
										credentials: !prev.credentials,
									}))
								}
								className={`w-12 h-6 rounded-full transition-colors relative ${
									clientConfig.credentials ? 'bg-[#5978F5]' : 'bg-gray-700'
								}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
										clientConfig.credentials ? 'left-7' : 'left-1'
									}`}
								></div>
							</button>
						</div>
					</div>
				</motion.div>

				{/* Server Side */}
				<motion.div
					initial={{ x: 50, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					viewport={{ once: true }}
					className="glass-panel p-6 relative overflow-hidden"
				>
					<div className="absolute top-0 right-0 w-1 h-full bg-[#8CA2FC]"></div>
					<div className="flex items-center gap-3 mb-6 justify-end">
						<h3 className="text-xl font-bold text-right text-white">
							Configuración del Servidor
						</h3>
						<Server className="text-[#8CA2FC]" />
					</div>

					<div className="space-y-4 text-right">
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Orígenes Permitidos (separados por coma)
							</label>
							<input
								type="text"
								value={serverConfig.allowedOrigins.join(', ')}
								onChange={handleServerOriginChange}
								className="w-full bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#8CA2FC] text-right text-gray-200"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Usa * para wildcard (cualquier origen)
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Métodos Permitidos
							</label>
							<input
								type="text"
								value={serverConfig.allowedMethods.join(', ')}
								onChange={handleServerMethodsChange}
								className="w-full bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#8CA2FC] text-right text-gray-200"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Cabeceras Permitidas
							</label>
							<input
								type="text"
								value={serverConfig.allowedHeaders.join(', ')}
								onChange={handleServerHeadersChange}
								className="w-full bg-[#0C0F19]/50 border-[#2C4399] focus:border-[#8CA2FC] text-right text-gray-200"
							/>
						</div>

						<div className="flex items-center justify-end gap-3 pt-2">
							<label className="text-sm font-medium text-gray-400" id="server-credentials-label">
								Permitir Credenciales
							</label>
							<button
								role="switch"
								aria-checked={serverConfig.allowCredentials}
								aria-labelledby="server-credentials-label"
								onClick={() =>
									setServerConfig((prev) => ({
										...prev,
										allowCredentials: !prev.allowCredentials,
									}))
								}
								className={`w-12 h-6 rounded-full transition-colors relative ${
									serverConfig.allowCredentials ? 'bg-[#5978F5]' : 'bg-gray-700'
								}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
										serverConfig.allowCredentials ? 'left-7' : 'left-1'
									}`}
								></div>
							</button>
						</div>
					</div>
				</motion.div>
			</div>

			<div className="flex justify-center mt-8">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={simulateRequest}
					className="flex items-center gap-2 px-8 py-4 bg-[#5978F5] hover:bg-[#6582F6] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#2C4399]/40 transition-all"
				>
					<Play size={20} fill="currentColor" />
					Enviar Petición
				</motion.button>
			</div>

			<ResponseViewer result={result} />
		</section>
	);
};

export default SimulationPanel;
