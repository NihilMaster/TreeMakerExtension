document.addEventListener('DOMContentLoaded', function() {
  // Agregar event listeners a todos los botones
  const buttons = document.querySelectorAll('.grid-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const symbol = this.textContent;
      console.log(`Botón presionado: ${symbol}`);
      
      // Aquí puedes agregar la funcionalidad específica para cada botón
      // Por ejemplo:
      switch(symbol) {
        case '☆':
          alert('Estrella presionada');
          break;
        case '☑':
          alert('Checkbox presionado');
          break;
        case '✔':
          alert('Check presionado');
          break;
        // Agregar más casos según necesites
      }
    });
  });
});