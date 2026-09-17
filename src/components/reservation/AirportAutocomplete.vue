<template>
  <div class="airport-autocomplete">
    <label :for="inputId">{{ label }}</label>
    <div class="airport-autocomplete__control">
      <PlaneTakeoff aria-hidden="true" />
      <input
        :id="inputId"
        ref="inputRef"
        v-model="search"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        @focus="openList"
        @input="onInput"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="closeList"
        @blur="deferClose"
      />
    </div>
    <ul v-if="showList && filteredAirports.length" class="airport-autocomplete__list">
      <li
        v-for="(airport, index) in filteredAirports"
        :key="airport.optionKey"
        :class="{ active: index === highlightedIndex }"
        @mousedown.prevent="selectAirport(airport)"
      >
        <strong>{{ airport.cityCountry }}</strong>
        <span v-if="airport.codeLabel">{{ airport.codeLabel }}</span>
        <small>{{ airport.name }}</small>
      </li>
    </ul>
    <small>{{ meta }}</small>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { PlaneTakeoff } from "lucide-vue-next";

const props = defineProps({
  modelValue: { type: String, default: "" },
  airports: { type: Array, default: () => [] },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  meta: { type: String, default: "" },
  inputId: { type: String, required: true },
});

const emit = defineEmits(["update:modelValue", "select"]);

const search = ref("");
const showList = ref(false);
const highlightedIndex = ref(0);

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getAirportValue = (airport) =>
  String(airport?.iata || airport?.IATA || airport?.aeropuerto || airport?.name || "").trim();

const selectedAirport = computed(() =>
  props.airports.find((airport) => normalize(getAirportValue(airport)) === normalize(props.modelValue)),
);

const formatAirportSearchValue = (airport) => {
  if (!airport) return "";
  const code = getAirportValue(airport);
  const city = airport.city || airport.ciudad || "";
  return city && code ? `${city} (${code})` : city || code;
};

watch(
  () => [props.modelValue, props.airports],
  () => {
    search.value = formatAirportSearchValue(selectedAirport.value) || props.modelValue || "";
  },
  { immediate: true },
);

const decoratedAirports = computed(() =>
  props.airports.map((airport, index) => {
    const iata = airport.iata || airport.IATA || "";
    const icao = airport.icao || airport.ICAO || "";
    const city = airport.city || airport.ciudad || "";
    const country = airport.country || airport.pais || airport.COUNTRY || "";
    const name = airport.name || airport.aeropuerto || airport.AEROPUERTO || "";
    const codeLabel = [iata, icao].filter(Boolean).join(" · ");

    return {
      ...airport,
      optionKey: `${getAirportValue(airport)}-${index}`,
      cityCountry: [city, country].filter(Boolean).join(", "),
      codeLabel,
      name,
      searchText: normalize([city, country, name, iata, icao].filter(Boolean).join(" ")),
    };
  }),
);

const filteredAirports = computed(() => {
  const query = normalize(search.value);
  const selectedText = normalize(formatAirportSearchValue(selectedAirport.value));

  if (!query || (selectedText && query === selectedText)) {
    return decoratedAirports.value.slice(0, 8);
  }

  return decoratedAirports.value
    .filter((airport) => airport.searchText.includes(query))
    .slice(0, 8);
});

const openList = () => {
  if (props.disabled) return;
  highlightedIndex.value = 0;
  showList.value = true;
};

const closeList = () => {
  showList.value = false;
};

const deferClose = () => {
  window.setTimeout(closeList, 140);
};

const onInput = () => {
  highlightedIndex.value = 0;
  showList.value = true;
  if (!search.value) {
    emit("update:modelValue", "");
    emit("select", null);
  }
};

const move = (step) => {
  if (!showList.value) openList();
  const length = filteredAirports.value.length;
  if (!length) return;
  highlightedIndex.value = (highlightedIndex.value + step + length) % length;
};

const selectAirport = (airport) => {
  const value = getAirportValue(airport);
  emit("update:modelValue", value);
  emit("select", airport);
  search.value = formatAirportSearchValue(airport);
  closeList();
};

const selectHighlighted = () => {
  const airport = filteredAirports.value[highlightedIndex.value];
  if (airport) selectAirport(airport);
};
</script>

<style scoped>
.airport-autocomplete {
  position: relative;
  display: grid;
  gap: 8px;
  min-width: 0;
}

.airport-autocomplete label {
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.airport-autocomplete__control {
  position: relative;
}

.airport-autocomplete__control > svg {
  position: absolute;
  left: 16px;
  top: 50%;
  z-index: 2;
  width: 18px;
  height: 18px;
  color: #ffffff;
  opacity: 0.92;
  transform: translateY(-50%);
  pointer-events: none;
}

.airport-autocomplete input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
  color: #ffffff;
  padding: 0 16px 0 46px;
  font-size: 0.88rem;
  font-weight: 800;
}

.airport-autocomplete input:focus {
  outline: 2px solid rgba(240, 200, 117, 0.82);
  outline-offset: 2px;
  border-color: rgba(240, 200, 117, 0.72);
}

.airport-autocomplete input:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.airport-autocomplete__list {
  position: absolute;
  top: calc(100% - 30px);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 280px;
  margin: 0;
  padding: 6px;
  overflow: auto;
  list-style: none;
  border: 1px solid rgba(240, 200, 117, 0.28);
  border-radius: 8px;
  background: rgba(9, 15, 22, 0.98);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38);
}

.airport-autocomplete__list li {
  display: grid;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.airport-autocomplete__list li.active,
.airport-autocomplete__list li:hover {
  background: rgba(212, 166, 79, 0.16);
}

.airport-autocomplete__list strong {
  color: #ffffff;
  font-size: 0.82rem;
}

.airport-autocomplete__list span {
  color: #edc879;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.airport-autocomplete__list small,
.airport-autocomplete > small {
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.72rem;
}

.airport-autocomplete > small {
  display: block;
  min-height: 34px;
  max-width: 230px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1.22;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

@media (max-width: 720px) {
  .airport-autocomplete > small {
    max-width: none;
    min-height: auto;
  }
}
</style>
