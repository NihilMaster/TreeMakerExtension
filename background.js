// Estado por defecto
const defaultSettings = {
  mode: "copiar", // "copiar", "insertar", "ambos"
  enabled: true
};

// Inicializar configuración
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('settings', (data) => {
    const settings = data.settings || defaultSettings;
    chrome.storage.local.set({ settings });
    updateContextMenu(settings);
  });
});

// Actualizar el menú contextual según la configuración
function updateContextMenu(settings) {
  // Eliminar menú existente
  chrome.contextMenus.removeAll();

  // Crear menú principal
  chrome.contextMenus.create({
    id: "mode-header",
    title: "Modo de operación",
    contexts: ["action"],
    enabled: false
  });

  // Opción: Solo copiar
  chrome.contextMenus.create({
    id: "copiar",
    title: settings.mode === "copiar" ? "✓ Solo copiar" : "Solo copiar",
    contexts: ["action"]
  });

  // Opción: Solo insertar
  chrome.contextMenus.create({
    id: "insertar",
    title: settings.mode === "insertar" ? "✓ Solo insertar" : "Solo insertar",
    contexts: ["action"]
  });

  // Opción: Copiar e insertar
  chrome.contextMenus.create({
    id: "ambos",
    title: settings.mode === "ambos" ? "✓ Copiar e insertar" : "Copiar e insertar",
    contexts: ["action"]
  });

  // Separador
  chrome.contextMenus.create({
    id: "separator-1",
    type: "separator",
    contexts: ["action"]
  });

  // Opción: Emojis/Símbolos
  chrome.contextMenus.create({
    id: "emojis",
    title: "Emojis/Símbolos",
    contexts: ["action"]
  });
}

// Escuchar cambios en el almacenamiento para actualizar el menú
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.settings) {
    updateContextMenu(changes.settings.newValue);
  }
});

// Manejar clics en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.local.get('settings', (data) => {
    const settings = data.settings || defaultSettings;
    
    switch (info.menuItemId) {
        case "copiar":
        case "insertar":
        case "ambos":
            settings.mode = info.menuItemId;
            break;

        case "emojis":
            // Manejar la selección de emojis/símbolos
            break;
    }
    
    // Guardar nueva configuración
    chrome.storage.local.set({ settings });
    
    // Notificar al popup si está abierto
    chrome.runtime.sendMessage({
      type: "settingsChanged",
      settings: settings
    }).catch(() => {
      // El popup no está abierto, no hay problema
    });
  });
});

// Cargar configuración al iniciar
chrome.storage.local.get('settings', (data) => {
  const settings = data.settings || defaultSettings;
  updateContextMenu(settings);
});