document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.grid-btn');
  let currentSettings = {
    mode: "copiar",
    useEmojis: true
  };

  // Mapeo de emojis a símbolos y viceversa
  const iconMappings = {
    // Fila 3 (iconos especiales)
    "📂": { emoji: "📂", symbol: "🗁" }, // folder
    "📄": { emoji: "📄", symbol: "🗎" }, // file
    
    // Puedes agregar más mapeos aquí si necesitas
  };

  // Cargar configuración
  chrome.storage.local.get('settings', (data) => {
    if (data.settings) {
      currentSettings = data.settings;
      updateIcons();
    }
  });

  // Escuchar cambios en la configuración
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "settingsChanged") {
      currentSettings = request.settings;
      updateIcons();
    }
  });

  // Función para actualizar iconos según la configuración
  function updateIcons() {
    buttons.forEach(button => {
      const originalContent = button.getAttribute('data-original-content');
      
      // Verificar si este botón tiene un mapeo definido
      if (iconMappings[originalContent]) {
        const newContent = currentSettings.useEmojis ? 
          iconMappings[originalContent].emoji : 
          iconMappings[originalContent].symbol;
        
        button.textContent = newContent;
        
        // Actualizar también el atributo alt con el símbolo correcto
        const correctSymbol = currentSettings.useEmojis ? 
          iconMappings[originalContent].emoji : 
          iconMappings[originalContent].symbol;
        
        button.setAttribute('alt', correctSymbol);
      }
    });
  }

  // Función para copiar al portapapeles
  function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  // Función para insertar texto
  function insertTextWithScripting(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: insertTextIntoActiveElement,
          args: [text]
        });
      }
    });
    return true;
  }

  // Esta función se ejecuta en el contexto de la página
  function insertTextIntoActiveElement(text) {
    // Mapear caracteres especiales a su representación real
    const specialChars = {
      '↵': '\n',       // Enter - nueva línea
      '_': ' ',         // Guión bajo para blankspace
      '→': '\t'        // Flecha derecha para tabulación
    };
    
    // Convertir si es un carácter especial
    const actualText = specialChars[text] || text;
    
    // Intentar encontrar el elemento activo recientemente
    const selectors = 'input, textarea, [contenteditable="true"]';
    const possibleElements = document.querySelectorAll(selectors);
    
    let focusedElement = null;
    
    // Buscar el elemento que probablemente tenía el foco
    for (let el of possibleElements) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && el.offsetParent !== null;
      
      if (isVisible) {
        if (el.value && el.value.length > 0) {
          focusedElement = el;
          break;
        }
        
        if (!focusedElement) {
          focusedElement = el;
        }
      }
    }
    
    // Si encontramos un elemento candidato, insertar el texto
    if (focusedElement) {
      try {
        focusedElement.focus();
        
        if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
          const start = focusedElement.selectionStart;
          const end = focusedElement.selectionEnd;
          
          focusedElement.value = focusedElement.value.substring(0, start) + 
                               actualText + 
                               focusedElement.value.substring(end);
          
          focusedElement.selectionStart = focusedElement.selectionEnd = start + actualText.length;
        } 
        else if (focusedElement.isContentEditable) {
          document.execCommand('insertText', false, actualText);
        }
        
        // Disparar eventos
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        focusedElement.dispatchEvent(inputEvent);
        focusedElement.dispatchEvent(changeEvent);
        
        return true;
      } catch (e) {
        console.error('Error inserting text:', e);
        return false;
      }
    }
    
    return false;
  }
  
  // Agregar event listeners a todos los botones
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      // Obtener el texto del atributo alt (que contiene la representación correcta)
      const symbol = this.getAttribute('alt') || this.textContent;
      
      // Ejecutar acciones según el modo seleccionado
      if (currentSettings.mode === "copiar" || currentSettings.mode === "ambos") {
        if (copyToClipboard(symbol)) {
          this.setAttribute('title', '¡Copiado!');
          setTimeout(() => {
            this.setAttribute('title', this.getAttribute('data-original-title'));
          }, 10000);
        }
      }
      
      if (currentSettings.mode === "insertar" || currentSettings.mode === "ambos") {
        insertTextWithScripting(symbol);
      }
    });
  });
  
  // Guardar titles originales y configurar datos para mapeo
  buttons.forEach(button => {
    const originalTitle = button.getAttribute('title');
    const originalAlt = button.getAttribute('alt');
    const content = button.textContent;
    
    button.setAttribute('data-original-title', originalTitle);
    button.setAttribute('data-original-alt', originalAlt);
    button.setAttribute('data-original-content', content);
    
    // Inicializar con el símbolo correcto según la configuración
    if (iconMappings[content]) {
      const correctSymbol = currentSettings.useEmojis ? 
        iconMappings[content].emoji : 
        iconMappings[content].symbol;
      
      button.textContent = correctSymbol;
      button.setAttribute('alt', correctSymbol);
    }
  });
  
  // Enfocar el primer botón al abrir el popup
  if (buttons.length > 0) {
    buttons[0].focus();
  }
});