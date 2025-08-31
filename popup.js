document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.grid-btn');  
  
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
  
  // Función para insertar texto usando la API de scripting
  function insertTextWithScripting(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: insertTextIntoActiveElement,
          args: [text]
        }, (results) => {
          if (results && results[0] && results[0].result) {
            console.log('Texto insertado');
          }
        });
      }
    });
  }
  
  // Esta función se ejecuta en el contexto de la página
  function insertTextIntoActiveElement(text) {
    // Intentar encontrar el elemento activo recientemente
    const selectors = 'input, textarea, [contenteditable="true"]';
    const possibleElements = document.querySelectorAll(selectors);
    
    let focusedElement = null;
    
    // Buscar el elemento que probablemente tenía el foco
    for (let el of possibleElements) {
      // Verificar si el elemento está visible y en el viewport
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       el.offsetParent !== null;
      
      // Priorizar elementos con datos recientes (valores, selección)
      if (isVisible) {
        // Si es un campo de formulario con datos, es probable que sea el correcto
        if (el.value && el.value.length > 0) {
          focusedElement = el;
          break;
        }
        
        // Si no hemos encontrado uno con datos, guardar el primero visible
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
                               text + 
                               focusedElement.value.substring(end);
          
          focusedElement.selectionStart = focusedElement.selectionEnd = start + text.length;
        } 
        else if (focusedElement.isContentEditable) {
          document.execCommand('insertText', false, text);
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
      const symbol = this.textContent;
      
      // 1. Copiar al portapapeles
      if (copyToClipboard(symbol)) {
        console.log('Copiado: ' + symbol);
      } else {
        console.log('Error al copiar');
        return;
      }
      
      // 2. Intentar insertar en el campo activo
      insertTextWithScripting(symbol);
    });
  });
  
  // Enfocar el primer botón al abrir el popup
  if (buttons.length > 0) {
    buttons[0].focus();
  }
});