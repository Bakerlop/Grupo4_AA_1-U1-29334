class AttendancePanel extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._student = null;
    this._attendance = { asistencias: 0, faltas: 0, atrasos: 0 };
  }

  set student(value) {
    this._student = value;
    this.render();
  }

  set attendance(value) {
    this._attendance = value || { asistencias: 0, faltas: 0, atrasos: 0 };
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  _register(type) {
    if (!this._student) return;

    if (type === "asistencia") this._attendance.asistencias++;
    if (type === "falta") this._attendance.faltas++;
    if (type === "atraso") this._attendance.atrasos++;

    this.dispatchEvent(new CustomEvent("update-attendance", {
      detail: {
        studentId: this._student.id,
        attendance: this._attendance
      },
      bubbles: true,
      composed: true
    }));

    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    if (!this._student) {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./styles/attendance-panel.css">
        <p>Seleccione un estudiante para gestionar asistencia</p>
      `;
      return;
    }

    const { asistencias, faltas, atrasos } = this._attendance;

    const total = asistencias + faltas + atrasos;
    const porcentaje = total > 0 ? ((asistencias / total) * 100).toFixed(1) : 0;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./styles/attendance-panel.css">

      <div class="panel">
        <h3>Asistencia de ${this._student.name}</h3>

        <div class="buttons">
          <button class="ok" id="btnOk">✅ Presente</button>
          <button class="fail" id="btnFail">❌ Falta</button>
          <button class="late" id="btnLate">⏱️ Atraso</button>
        </div>

        <div class="stats">
          Asistencias: ${asistencias} <br>
          Faltas: ${faltas} <br>
          Atrasos: ${atrasos} <br>
          Total: ${total} <br>
          📊 % Asistencia: ${porcentaje}%
        </div>
      </div>
    `;

    this.shadowRoot.getElementById("btnOk")
      .onclick = () => this._register("asistencia");

    this.shadowRoot.getElementById("btnFail")
      .onclick = () => this._register("falta");

    this.shadowRoot.getElementById("btnLate")
      .onclick = () => this._register("atraso");
  }
}

customElements.define("attendance-panel", AttendancePanel);
