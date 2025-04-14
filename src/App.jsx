import React, { useState } from 'react';

export default function PromptBuilder() {
  const [goals, setGoals] = useState([]);
  const [otherGoal, setOtherGoal] = useState('');
  const [roles, setRoles] = useState([]);
  const [customRole, setCustomRole] = useState('');
  const [context, setContext] = useState('');
  const [style, setStyle] = useState('');
  const [promptPreview, setPromptPreview] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [wiggle, setWiggle] = useState(false); // Animación

  const goalOptions = ['Texto', 'Imagen', 'Otro'];

  const roleOptionsByGoal = {
    Texto: ['Profesor', 'Periodista', 'Copywriter', 'Editor de contenidos', 'Asistente legal', 'Otro'],
    Imagen: ['Diseñador gráfico', 'Ilustrador', 'Artista digital', 'Director creativo', 'Otro'],
    Otro: ['Profesor', 'Médico', 'Agente inmobiliario', 'Psicólogo', 'Coach de vida', 'Experto en marketing', 'Otro']
  };

  const handleGoalChange = (option) => {
    setGoals((prev) =>
      prev.includes(option) ? prev.filter((g) => g !== option) : [...prev, option]
    );
  };

  const handleRoleChange = (option) => {
    setRoles((prev) =>
      prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
    );
  };

  const handleGeneratePrompt = async () => {
    const allGoals = goals.includes('Otro') && otherGoal
      ? [...goals.filter((g) => g !== 'Otro'), otherGoal].join(', ')
      : goals.join(', ');
    const selectedRoles = roles.includes('Otro') && customRole
      ? [...roles.filter((r) => r !== 'Otro'), customRole].join(', ')
      : roles.join(', ');
    const prompt = `Actúa como ${selectedRoles}. Necesito que me ayudes a generar: ${allGoals}. Contexto: ${context}. El estilo debe ser: ${style}.`;
    setPromptPreview(prompt);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Actua con PROFESIONAL INGENIERO DE PROMPS y Mejora este prompt para que sea más claro y efectivo (el rol el contexto el tono y demas te van a pasar mas adelante). Despues muestra una breve explicacion de como empezar con este promp propuesto y avanzar iterando:\n\n${prompt}` }]
          }]
        })
      });

      const data = await response.json();
      console.log('🔍 Respuesta completa:', data);

      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result) {
        console.error('⚠️ La IA no devolvió texto:', data);
        setFinalPrompt('❌ No se pudo generar un prompt mejorado.');
      } else {
        setFinalPrompt(result);
      }

    } catch (error) {
      console.error(error);
      setFinalPrompt('❌ Error al conectar con la API de Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGoals([]);
    setOtherGoal('');
    setRoles([]);
    setCustomRole('');
    setContext('');
    setStyle('');
    setPromptPreview('');
    setFinalPrompt('');
    setWiggle(true);
  };

  const getStyleOptions = () => {
    if (goals.includes('Imagen')) {
      return ['Realista', 'Anime', 'Retro', 'Futurista', 'Estilo ochentero'];
    }
    if (goals.includes('Texto')) {
      return ['Formal', 'Creativo', 'Técnico', 'Divertido'];
    }
    return ['Libre'];
  };

  const getRelevantRoles = () => {
    const selectedGoal = goals.find(g => g !== 'Otro') || 'Otro';
    return roleOptionsByGoal[selectedGoal] || roleOptionsByGoal['Otro'];
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/44/Space_invaders.png')] bg-repeat animate-[scrollBg_30s_linear_infinite]" style={{ backgroundSize: '200px' }}></div>
      <style>{`@keyframes scrollBg { 0% { background-position: 0 0; } 100% { background-position: 1000px 1000px; } }`}</style>
      <div className="relative z-10 font-['Press_Start_2P',_monospace]">
        <div className="min-h-screen p-4 bg-black text-green-400 font-mono">
          <div className="mb-6 p-4 bg-gray-800 border border-yellow-400 rounded-xl text-sm text-yellow-200">
            <h2 className="text-lg mb-2 text-yellow-300" style={{ textShadow: "0 0 4px #ff0" }}>💡 Consejos para escribir el prompt perfecto:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>🎯 Conoce a tu público y tu objetivo antes de escribir.</li>
              <li>✍️ Escribe las instrucciones de forma clara y concisa.</li>
              <li>🧠 Usa frases breves, evita textos largos y confusos.</li>
              <li>🔍 Sé específico e incluye detalles precisos.</li>
            </ul>
          </div>

          <label className="block mb-2">¿Qué quieres generar?</label>
          <div className="mb-4">
            {goalOptions.map((option, idx) => (
              <label key={idx} className="block">
                <input type="checkbox" checked={goals.includes(option)} onChange={() => handleGoalChange(option)} className="mr-2" />
                {option}
              </label>
            ))}
            {goals.includes('Otro') && (
              <input type="text" placeholder="Describe otro objetivo" className="w-full mt-2 p-2 bg-gray-900 border border-green-500"
                value={otherGoal} onChange={(e) => setOtherGoal(e.target.value)} />
            )}
          </div>

          <label className="block mb-2">¿Qué rol(es) debe asumir la IA?</label>
          <div className="mb-4">
            {getRelevantRoles().map((option, idx) => (
              <label key={idx} className="block">
                <input type="checkbox" checked={roles.includes(option)} onChange={() => handleRoleChange(option)} className="mr-2" />
                {option}
              </label>
            ))}
            {roles.includes('Otro') && (
              <input type="text" placeholder="Define tu propio rol"
                className="w-full mt-2 p-2 bg-gray-900 border border-pink-500"
                value={customRole} onChange={(e) => setCustomRole(e.target.value)} />
            )}
          </div>

          <label className="block mb-2">Contexto detallado</label>
          <textarea
            placeholder="Ej: Estoy preparando una presentación para mi curso de historia y necesito un resumen claro sobre la Revolución Francesa."
            rows="4"
            className="w-full mb-4 p-2 bg-gray-900 border border-blue-500 placeholder-gray-500"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>

          <label className="block mb-2">Estilo o tono deseado</label>
          <select className="w-full mb-4 p-2 bg-gray-900 border border-yellow-500" value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="">Selecciona un estilo</option>
            {getStyleOptions().map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleGeneratePrompt}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:scale-105 text-white font-bold py-2 px-4 rounded-full mb-4 shadow-lg shadow-pink-500/50 transition-transform duration-300"
          >
            🎯 Generar Prompt Perfecto
          </button>

          <button
            onClick={handleReset}
            onAnimationEnd={() => setWiggle(false)}
            className={`bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full shadow-lg shadow-red-500/50 transition-all duration-300 ${
              wiggle ? 'animate-wiggle' : ''
            }`}
          >
            🧹 Borrar Todo
          </button>

          {loading && <p className="text-pink-400 mt-4">⏳ Consultando a la IA ...</p>}

          {promptPreview && (
            <div className="mt-6 bg-gray-800 p-4 border border-green-400">
              <h2 className="text-xl mb-2 text-cyan-300" style={{ textShadow: "0 0 5px #0ff" }}>🔍 Vista previa del prompt:</h2>
              <p>{promptPreview}</p>
            </div>
          )}

          {finalPrompt && (
            <div className="mt-6 bg-gray-900 p-4 border border-purple-400">
              <h2 className="text-xl mb-2 text-purple-300" style={{ textShadow: "0 0 5px #f0f" }}>✨ Prompt optimizado por Trina:</h2>
              <pre className="whitespace-pre-wrap text-white">{finalPrompt}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
