<template>
  <div>
    <h2>Aeropuertos</h2>

    <ul>
      <li v-for="a in airports" :key="a.AEROPUERTO">
        {{ a.ESTADO }} - {{ a.CIUDAD }} - {{ a.AEROPUERTO }}
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const airports = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('airports')
    .select('*')

  if (error) {
    console.error('❌ Supabase error:', error)
  } else {
    airports.value = data
  }

  loading.value = false
})
</script>
