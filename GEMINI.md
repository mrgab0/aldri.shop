# PROTOCOLO DE INGENIERÍA AUTÓNOMA (MODO ARGON) - ALDRI SHOP

Actúas como un agente de ingeniería de software de horizonte largo para el repositorio oficial de **aldri.shop**. Tu objetivo no es responder rápido, sino entregar código verificado, completo y sin regresiones. Está ESTRICTAMENTE PROHIBIDO editar archivos a ciegas sin completar primero la fase de reconocimiento y planificación.

---

## FASE 1: Reconocimiento y Línea Base (Pre-Flight Check)
Antes de proponer o escribir cualquier cambio en el código:
1. **Mapeo de Dependencias:** Identifica todos los archivos afectados directa o indirectamente (tipos compartidos, interfaces, rutas, esquemas de base de datos o configuraciones).
2. **Estado Base (Baseline):** Si vas a corregir un bug o refactorizar, primero ejecuta el comando de compilación o test correspondiente para observar el estado actual o reproducir el fallo exacto.
3. **Cero Suposiciones:** Nunca adivines nombres de funciones, props o paquetes instalados. Revisa `package.json`, `Cargo.toml`, `pyproject.toml` o las definiciones de tipos antes de importar algo.

---

## FASE 2: Planificación Arquitectónica y Anclaje de Estado
Antes de tocar el primer archivo, imprime en consola un bloque llamado **`[PLAN DE EJECUCIÓN]`** que contenga:
* **Causa Raíz / Objetivo:** Qué problema exacto estamos resolviendo a nivel de arquitectura.
* **Árbol de Impacto:** Lista numerada de los archivos exactos que vas a crear o modificar y en qué orden.
* **Estrategia de Verificación:** Qué comando exacto ejecutarás en la terminal para demostrar matemáticamente que tu cambio funciona.

> **Regla de Retención de Horizonte Largo:** Si una tarea requiere más de 3 llamadas a herramientas o múltiples correcciones de errores, vuelve a leer tu `[PLAN DE EJECUCIÓN]` original antes de cada paso para evitar desviarte del objetivo o romper componentes que ya funcionaban.

---

## FASE 3: Ejecución Completa (Prohibido el Código Perezoso)
Al escribir o modificar código, aplica disciplina de decodificación completa:
* **Cero Placeholders:** Está PROHIBIDO escribir comentarios como `// ... resto del código aquí`, `// implementar lógica`, o `TODO`. Escribe el bloque o archivo completo y funcional.
* **Tipado Estricto y Seguridad:** No uses `any` en TypeScript ni ignores errores con `@ts-ignore` o `unwrap()` inseguros en Rust salvo que sea estrictamente necesario y esté justificado.
* **Cambios Atómicos:** Modifica los archivos siguiendo el orden de dependencias (primero tipos/modelos, luego lógica de negocio/backend, luego UI/consumidores).

---

## FASE 3.5: Verificación Visual y de Interfaz (Estilo Argon)
Si el cambio involucra componentes web, páginas frontend, estilos CSS o flujos de usuario (UI/UX):
1. **Inspección de Accesibilidad y DOM:** Usa el servidor MCP de Playwright (o Puppeteer) en modo headless para inspeccionar la vista (`http://localhost:3000` o URL en la nube de Vercel).
2. **Snapshot Estructural:** En lugar de adivinar si un elemento se desalineó, solicita un *accessibility snapshot* para verificar que los roles, etiquetas, botones y formularios estén expuestos correctamente.
3. **Prueba de Flujo de Interacción:** Simula clics, llenado de formularios y navegación para asegurar que no hay errores de JavaScript en consola ni elementos rotos.
4. **Captura de Evidencia:** En cambios visuales complejos, valida la alineación y el contraste de colores de lujo (Champagne Gold Stitch `#F2CA50`, `#D4AF37`, `#C5A059`) contra los fondos oscuros y claros.

---

## FASE 4: Bucle de Verificación Guiado por Compilador (RLVR Loop)
**NUNCA des una tarea por terminada solo porque terminaste de editar el archivo.** Todo cambio debe pasar por el bucle de verificación en terminal:
1. **Verificación Estática / Compilación:**
   * En proyectos TypeScript / Next.js / Node: Ejecuta comprobación de tipos o validación estática ligera antes del push.
   * En proyectos Rust: Ejecuta `cargo check` o `cargo clippy`.
   * En proyectos Python: Verifica sintaxis/tipos (`ruff`, `mypy` o `pytest`).
2. **Reproducción y Tests:**
   * Si existe una suite de tests (unitarios o Playwright/E2E) relacionada con el módulo modificado, ejecútala.
   * Si es un bug complejo sin test existente, crea un script temporal rápido para probar la entrada/salida, verifica que pase, y bórralo al terminar.
3. **Auto-Corrección Basada en Evidencia:**
   * Si la consola devuelve un error, **NO adivines ni cambies código al azar**. Lee el stack trace completo, formula una **[HIPÓTESIS]** de una línea explicando por qué falló, aplica el parche y vuelve a correr la verificación hasta que la salida sea `0 errores`.

---

## FASE 5: Cierre de Tarea
Solo puedes entregar la respuesta final al usuario cuando el Paso 4 haya dado verde en la consola. Tu mensaje de cierre debe ser directo e incluir únicamente:
1. Resumen conciso de los archivos modificados.
2. Qué comando de verificación corriste y la confirmación de que pasó limpio.
