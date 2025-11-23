const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
  }
  .grade-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 1rem;
    align-items: center;
    transition: all 0.2s;
  }
  .grade-card:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
  }
  .materia {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
  }
  .nota-display {
    text-align: center;
  }
  .nota-badge {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.1rem;
    min-width: 60px;
  }
  .nota-badge.excelente {
    background: #d1fae5;
    color: #065f46;
  }
  .nota-badge.bueno {
    background: #dbeafe;
    color: #1e40af;
  }
  .nota-badge.regular {
    background: #fef3c7;
    color: #92400e;
  }
  .nota-badge.insuficiente {
    background: #fee2e2;
    color: #991b1b;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.5rem 0.8rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }
  .btn-edit {
    background: #dbeafe;
    color: #1e40af;
  }
  .btn-edit:hover {
    background: #bfdbfe;
  }
  .btn-delete {
    background: #fee2e2;
    color: #991b1b;
  }
  .btn-delete:hover {
    background: #fecaca;
  }
  .btn-save {
    background: #10b981;
    color: white;
  }
  .btn-save:hover {
    background: #059669;
  }
  .btn-cancel {
    background: #e5e7eb;
    color: #4b5563;
  }
  .btn-cancel:hover {
    background: #d1d5db;
  }
  .edit-mode {
    background: #f0f9ff;
    border-color: #3b82f6;
  }
  input {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    width: 100%;
    font-family: inherit;
  }
  input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .error {
    color: #dc2626;
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }
</style>

<div class="grade-card" id="card">
  <div class="materia-section">
    <div class="materia" id="materia-display"></div>
    <input type="text" id="materia-edit" style="display: none;" />
    <div id="materia-error" class="error"></div>
  </div>
  
  <div class="nota-display">
    <span class="nota-badge" id="nota-display"></span>
    <input type="number" id="nota-edit" style="display: none;" min="0" max="10" step="0.1" />
    <div id="nota-error" class="error"></div>
  </div>
  
  <div class="actions" id="actions-view">
    <button class="btn-edit" id="btn-edit" title="Editar">✏️</button>
    <button class="btn-delete" id="btn-delete" title="Eliminar">🗑️</button>
  </div>
  
  <div class="actions" id="actions-edit" style="display: none;">
    <button class="btn-save" id="btn-save" title="Guardar">💾</button>
    <button class="btn-cancel" id="btn-cancel" title="Cancelar">❌</button>
  </div>
</div>
`;

export class GradeItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._isEditing = false;
  }

  static get observedAttributes() {
    return ['grade-id', 'materia', 'nota'];
  }

  connectedCallback() {
    this.$card = this.shadowRoot.querySelector('#card');
    this.$materiaDisplay = this.shadowRoot.querySelector('#materia-display');
    this.$materiaEdit = this.shadowRoot.querySelector('#materia-edit');
    this.$notaDisplay = this.shadowRoot.querySelector('#nota-display');
    this.$notaEdit = this.shadowRoot.querySelector('#nota-edit');
    this.$actionsView = this.shadowRoot.querySelector('#actions-view');
    this.$actionsEdit = this.shadowRoot.querySelector('#actions-edit');
    this.$btnEdit = this.shadowRoot.querySelector('#btn-edit');
    this.$btnDelete = this.shadowRoot.querySelector('#btn-delete');
    this.$btnSave = this.shadowRoot.querySelector('#btn-save');
    this.$btnCancel = this.shadowRoot.querySelector('#btn-cancel');
    this.$materiaError = this.shadowRoot.querySelector('#materia-error');
    this.$notaError = this.shadowRoot.querySelector('#nota-error');

    this.$btnEdit.addEventListener('click', () => this._enterEditMode());
    this.$btnDelete.addEventListener('click', () => this._deleteGrade());
    this.$btnSave.addEventListener('click', () => this._saveGrade());
    this.$btnCancel.addEventListener('click', () => this._cancelEdit());

    // Enter para guardar
    this.$materiaEdit.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this._saveGrade();
    });
    this.$notaEdit.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this._saveGrade();
    });

    // Limpiar errores al escribir
    this.$materiaEdit.addEventListener('input', () => {
      this.$materiaError.textContent = '';
    });
    this.$notaEdit.addEventListener('input', () => {
      this.$notaError.textContent = '';
    });

    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  _enterEditMode() {
    this._isEditing = true;
    this.$materiaEdit.value = this.getAttribute('materia');
    this.$notaEdit.value = this.getAttribute('nota');
    this._render();
    this.$materiaEdit.focus();
  }

  _cancelEdit() {
    this._isEditing = false;
    this.$materiaError.textContent = '';
    this.$notaError.textContent = '';
    this._render();
  }

  _saveGrade() {
    const materia = this.$materiaEdit.value.trim();
    const nota = parseFloat(this.$notaEdit.value);

    // Validaciones
    let hasError = false;

    if (!materia) {
      this.$materiaError.textContent = '⚠️ La materia no puede estar vacía';
      hasError = true;
    }

    if (isNaN(nota)) {
      this.$notaError.textContent = '⚠️ Ingrese una nota válida';
      hasError = true;
    } else if (nota < 0 || nota > 10) {
      this.$notaError.textContent = '⚠️ Nota entre 0 y 10';
      hasError = true;
    }

    if (hasError) return;

    this.dispatchEvent(new CustomEvent('edit-grade', {
      detail: {
        id: this.getAttribute('grade-id'),
        materia,
        nota
      },
      bubbles: true,
      composed: true
    }));

    this._isEditing = false;
    this.$materiaError.textContent = '';
    this.$notaError.textContent = '';
  }

  _deleteGrade() {
    this.dispatchEvent(new CustomEvent('delete-grade', {
      detail: {
        id: this.getAttribute('grade-id')
      },
      bubbles: true,
      composed: true
    }));
  }

  _getNotaClass(nota) {
    if (nota >= 9) return 'excelente';
    if (nota >= 7) return 'bueno';
    if (nota >= 5) return 'regular';
    return 'insuficiente';
  }

  _render() {
    const materia = this.getAttribute('materia') || '';
    const nota = parseFloat(this.getAttribute('nota')) || 0;

    if (this._isEditing) {
      this.$card.classList.add('edit-mode');
      this.$materiaDisplay.style.display = 'none';
      this.$materiaEdit.style.display = 'block';
      this.$notaDisplay.style.display = 'none';
      this.$notaEdit.style.display = 'block';
      this.$actionsView.style.display = 'none';
      this.$actionsEdit.style.display = 'flex';
    } else {
      this.$card.classList.remove('edit-mode');
      this.$materiaDisplay.textContent = materia;
      this.$materiaDisplay.style.display = 'block';
      this.$materiaEdit.style.display = 'none';
      
      this.$notaDisplay.textContent = nota.toFixed(1);
      this.$notaDisplay.className = 'nota-badge ' + this._getNotaClass(nota);
      this.$notaDisplay.style.display = 'inline-block';
      this.$notaEdit.style.display = 'none';
      
      this.$actionsView.style.display = 'flex';
      this.$actionsEdit.style.display = 'none';

      // Limpiar errores
      this.$materiaError.textContent = '';
      this.$notaError.textContent = '';
    }
  }
}

customElements.define('grade-item', GradeItem);
