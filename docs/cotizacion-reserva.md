# Cotizacion en Reserva.vue

Esta nota documenta el flujo actual de calculo de cotizacion usado en `src/views/Reserva.vue`.

## Flujo general

El flujo de precio parte de las rutas validas seleccionadas por el cliente y de la aeronave elegida.

```text
rutas validas
  -> rutas operativas con reposicionamiento/ferry
  -> calculatePrice() por tramo
  -> pricingSummary
  -> subtotal
  -> margen comercial
  -> total final
```

## Que contempla

- Distancia entre aeropuertos usando coordenadas.
- Tiempo real de vuelo segun velocidad crucero de la aeronave.
- Margen operativo en minutos segun tipo de aeronave.
- Costo de vuelo por horas estimadas y tarifa por hora.
- Reposicionamiento/ferry cuando la aeronave inicia o termina fuera de base.
- Overnight cuando aplica entre tramos de cliente.
- Gastos operativos/aeroportuarios.
- Otros cargos.
- Margen comercial si la aeronave lo tiene activo.
- IVA actualmente configurado en `0`.

## Formula principal por tramo

```text
distancia_nm = distancia entre origen y destino
tiempo_real_horas = distancia_nm / velocidad_crucero
tiempo_estimado = tiempo_real + margen_operativo
costo_vuelo = tiempo_estimado_horas * rental_price_usd
```

Por tramo, `calculatePrice()` devuelve principalmente:

```text
flightCost
overnightCost
operationalCost
nights
hours
miles
```

## Ferry / reposicionamiento

Si la aeronave no esta en el aeropuerto de salida, el flujo agrega un tramo operativo de reposicionamiento desde su base hasta el origen del cliente.

Si la aeronave no termina en su base, el flujo agrega un tramo operativo de regreso a base.

Estos tramos se incluyen en `pricedRoutes` y se resumen dentro de `pricingSummary.ferry`.

## Totales

El subtotal actual se calcula asi:

```text
subtotal =
  flightCostTotal
  + overnightTotal
  + operationalExpenses
  + otherCharges
```

Luego:

```text
commercialMargin = subtotal * commercialMarginPercent
iva = 0
totalFinal = subtotal + commercialMargin
```

## Ejemplo ilustrativo

Ruta cliente:

```text
TLC -> CUN
```

Supuestos:

```text
Aeronave: CESSNA 650
Base aeronave: TLC
Tarifa: 4,000 USD/h
Distancia TLC -> CUN: 690 NM
Velocidad: 400 kt
Margen operativo: 30 min
Overnight: 0
Gastos operativos: 500 USD
Otros cargos: 0
Margen comercial: 15%
IVA: 0
```

Calculo del vuelo cliente:

```text
Tiempo real:
690 NM / 400 kt = 1.725 h
aprox. 1 h 44 min

Tiempo estimado:
1 h 44 min + 30 min margen
= 2 h 14 min
= 2.23 h

Costo vuelo:
2.23 h * 4,000 USD
= 8,920 USD
```

Si la aeronave termina en CUN y debe regresar a base, el sistema puede agregar ferry:

```text
Ferry CUN -> TLC:
2.23 h * 4,000 USD
= 8,920 USD
```

Resumen:

```text
Vuelo cliente:        8,920
Ferry regreso:        8,920
Overnight:                0
Gastos operativos:      500
Otros cargos:             0
Subtotal:            18,340

Margen comercial 15%:
18,340 * 0.15 = 2,751

IVA:                     0

Total final:
18,340 + 2,751 = 21,091 USD
```

Este ejemplo es solo ilustrativo. El calculo real depende de coordenadas, velocidad, tarifa, base de la aeronave, fechas, noches, reposicionamiento y valores configurados en la aeronave.
