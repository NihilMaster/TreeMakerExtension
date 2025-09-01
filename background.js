// Estado por defecto
const defaultSettings = {
  mode: "insertar", // "copiar", "insertar", "ambos"
  useEmojis: true // true: emojis, false: símbolos
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

  // Crear menú principal para modo de operación
  chrome.contextMenus.create({
    id: "mode-header",
    title: "Modo de operación",
    contexts: ["action"],
    enabled: true
  });

  // Opción: Solo copiar (radio button)
  chrome.contextMenus.create({
    id: "copiar",
    parentId: "mode-header",
    title: "Solo copiar",
    contexts: ["action"],
    type: "radio",
    checked: settings.mode === "copiar"
  });

  // Opción: Solo insertar (radio button)
  chrome.contextMenus.create({
    id: "insertar",
    parentId: "mode-header",
    title: "Solo insertar",
    contexts: ["action"],
    type: "radio",
    checked: settings.mode === "insertar"
  });

  // Opción: Copiar e insertar (radio button)
  chrome.contextMenus.create({
    id: "ambos",
    parentId: "mode-header",
    title: "Copiar e insertar",
    contexts: ["action"],
    type: "radio",
    checked: settings.mode === "ambos"
  });

  // Separador
  chrome.contextMenus.create({
    id: "separator-1",
    type: "separator",
    contexts: ["action"]
  });

  // Crear menú principal para tipo de iconos
  chrome.contextMenus.create({
    id: "icons-header",
    title: "Tipo de iconos",
    contexts: ["action"],
    enabled: true
  });

  // Opción: Usar emojis (radio button)
  chrome.contextMenus.create({
    id: "use-emojis",
    parentId: "icons-header",
    title: "Usar emojis",
    contexts: ["action"],
    type: "radio",
    checked: settings.useEmojis
  });

  // Opción: Usar símbolos (radio button)
  chrome.contextMenus.create({
    id: "use-symbols",
    parentId: "icons-header",
    title: "Usar símbolos",
    contexts: ["action"],
    type: "radio",
    checked: !settings.useEmojis
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
      
      case "use-emojis":
        settings.useEmojis = true;
        break;
        
      case "use-symbols":
        settings.useEmojis = false;
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