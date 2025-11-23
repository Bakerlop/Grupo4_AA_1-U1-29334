const template = document.createElement('template');
template.innerHTML = `
<style>
  :host { display: block; }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: #fff;
    padding: 0.7rem 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
    transition: 0.12s;
  }
  .item:hover { transform: translateY(-2px); }
  .item.selected { outline: 2px solid #4f46e5; }
  .meta { display: flex; flex-direction: column; }
  .name { font-weight: 700; }
  .course { font-size: 0.9rem; color: #555; }
  .stats { display: flex; gap: 1rem; align-items: center; }
  .stat { font-size: 0.9rem; color: #333; }
</style>

<div class="item" part="item">
  <div class="meta">
    <div class="name" part="name"></div>
    <div class="course" part="course"></div>
  </div>
  <div class="stats">
    <div class="stat" part="avg">Promedio: <span id="avg">-</span></div>
    <div class="stat" part="faltas">Faltas: <span id="faltas">0</span></div>
  </div>
</div>
`;

export class StudentItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._student = null;
    this._avg = null;
    this._faltas = 0;
    this._isSelected = false;

    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.item').addEventListener('click', this._onClick);
    this._render();
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('.item')?.removeEventListener('click', this._onClick);
  }

  set student(val) { this._student = val; this._render(); }
  set avg(val) { this._avg = val; this._render(); }
  set faltas(val) { this._faltas = val; this._render(); }
  set isSelected(val) { this._isSelected = !!val; this._render(); }

  _onClick() {
    if (!this._student) return;
    this.dispatchEvent(new CustomEvent('select-student', {
      detail: { studentId: this._student.id },
      bubbles: true,
      composed: true
    }));
  }

  _render() {
    const nameEl = this.shadowRoot.querySelector('.name');
    const courseEl = this.shadowRoot.querySelector('.course');
    const avgEl = this.shadowRoot.querySelector('#avg');
    const faltasEl = this.shadowRoot.querySelector('#faltas');
    const container = this.shadowRoot.querySelector('.item');

    if (this._student) {
      nameEl.textContent = this._student.name || '-';
      courseEl.textContent = `${this._student.course || ''} ${this._student.parallel ? '- ' + this._student.parallel : ''}`.trim();
    } else {
      nameEl.textContent = '-';
      courseEl.textContent = '';
    }

    avgEl.textContent = (this._avg === null || this._avg === undefined) ? '-' : String(this._avg);
    faltasEl.textContent = String(this._faltas ?? 0);

    if (this._isSelected) container.classList.add('selected'); else container.classList.remove('selected');
  }
}

customElements.define('student-item', StudentItem);
