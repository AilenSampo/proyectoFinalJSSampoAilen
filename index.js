console.log("Selector de colores Color Master Fidelite");

const colorItems = document.querySelectorAll('.color-item');
const totalAcumulado = document.getElementById('total-acumulado');
const totalAcumuladoFinal = document.getElementById('total-acumulado-final');

colorItems.forEach(item => {
  const cantidadIngresada = item.querySelector('.quantity');
  const price = parseFloat(item.getAttribute('data-price'));

  cantidadIngresada.addEventListener('input', updateTotal);

  function updateTotal() {
    let total = 0;
    colorItems.forEach(item => {
      const quantity = parseInt(item.querySelector('.quantity').value);
      total += quantity * price;
    });
    totalAcumulado.textContent = Math.round(total);
    totalAcumuladoFinal.value = Math.round(total);
  }
});

function mostrarDatosUsuario() {
  const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));

  if (datosUsuario) {
    const listaDatosUsuario = document.getElementById('datos-usuario');
    listaDatosUsuario.innerHTML = '';

    datosUsuario.forEach(dato => {
      if (dato.cantidad > 0) {
        const item = document.createElement('li');
        item.textContent = `${dato.color}: ${dato.cantidad}`;
        listaDatosUsuario.appendChild(item);
      }
    });
  }
}

const envioDeDatos = (event) => {
  event.preventDefault();

  const formularioSeleccion = event.target;
  const formData = new FormData(formularioSeleccion);

  const nombre = formData.get('nombre');
  const apellido = formData.get('apellido');
  formData.set('nombre', nombre + ' ' + apellido);

  const datosUsuario = Array.from(colorItems).map(item => {
    const color = item.querySelector('.item-name').value;
    const cantidad = parseInt(item.querySelector('.quantity').value);
    return { color, cantidad };
  });

  localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Selección de tonos enviada con éxito',
    });
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Hubo un error al enviar la selección de tonos',
    });
  });

  mostrarDatosUsuario();
};

document
  .querySelector("form")
  .addEventListener("submit", envioDeDatos);

mostrarDatosUsuario();
