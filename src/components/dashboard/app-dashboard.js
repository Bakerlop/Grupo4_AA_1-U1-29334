const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    font-family: system-ui;
    background: #f3f4f6;
    min-height: 100vh;
    padding: 1.5rem;
  }

  .dashboard {
    max-width: 1200px;
    margin: auto;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 3px 20px rgba(0,0,0,0.1);
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1.2fr 1fr;
  }

  header {
    grid-column: 1 / -1;
    margin-bottom: .5rem;
  }

  .status-bar {
    grid-column: 1 / -1;
    background: #e0e7ff;
    padding: .6rem 1rem;
    border-radius: 999px;
    display: flex;
    justify-content: space-between;
    font-size: .9rem;
  }

  @media (max-width: 900px) {
    .dashboard {
      grid-template-columns: 1fr;
    }
  }
</style>

<section class="dashboard">

  <header>
    <h2>Panel de Estudiantes</h2>
    <p>Administración de estudiantes, notas y asistencia</p>
  </header>

  <div class="status-bar">
    <span id="total"></span>
    <span id="selected"></span>
  </div>

  <div>
    <student-form></student-form>
    <student-list></student-list>
  </div>

  <div>
    <grades-panel></grades-panel>
    <attendance-panel></attendance-panel>
  </div>

</section>
`;

export class AppDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // ESTADO GLOBAL
    this.students = [];
    this.selectedStudent = null;
    this.grades = {};
    this.attendance = {};
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('add-student', (e) => this._addStudent(e));
    this.shadowRoot.addEventListener('select-student', (e) => this._selectStudent(e));
    this.shadowRoot.addEventListener('update-grades', (e) => this._updateGrades(e));
    this.shadowRoot.addEventListener('update-attendance', (e) => this._updateAttendance(e));

    this.$total = this.shadowRoot.querySelector('#total');
    this.$selected = this.shadowRoot.querySelector('#selected');

    this._renderStatus();
  }

  _addStudent(event) {
    const student = event.detail;

    this.students.push(student);

    if (!this.selectedStudent) {
      this.selectedStudent = student;
    }

    this.grades[student.id] = {};
    this.attendance[student.id] = { asistencias: 0, faltas: 0 };

    this._updateChildren();
    this._renderStatus();
  }

  _selectStudent(event) {
    const { studentId } = event.detail;
    this.selectedStudent = this.students.find(s => s.id === studentId);

    this._updateChildren();
    this._renderStatus();
  }

  _updateGrades(event) {
    const { studentId, grades } = event.detail;
    this.grades[studentId] = grades;

    this._updateChildren();
  }

  _updateAttendance(event) {
    const { studentId, attendance } = event.detail;
    this.attendance[studentId] = attendance;

    this._updateChildren();
  }

  _updateChildren() {
    const studentList = this.shadowRoot.querySelector('student-list');
    const gradesPanel = this.shadowRoot.querySelector('grades-panel');
    const attendancePanel = this.shadowRoot.querySelector('attendance-panel');

    studentList.students = this.students;
    studentList.selectedStudent = this.selectedStudent;

    if (this.selectedStudent) {
      gradesPanel.student = this.selectedStudent;
      gradesPanel.grades = this.grades[this.selectedStudent.id];

      attendancePanel.student = this.selectedStudent;
      attendancePanel.attendance = this.attendance[this.selectedStudent.id];
    }
  }

  _renderStatus() {
    this.$total.textContent = `Total estudiantes: ${this.students.length}`;
    this.$selected.textContent =
      this.selectedStudent
        ? `Seleccionado: ${this.selectedStudent.name}`
        : "Ninguno seleccionado";
  }
}

customElements.define('app-dashboard', AppDashboard);
