const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./styles/student-list.css">
<div class="list" part="list"></div>
`;

export class StudentList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._students = [];
    this._selectedStudent = null;
    this._grades = {};
    this._attendance = {};
  }

  connectedCallback() {
    this.$list = this.shadowRoot.querySelector('.list');
    this._render();
  }

  set students(val) {
    this._students = Array.isArray(val) ? val : [];
    this._render();
  }

  get students() { return this._students; }

  set selectedStudent(val) {
    this._selectedStudent = val;
    this._render();
  }

  set grades(val) {
    this._grades = val || {};
    this._render();
  }

  set attendance(val) {
    this._attendance = val || {};
    this._render();
  }

  _computeAvg(gradesObj) {
    if (!gradesObj) return null;
    const values = Object.values(gradesObj).filter(v => typeof v === 'number');
    if (values.length === 0) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    return +(sum / values.length).toFixed(2);
  }

  _render() {
    if (!this.$list) return;

    this.$list.innerHTML = '';

    if (!this._students || this._students.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No hay estudiantes registrados.';
      this.$list.appendChild(empty);
      return;
    }

    this._students.forEach(student => {
      const item = document.createElement('student-item');
      const avg = this._computeAvg(this._grades[student.id]);
      const faltas = this._attendance[student.id]?.faltas ?? 0;

      item.student = student;
      item.avg = avg;
      item.faltas = faltas;
      item.isSelected = !!(this._selectedStudent && this._selectedStudent.id === student.id);

      this.$list.appendChild(item);
    });
  }
}

customElements.define('student-list', StudentList);
