
<script setup>
import { ref, onMounted } from 'vue'

// Variables para guardar los dolares
let dolares = ref([])
let cargando = ref(true)

// Variables del formulario
let operacion = ref('comprar')
let monto = ref('')
let tipoDolar = ref('oficial')
let resultado = ref(null)

// Funcion para obtener los valores de la API
let fetchDolarValues = async () => {
  try {
    let api = await fetch('https://dolarapi.com/v1/dolares')
    let mostrar = await api.json()

    dolares.value = mostrar
  } catch (error) {
    console.log('Error al obtener los dolares', error)
  } finally {
    cargando.value = false
  }
}

// Funcion para realizar el calculo
let calcular = () => {
  let dolar = dolares.value.find(d => d.casa === tipoDolar.value)

  if (!dolar || monto.value <= 0) {
    resultado.value = 'Ingresá un monto válido'
    return
  }

  if (operacion.value === 'comprar') {
    let cantidad = Number(monto.value) / dolar.venta
    resultado.value = cantidad.toFixed(2) + ' dólares'
  } else {
    let cantidad = Number(monto.value) * dolar.compra
    resultado.value = '$' + cantidad.toFixed(2) + ' pesos'
  }
}

// Obtener los datos al cargar la pagina
onMounted(fetchDolarValues)
</script>

<template>
  <div class="contenedor">

    <h1>Cotizaciones del dólar</h1>

    <button @click="fetchDolarValues">
      Actualizar cotizaciones
    </button>

    <p v-if="cargando">Cargando cotizaciones...</p>

    <div class="dolares">
      <div
        class="tarjeta"
        v-for="dolar in dolares"
        :key="dolar.casa"
      >
        <h3>{{ dolar.nombre }}</h3>
        <p>Compra: ${{ dolar.compra }}</p>
        <p>Venta: ${{ dolar.venta }}</p>
      </div>
    </div>

    <h2>Compra y venta de dólares</h2>

    <div class="formulario">

      <label>Tipo de operación:</label>

      <select v-model="operacion">
        <option value="comprar">Comprar dólares</option>
        <option value="vender">Vender dólares</option>
      </select>

      <label>Tipo de dólar:</label>

      <select v-model="tipoDolar">
        <option
          v-for="dolar in dolares"
          :key="dolar.casa"
          :value="dolar.casa"
        >
          {{ dolar.nombre }}
        </option>
      </select>

      <label>
        {{ operacion === 'comprar'
          ? 'Cantidad de pesos:'
          : 'Cantidad de dólares:' }}
      </label>

      <input
        type="number"
        v-model="monto"
        placeholder="Ingresá un monto"
        min="0"
      >

      <button @click="calcular">
        Calcular
      </button>

      <h3 v-if="resultado !== null">
        Resultado: {{ resultado }}
      </h3>

    </div>

  </div>
</template>

<style scoped>

  .contenedor {
    min-height: 100vh;
    padding: 35px 5%;
    background: #f4f3fa;
    font-family: Arial, sans-serif;
    color: #292442;
    text-align: center;
  }

  h1 {
    font-size: 34px;
    color: #392b72;
    margin-bottom: 25px;
  }

  h2 {
    color: #392b72;
    margin: 35px 0 20px;
    font-size: 25px;
  }

  button {
    background: #6546c7;
    color: white;
    border: none;
    padding: 12px 22px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.3s;
  }

  button:hover {
    background: #49319a;
    transform: translateY(-2px);
  }

  /* Tarjetas de cotizaciones */

  .dolares {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }

  .tarjeta {
    background: white;
    padding: 25px 15px;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: 0.3s;
    border: 1px solid #e8e3f5;
  }

  .tarjeta:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(75, 52, 145, 0.15);
  }

  .tarjeta h3 {
    color: #563ba6;
    margin-bottom: 18px;
    font-size: 19px;
  }

  .tarjeta p {
    color: #55516a;
    font-size: 15px;
    margin: 12px 0;
  }

  /* Formulario */

  .formulario {
    background: white;
    max-width: 480px;
    margin: 25px auto;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    text-align: left;
  }

  .formulario label {
    display: block;
    margin: 15px 0 8px;
    color: #44366f;
    font-weight: bold;
  }

  .formulario select,
  .formulario input {
    width: 100%;
    padding: 12px;
    border: 1px solid #d8d1e9;
    border-radius: 8px;
    background: #faf9fd;
    color: #333;
    font-size: 15px;
    box-sizing: border-box;
    outline: none;
  }

  .formulario select:focus,
  .formulario input:focus {
    border-color: #6546c7;
  }

  .formulario button {
    width: 100%;
    margin-top: 22px;
    font-size: 16px;
  }

  @media (max-width: 600px) {
    .contenedor {
      padding: 25px 15px;
    }

    h1 {
      font-size: 27px;
    }

    .formulario {
      padding: 20px;
    }
  }
</style>
