const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-bottom: 1.5rem;
  }
  h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.3rem;
  }
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
  .add-grade-form {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border: 2px dashed #d1d5db;
  }
  .form-row {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 0.5rem;
    align-items: end;
  }
  input {
    padding: 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
  }
  input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
  }
  .btn-add {
    background: #10b981;
    color: white;
  }
  .btn-add:hover {
    background: #059669;
  }
  .btn-add:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
  .grades-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .average-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .average-label {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 0.3rem;
  }
  .average-value {
    font-size: 2rem;
  }
  .error {
    color: #dc2626;
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }
</style>

<div>
  <h3>📊 Sistema de Notas</h3>
  
  <div id="content"></div>
  
  <div class="add-grade-form">
    <div class="form-row">
      <div>
        <input 
          type="text" 
          id="materia" 
          placeholder="Nombre de la materia"
          maxlength="50"
        />
        <div id="materia-error" class="error"></div>
      </div>
      <div>
        <input 
          type="number" 
          id="nota" 
          placeholder="Nota"
          min="0"
          max="10"
          step="0.1"
        />
        <div id="nota-error" class="error"></div>
      </div>
      <button class="btn-add" id="btn-add">➕ Agregar</button>
    </div>
  </div>
  
  <div id="grades-container">
    <div class="grades-list"></div>
    <div class="average-section" style="display: none;">
      <div class="average-label">PROMEDIO GENERAL</div>
      <div class="average-value">-</div>
    </div>
  </div>
</div>
`;

export class GradesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._student = null;
    this._grades = {};
  }

  connectedCallback() {
    this.$content = this.shadowRoot.querySelector('#content');
    this.$materiaInput = this.shadowRoot.querySelector('#materia');
    this.$notaInput = this.shadowRoot.querySelector('#nota');
    this.$btnAdd = this.shadowRoot.querySelector('#btn-add');
    this.$gradesList = this.shadowRoot.querySelector('.grades-list');
    this.$averageSection = this.shadowRoot.querySelector('.average-section');
    this.$averageValue = this.shadowRoot.querySelector('.average-value');
    this.$materiaError = this.shadowRoot.querySelector('#materia-error');
    this.$notaError = this.shadowRoot.querySelector('#nota-error');

    this.$btnAdd.addEventListener('click', () => this._addGrade());
    this.$materiaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this._addGrade();
    });
    this.$notaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this._addGrade();
    });

    // Limpiar errores al escribir
    this.$materiaInput.addEventListener('input', () => {
      this.$materiaError.textContent = '';
    });
    this.$notaInput.addEventListener('input', () => {
      this.$notaError.textContent = '';
    });

    this._render();
  }

  set student(value) {
    this._student = value;
    this._render();
  }

  set grades(value) {
    this._grades = value || {};
    this._render();
  }

  _addGrade() {
    const materia = this.$materiaInput.value.trim();
    const nota = parseFloat(this.$notaInput.value);

    // Validaciones
    let hasError = false;

    if (!materia) {
      this.$materiaError.textContent = '⚠️ La materia es obligatoria';
      hasError = true;
    }

    if (isNaN(nota)) {
      this.$notaError.textContent = '⚠️ Ingrese una nota válida';
      hasError = true;
    } else if (nota < 0 || nota > 10) {
      this.$notaError.textContent = '⚠️ La nota debe estar entre 0 y 10';
      hasError = true;
    }

    if (hasError) return;

    // Generar ID único
    const id = 'g' + Date.now();
    
    this._grades[id] = {
      id,
      materia,
      nota
    };

    // Limpiar formulario
    this.$materiaInput.value = '';
    this.$notaInput.value = '';
    this.$materiaError.textContent = '';
    this.$notaError.textContent = '';

    this._emitUpdate();
    this._render();
  }

  _editGrade(id, newMateria, newNota) {
    if (this._grades[id]) {
      this._grades[id].materia = newMateria;
      this._grades[id].nota = newNota;
      this._emitUpdate();
      this._render();
    }
  }

  _deleteGrade(id) {
    if (confirm('¿Estás seguro de eliminar esta nota?')) {
      delete this._grades[id];
      this._emitUpdate();
      this._render();
    }
  }

  _emitUpdate() {
    this.dispatchEvent(new CustomEvent('update-grades', {
      detail: {
        studentId: this._student.id,
        grades: this._grades
      },
      bubbles: true,
      composed: true
    }));
  }

  _calculateAverage() {
    const gradesArray = Object.values(this._grades);
    if (gradesArray.length === 0) return 0;
    
    const sum = gradesArray.reduce((acc, g) => acc + g.nota, 0);
    return (sum / gradesArray.length).toFixed(2);
  }

  _render() {
    if (!this._student) {
      this.$content.innerHTML = '<div class="empty-state">👈 Selecciona un estudiante para ver sus notas</div>';
      this.shadowRoot.querySelector('.add-grade-form').style.display = 'none';
      this.shadowRoot.querySelector('#grades-container').style.display = 'none';
      return;
    }

    this.shadowRoot.querySelector('.add-grade-form').style.display = 'block';
    this.shadowRoot.querySelector('#grades-container').style.display = 'block';

    const gradesArray = Object.values(this._grades);

    if (gradesArray.length === 0) {
      this.$gradesList.innerHTML = '<div class="empty-state">📝 No hay notas registradas. ¡Agrega la primera!</div>';
      this.$averageSection.style.display = 'none';
    } else {
      this.$gradesList.innerHTML = '';
      gradesArray.forEach(grade => {
        const gradeItem = document.createElement('grade-item');
        gradeItem.setAttribute('grade-id', grade.id);
        gradeItem.setAttribute('materia', grade.materia);
        gradeItem.setAttribute('nota', grade.nota);
        
        gradeItem.addEventListener('edit-grade', (e) => {
          this._editGrade(e.detail.id, e.detail.materia, e.detail.nota);
        });
        
        gradeItem.addEventListener('delete-grade', (e) => {
          this._deleteGrade(e.detail.id);
        });

        this.$gradesList.appendChild(gradeItem);
      });

      this.$averageSection.style.display = 'block';
      this.$averageValue.textContent = this._calculateAverage();
    }
  }
}

customElements.define('grades-panel', GradesPanel);
