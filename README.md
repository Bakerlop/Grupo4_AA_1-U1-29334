#  Panel de Estudiantes – Notas y Asistencia

## i. Descripción

Esta aplicación es una **Single Page Application (SPA)** desarrollada completamente con **Web Components nativos**, sin frameworks externos.

El sistema permite gestionar:
- 👨‍🎓 Estudiantes
- 📊 Notas
- ✅ Asistencia

Todo está construido usando:
- Custom Elements
- Shadow DOM
- Comunicación entre componentes con eventos personalizados
- Manejo de estado centralizado desde un componente contenedor

La aplicación sigue una arquitectura modular, escalable y con componentes reutilizables.

---

## ii. Arquitectura de Componentes

El proyecto se basa en un componente contenedor principal:

### 🔷 Componente principal:
- `<app-dashboard>`  
  Controla:
  - Estado global
  - Navegación
  - Comunicación entre componentes

###  Componentes funcionales:

| Componente | Función |
|------------|---------|
| `<student-form>` | Registro de estudiantes |
| `<student-list>` | Muestra la lista de estudiantes |
| `<student-item>` | Representa un estudiante individual |
| `<grades-panel>` | Gestión de notas |
| `<grade-item>` | Representa una nota |
| `<attendance-panel>` | Gestión de asistencia |

---

## iii. Diagrama de Comunicación entre Componentes

Flujo de comunicación:
   <student-form>
                 |
              add-student
                 ↓
┌──────────────────────────────────────┐
│ <app-dashboard> │
│ (Estado global + Orquestación) │
└───────────┬──────────────┬──────────┘
│ │
select-student update-attendance
│ │
↓ ↓
<student-list> <attendance-panel>
│ ↑
↓ │
<student-item> │
│
update-grades
↑
<grades-panel>

---

### Tipos de comunicación:

✅ Hijo → Padre → `dispatchEvent(new CustomEvent())`  
✅ Padre → Hijo → Propiedades públicas (`element.prop = data`)

Eventos principales:
- `add-student`
- `select-student`
- `update-grades`
- `update-attendance`

---

## iv. Integrantes y Roles

| Integrante | Rol |
|---------|------|
| Integrante 1 |Fabricio Fernando Baquero López| Arquitectura general y AppDashboard |
| Integrante 2 |Javier Neicer Bravo Meza| Formulario y registro de estudiantes |
| Integrante 3 |Pablo Leonardo Defaz Arequipa| Lista y visualización de estudiantes |
| Integrante 4 |Miguel Angel Morocho Pilataxi| Gestión de notas |
| Integrante 5 |Angie Nicole Alvarado Alcivar| Sistema de asistencia |

---

---

### Tipos de comunicación:

✅ Hijo → Padre → `dispatchEvent(new CustomEvent())`  
✅ Padre → Hijo → Propiedades públicas (`element.prop = data`)

Eventos principales:
- `add-student`
- `select-student`
- `update-grades`
- `update-attendance`

---

## iv. Integrantes y Roles

| Integrante | Rol |
|---------|------|
| Integrante 1 | Fabricio Fernando Baquero López |Arquitectura general y AppDashboard |
| Integrante 2 | Javier Neicer Bravo Meza |Formulario y registro de estudiantes |
| Integrante 3 | Lista y visualización de estudiantes |Lista y visualización de estudiantes |
| Integrante 4 | Miguel Angel Morocho Pilataxi |Gestión de notas |
| Integrante 5 | Angie Nicole Alvarado Alcivar |Sistema de asistencia |

---
### Rol del Integrante 1 (Líder técnico / AppShell) - Fabricio Fernando Baquero López
- Diseñar la arquitectura del proyecto.
- Crear y mantener <app-dashboard>.
- Gestionar el estado global (estudiantes, notas y asistencia).
- Conectar y coordinar todos los componentes.

### Rol del Integrante 2 (Formulario de estudiantes) - Javier Neicer Bravo Meza
- Diseñar y programar <student-form>.
- Implementar validaciones de datos.
- Emitir eventos para registrar estudiantes.
- Apoyar en mejoras de experiencia de usuario.

### Rol del Integrante 3 (Lista y visualización de estudiantes) - Pablo Leonardo Defaz Arequipa
- Crear <student-list> y <student-item>.
- Mostrar información de estudiantes.
- Permitir la selección de estudiantes.
- Emitir eventos al AppDashboard.

### Rol del Integrante 4 (Sistema de notas) - Miguel Angel Morocho Pilataxi
- Programar <grades-panel> y <grade-item>.
- Gestionar agregar, editar y eliminar notas.
- Calcular y mostrar promedios.
- Comunicar cambios al contenedor.

### Rol del Integrante 5 (Asistencia) - Angie Nicole Alvarado Alcivar:
- Implementación del componente `<attendance-panel>`
- Comunicación con AppDashboard mediante eventos
- Manejo de estadísticas de asistencia
- UX del módulo de asistencia

---

## v. Instrucciones para Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Bakerlop/Grupo4_AA_1-U1-29334.git
cd REPOSITORIO
---
