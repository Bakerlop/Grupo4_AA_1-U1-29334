const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./styles/student-item.css">

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
