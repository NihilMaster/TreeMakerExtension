document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.grid-btn');
  const statusMessage = document.getElementById('statusMessage');
  
  // Función para mostrar mensajes de estado
  function showStatusMessage(message, duration = 1500) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, duration);
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
  
  // Función para pegar en el campo de entrada con foco
  function pasteToFocusedInput(text) {
    // Obtener la pestaña activa
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: (textToPaste) => {
            const activeElement = document.activeElement;
            if (activeElement && 
                (activeElement.tagName === 'INPUT' || 
                 activeElement.tagName === 'TEXTAREA' ||
                 activeElement.isContentEditable)) {
              
              // Para campos de entrada normales
              if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                
                activeElement.value = activeElement.value.substring(0, start) + 
                                     textToPaste + 
                                     activeElement.value.substring(end);
                
                // Establecer la posición del cursor después del texto insertado
                activeElement.selectionStart = activeElement.selectionEnd = start + textToPaste.length;
              } 
              // Para elementos editables (contentEditable)
              else if (activeElement.isContentEditable) {
                document.execCommand('insertText', false, textToPaste);
              }
              
              // Disparar eventos de cambio e entrada
              const inputEvent = new Event('input', { bubbles: true });
              const changeEvent = new Event('change', { bubbles: true });
              activeElement.dispatchEvent(inputEvent);
              activeElement.dispatchEvent(changeEvent);
              
              return true;
            }
            return false;
          },
          args: [text]
        }, (results) => {
          if (results && results[0] && results[0].result) {
            showStatusMessage('Texto pegado en el campo');
          }
        });
      }
    });
  }
  
  // Agregar event listeners a todos los botones
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const symbol = this.textContent;
      
      // 1. Copiar al portapapeles
      if (copyToClipboard(symbol)) {
        showStatusMessage('Copiado: ' + symbol);
      } else {
        showStatusMessage('Error al copiar');
        return;
      }
      
      // 2. Intentar pegar en el campo con foco
      pasteToFocusedInput(symbol);
    });
  });
});