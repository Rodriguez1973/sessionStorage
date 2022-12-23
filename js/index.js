/*
Proyecto realizado por: José A. Rodríguez López
Fecha: 23/12/2022
*/
let registrosSessionStorage = [] //Array donde se almacenaran las variables locales del sessionStorage.
let indiceRegistro = 0 //Contador registros de sesión.
let borrado = false //Flag de control de la acción de borrado.

//-------------------------------------------------------------------------------------------------
//Referencias de los objetos del formulario.
const grabarSessionStorage = document.getElementById('grabarSessionStorage')
const mostrarSessionStorage = document.getElementById('mostrarSessionStorage')
const borrarSessionStorage = document.getElementById('borrarSessionStorage')
const iTarea = document.getElementById('tarea')
const iTProgramado = document.getElementById('tProgramado')
const iTEmpleado = document.getElementById('tEmpleado')
const iDescripcion = document.getElementById('descripcion')
const tablaDatos = document.getElementById('tablaDatos')

//--------------------------------------------------------------------------------------------------
//Definición de eventos de los objetos.
grabarSessionStorage.addEventListener(
  'click',
  grabarRegistroSessionStorage,
  false,
) //Evento click sobre el ícono de grabar.
mostrarSessionStorage.addEventListener(
  'click',
  mostrarRegistrosSessionStorage,
  false,
) //Evento click sobre el ícono de mostrar tabla.
borrarSessionStorage.addEventListener(
  'click',
  borrarRegistrosSessionStorage,
  false,
) //Evento click sobre el ícono de borrar.

//--------------------------------------------------------------------------------------------------
//Borrar todo el contenido del sessionStorage.
function borrarRegistrosSessionStorage() {
  if (window.sessionStorage.length > 0) {
    window.sessionStorage.clear()
    indiceRegistro = 0 
    tablaDatos.innerHTML = ''
  } else {
    mostrarVentanaEmergente(
      'Almacenamiento',
      'No existen registros que borrar en el almacenamiento de sesión.',
      'info',
    )
  }
}

//--------------------------------------------------------------------------------------------------
//Clase que modela cada registro de actividad.
class registroActividad {
  constructor(tarea, tProgramado, tEmpleado, descripcion) {
    this.tarea = tarea
    this.tProgramado = tProgramado
    this.tEmpleado = tEmpleado
    this.descripcion = descripcion
  }

  toString() {
    return (
      this.tarea +
      '*/*' +
      this.tProgramado +
      '*/*' +
      this.tEmpleado +
      '*/*' +
      this.descripcion
    )
  }
}

//--------------------------------------------------------------------------------------------------
//Almacena un registro en el sessionStorage.
function grabarRegistroSessionStorage() {
  if (typeof Storage !== 'undefined') {
    if (validarRegistro()) {
      let registro = new registroActividad(
        iTarea.value,
        iTProgramado.value,
        iTEmpleado.value,
        iDescripcion.value,
      )
      window.sessionStorage.setItem(++indiceRegistro, registro.toString())
      limpiaCampos()
      mostrarVentanaEmergente(
        'Almacenamiento',
        'Registro almacenado en el almacenamiento de sesión.',
        'success',
      )
    }
  } else {
    mostrarVentanaEmergente(
      'Almacenamiento',
      'El navegador no admite almacenamiento de sesión.',
      'warning',
    )
  }
}

//--------------------------------------------------------------------------------------------------
//Función que muestra ventana emergente de notificaciones.
function mostrarVentanaEmergente(titulo, mensaje, icono) {
  Swal.fire({
    title: titulo,
    text: mensaje,
    icon: icono,
    confirmButtonText: 'Aceptar',
  })
}

//--------------------------------------------------------------------------------------------------
//Presenta una tabla con los registros almacenados en el sessionStorage.
function mostrarRegistrosSessionStorage() {
  registrosSessionStorage = []
  for (let indice = 0; indice < window.sessionStorage.length; indice++) {
    let clave = window.sessionStorage.key(indice)
    let registro = window.sessionStorage.getItem(clave)
    registrosSessionStorage[clave] = registro.split('*/*')
  }
  mostrarTabla()
}

//--------------------------------------------------------------------------------------------------
//Función que muestra la tabla en la interfaz.
function mostrarTabla() {
  tablaDatos.innerHTML = '' //Borra la tabla.
  if (registrosSessionStorage.length > 0) {
    let tabla = document.createElement('table') //Tabla
    tablaDatos.appendChild(tabla)
    let thead = document.createElement('thead') //Encabezado
    tabla.appendChild(thead)
    let trEncabezado = document.createElement('tr') //Fila encabezado.
    thead.appendChild(trEncabezado)
    let thColumna = document.createElement('th') //Columna1.
    thColumna.innerText = 'Clave'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna2.
    thColumna.innerText = 'Accion'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna3.
    thColumna.innerText = 'Tarea'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna4.
    thColumna.innerText = 'Tiempo\nProgramado'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna5.
    thColumna.innerText = 'Tiempo\nEmpleado'
    trEncabezado.appendChild(thColumna)
    thColumna = document.createElement('th') //Columna6.
    thColumna.innerText = 'Descripción'
    trEncabezado.appendChild(thColumna)
    let tbody = document.createElement('tbody') //Cuerpo de la tabla
    tabla.appendChild(tbody)

    //Recorre todos los registros del almacenamiento de sesión.
    for (const clave in registrosSessionStorage) {
      let fila = document.createElement('tr') //Crea una fila.
      tbody.appendChild(fila) //Añade la fila al cuerpo de la tabla.
      let celda = document.createElement('td') //Crea celda clave.
      celda.innerText = clave
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda clave.
      let iBorrar = document.createElement('input') //Botón de borrado.
      iBorrar.type = 'button'
      iBorrar.id = clave
      iBorrar.value = 'Borrar'
      iBorrar.addEventListener('click', borrarRegistroSessionStorage, false)
      celda.appendChild(iBorrar)
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tarea.
      celda.innerText = registrosSessionStorage[clave][0]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tiempo programado
      celda.innerText = registrosSessionStorage[clave][1]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda tiempo empleado
      celda.innerText = registrosSessionStorage[clave][2]
      fila.appendChild(celda)
      celda = document.createElement('td') //Crea celda descripción.
      celda.innerText = registrosSessionStorage[clave][3]
      fila.appendChild(celda)
    }
  } else {
    if (!borrado) {
      mostrarVentanaEmergente(
        'Almacenamiento',
        'No existen registros que mostrar en el almacenamiento de sesión.',
        'info',
      )
    }
  }
  borrado = false
}

//--------------------------------------------------------------------------------------------------
//Borrar un registro del sessionStorage.
function borrarRegistroSessionStorage(evt) {
  window.sessionStorage.removeItem(evt.target.id)
  borrado = true
  mostrarRegistrosSessionStorage()
}

//--------------------------------------------------------------------------------------------------
//Validar los datos de los registros a almacenar localmente en la sesión.
function validarRegistro() {
  let valido = true
  if (iTarea.value.trim() === '' || iTarea.value.trim().includes('*/*')) {
    valido = false
    let mensaje = 'La tarea no puede estar vacía o contener la subcadena "*/*".'
    mostrarVentanaEmergente('Error de validación', mensaje, 'error')
  } else if (iTProgramado.value == '' || iTProgramado.value <= 0) {
    valido = false
    let mensaje = 'El tiempo programado no puede ser nulo o negativo.'
    mostrarVentanaEmergente('Error de validación', mensaje, 'error')
  } else if (iTEmpleado.value == '' || iTEmpleado.value <= 0) {
    valido = false
    let mensaje = 'El tiempo empleado no puede ser nulo o negativo.'
    mostrarVentanaEmergente('Error de validación', mensaje, 'error')
  } else if (
    iDescripcion.value.trim() === '' ||
    iDescripcion.value.trim().includes('*/*')
  ) {
    valido = false
    let mensaje =
      'La descripción no puede estar vacía o contener la subcadena "*/*".'
    mostrarVentanaEmergente('Error de validación', mensaje, 'error')
  }
  return valido
}

//--------------------------------------------------------------------------------------------------
//Función que límpia los campos tras guardar un registro.
function limpiaCampos() {
  iTarea.value = ''
  iTEmpleado.value = 1
  iTProgramado.value = 1
  iDescripcion.value = ''
}