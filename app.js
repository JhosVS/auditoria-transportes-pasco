// Base de datos inicial cargada con los hallazgos del Sistema de Transportes Pasco
let evidencias = [
    {
        id: "H01",
        evidencia: "Los usuarios autenticados pueden utilizar las mismas funciones administrativas, sin distinción efectiva por rol.",
        categoria: "A01 — Control de acceso deficiente",
        cercana: "A07 — Fallas de identificación y autenticación",
        impacto: "Acceso y modificación de datos sin autorización según el rol.",
        justificacion: "Se identificó que los privilegios no están diferenciados por middleware o anotaciones en las rutas de Flask.",
        estado: "Identificado",
        aprobado: false,
        observacionDocente: ""
    },
    {
        id: "H02",
        evidencia: "config.py contiene una clave secreta predeterminada (SECRET_KEY).",
        categoria: "A02 — Fallas criptográficas",
        cercana: "A05 — Configuración de seguridad incorrecta",
        impacto: "Riesgo de falsificación o alteración de cookies de sesión firmadas si la clave secreta es expuesta.",
        justificacion: "Uso de credenciales/claves por defecto en archivos de configuración desplegados.",
        estado: "Por verificar",
        aprobado: false,
        observacionDocente: ""
    },
    {
        id: "H03",
        evidencia: "No se ha implementado un registro general de acciones administrativas.",
        categoria: "A09 — Fallas en el registro y monitoreo de seguridad",
        cercana: "A01 — Control de acceso deficiente",
        impacto: "Dificultad para investigar incidentes, detectar accesos anómalos y realizar trazabilidad forense.",
        justificacion: "Ausencia de logs de auditoría estructurados ante cambios críticos en la base de datos de transportes.",
        estado: "Identificado",
        aprobado: false,
        observacionDocente: ""
    },
    {
        id: "H04",
        evidencia: "No se ha identificado protección CSRF en los formularios POST revisados.",
        categoria: "A01 — Control de acceso deficiente",
        cercana: "A05 — Configuración de seguridad incorrecta",
        impacto: "Posibilidad de ejecutar acciones administrativas no deseadas mediante peticiones forjadas desde otros sitios.",
        justificacion: "Falta de tokens anti-CSRF (como Flask-WTF) en los formularios de gestión.",
        estado: "Por verificar",
        aprobado: false,
        observacionDocente: ""
    },
    {
        id: "H07",
        evidencia: "Una prueba de reservas simultáneas impidió reservar un asiento ya ocupado.",
        categoria: "A04 — Diseño inseguro",
        cercana: "Sin riesgo",
        impacto: "Resultado favorable. Previene sobreventa o concurrencia inconsistente de asientos.",
        justificacion: "Control de concurrencia e integridad transaccional correcto a nivel de base de datos.",
        estado: "Prueba favorable",
        aprobado: true,
        observacionDocente: "Verificación correcta."
    }
];

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", () => {
    renderizarMatriz();
    renderizarRevisiones();
});

// Cambiar entre pestañas
function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tab-btn").forEach(el => {
        el.classList.remove("border-indigo-600", "text-indigo-600");
        el.classList.add("border-transparent", "text-gray-500");
    });

    document.getElementById(tabId).classList.remove("hidden");

    const activeBtn = event.currentTarget;
    activeBtn.classList.remove("border-transparent", "text-gray-500");
    activeBtn.classList.add("border-indigo-600", "text-indigo-600");
}

// RF01, RF02, RF03, RF04: Guardar nueva evidencia
function guardarEvidencia(e) {
    e.preventDefault();

    const nueva = {
        id: document.getElementById("hallazgo-id").value,
        evidencia: document.getElementById("hallazgo-texto").value,
        categoria: document.getElementById("hallazgo-cat").value,
        cercana: document.getElementById("hallazgo-cercana").value || "N/A",
        impacto: document.getElementById("hallazgo-impacto").value,
        justificacion: document.getElementById("hallazgo-justificacion").value,
        estado: document.getElementById("hallazgo-estado").value,
        aprobado: false,
        observacionDocente: ""
    };

    evidencias.push(nueva);
    document.getElementById("evidence-form").reset();

    renderizarMatriz();
    renderizarRevisiones();
    alert(`¡Hallazgo ${nueva.id} registrado correctamente!`);
}

// Renderizar la Matriz (RF06)
function renderizarMatriz() {
    const tbody = document.getElementById("tabla-matriz-body");
    tbody.innerHTML = "";

    evidencias.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 border-b";

        tr.innerHTML = `
      <td class="p-3 font-bold text-gray-900">${item.id}</td>
      <td class="p-3 max-w-xs text-xs">${item.evidencia}</td>
      <td class="p-3 font-medium text-indigo-700 text-xs">${item.categoria}</td>
      <td class="p-3 text-xs text-gray-600">${item.impacto}</td>
      <td class="p-3 text-xs text-gray-500">${item.cercana}</td>
      <td class="p-3 text-xs">
        <span class="px-2 py-1 rounded-full font-semibold ${item.estado === 'Identificado' ? 'bg-amber-100 text-amber-800' :
                item.estado === 'Prueba favorable' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }">${item.estado}</span>
      </td>
      <td class="p-3 text-center">
        <button onclick="eliminarHallazgo(${index})" class="text-rose-600 hover:text-rose-800 text-xs font-semibold">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// Renderizar Vista Auditor / Docente (RF05)
function renderizarRevisiones() {
    const container = document.getElementById("contenedor-revisiones");
    container.innerHTML = "";

    evidencias.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-3";

        card.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-indigo-900">[${item.id}] ${item.categoria}</span>
        <span class="text-xs font-semibold ${item.aprobado ? 'text-emerald-600' : 'text-amber-600'}">
          ${item.aprobado ? '✅ Aprobado por Auditor' : '⏳ Pendiente de revisión'}
        </span>
      </div>
      <p class="text-xs text-gray-700"><strong>Evidencia:</strong> ${item.evidencia}</p>
      <p class="text-xs text-gray-700"><strong>Justificación Estudiante:</strong> ${item.justificacion}</p>
      <p class="text-xs text-gray-500"><strong>Diferenciación / Criterio Cercano:</strong> ${item.cercana}</p>
      
      <div class="pt-2 border-t border-gray-200 flex flex-col md:flex-row gap-3 items-center">
        <input type="text" id="obs-${index}" value="${item.observacionDocente}" 
               placeholder="Añadir observación docente..." 
               class="w-full border-gray-300 border p-1.5 rounded text-xs">
        <button onclick="guardarFeedbackDocente(${index})" 
                class="bg-slate-800 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap">
          ${item.aprobado ? 'Actualizar Nota' : 'Aprobar y Comentar'}
        </button>
      </div>
    `;
        container.appendChild(card);
    });
}

// Guardar observación del docente
function guardarFeedbackDocente(index) {
    const obsInput = document.getElementById(`obs-${index}`).value;
    evidencias[index].observacionDocente = obsInput;
    evidencias[index].aprobado = true;
    renderizarRevisiones();
}

// Eliminar registro
function eliminarHallazgo(index) {
    if (confirm("¿Seguro de eliminar esta evidencia?")) {
        evidencias.splice(index, 1);
        renderizarMatriz();
        renderizarRevisiones();
    }
}

// RF06: Exportar Matriz a CSV
function exportarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,ID,Evidencia,Categoria_OWASP,Impacto,Categoria_Cercana,Estado\n";

    evidencias.forEach(row => {
        const fila = `"${row.id}","${row.evidencia.replace(/"/g, '""')}","${row.categoria}","${row.impacto.replace(/"/g, '""')}","${row.cercana}","${row.estado}"`;
        csvContent += fila + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "matriz_auditoria_transportes_pasco.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}