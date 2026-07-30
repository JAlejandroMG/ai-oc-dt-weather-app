# Revisión Weather CLI

- [ ] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [ ] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** no está corriendo; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **7 day forecast:** agregar la posibilidad de obtener el pronóstico del clima para los próximos 7 días.

# Checklist adicional de revisión:

- [ ] ¿Se usaron ramas?
- [ ] ¿Se usaron pull requests?
- [ ] ¿Qué pasa si tras un nuevo feature, se rompió otra cosa?
- [ ] ¿Se hizo testing? ¿Qué se probó?
- [ ] ¿El modelo instaló dependencias? ¿Qué dependencias instaló? ¿Estoy de acuerdo con eso?
- [ ] ¿Comprendo el código? ¿Qué es lo que hace? ¿Qué es lo que no hace?
