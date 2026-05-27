<template>
  <div class="route-block">
    <h4>Route {{ index + 1 }}</h4>

    <input v-model="route.fromAirport" placeholder="From Airport" />
    <input v-model="route.toAirport" placeholder="To Airport" />

    <select v-model="route.aircraft_id">
      <option value="">Aircraft</option>
      <option
        v-for="a in aircraftFleet"
        :key="a.id"
        :value="a.id"
      >
        {{ a.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  route: Object,
  index: Number,
  routeType: String,
  airportsNational: Array,
  airportsInternational: Array,
  aircraftFleet: Array,
})
</script>
