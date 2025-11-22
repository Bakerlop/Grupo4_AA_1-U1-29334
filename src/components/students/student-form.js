const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    margin-bottom: 1rem;
  }

  form {
    background: #ffffff;
    padding: 1rem 1.2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    display: grid;
    gap: 0.8rem;
    animation: fadeIn .3s ease-out;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  input, select {
    width: 100%;
    padding: 0.5rem 0.7rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.9rem;
  }

  input.error, select.error {
    border-color: #e63946;
    background: #ffe5e9;
  }

  .error-msg {
    font-size: 0.8rem;
    color: #e63946;
    margin-top: -4px;
  }

  button {
    padding: 0.55rem 0.9rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s;
  }

  button:hover {
    background: #4338ca;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<form novalidate>
  <div>
    <label>Nombre completo</label>
    <input type="text" id="name" placeholder="Juan Pérez">
    <p class="error-msg" id="err-name"></p>
  </div>

  <div>
    <label>Curso</label>
    <select id="course">
      <option value="">Seleccione...</option>
      <option value="1ro">1ro</option>
      <option value="2do">2do</option>
      <option value="3ro">3ro</option>
    </select>
    <p class="error-msg" id="err-course"></p>
  </div>

  <div>
    <label>Paralelo</label>
    <select id="parallel">
      <option value="">Seleccione...</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>
    <p class="error-msg" id="err-parallel"></p>
  </div>

  <div>
    <label>Correo institucional (opcional)</label>
    <input type="email" id="email" placeholder="correo@institucion.edu">
    <p class="error-msg" id="err-email"></p>
  </div>

  <button type="submit">Registrar estudiante</button>
</form>
`;

export class StudentForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector("form");

    this.$name = this.shadowRoot.querySelector("#name");
    this.$course = this.shadowRoot.querySelector("#course");
    this.$parallel = this.shadowRoot.querySelector("#parallel");
    this.$email = this.shadowRoot.querySelector("#email");

    this.$errName = this.shadowRoot.querySelector("#err-name");
    this.$errCourse = this.shadowRoot.querySelector("#err-course");
    this.$errParallel = this.shadowRoot.querySelector("#err-parallel");
    this.$errEmail = this.shadowRoot.querySelector("#err-email");

    this.form.addEventListener("submit", (e) => this._onSubmit(e));
  }

  _validate() {
    let valid = true;

    // Reset
    this._clearErrors();

    // Nombre: obligatorio y sin números
    const name = this.$name.value.trim();
    if (name.length < 3) {
      this._setError(this.$name, this.$errName, "El nombre es obligatorio");
      valid = false;
    } else if (/\d/.test(name)) {
      this._setError(this.$name, this.$errName, "El nombre no debe contener números");
      valid = false;
    }

    // Curso
    if (!this.$course.value) {
      this._setError(this.$course, this.$errCourse, "Seleccione un curso");
      valid = false;
    }

    // Paralelo
    if (!this.$parallel.value) {
      this._setError(this.$parallel, this.$errParallel, "Seleccione un paralelo");
      valid = false;
    }

    // Email opcional pero debe ser válido
    const email = this.$email.value.trim();
    if (email && !email.includes("@")) {
      this._setError(this.$email, this.$errEmail, "Correo inválido");
      valid = false;
    }

    return valid;
  }

  _setError(input, msgElement, message) {
    input.classList.add("error");
    msgElement.textContent = message;
  }

  _clearErrors() {
    [this.$name, this.$course, this.$parallel, this.$email]
      .forEach(i => i.classList.remove("error"));

    [this.$errName, this.$errCourse, this.$errParallel, this.$errEmail]
      .forEach(e => e.textContent = "");
  }

  _onSubmit(e) {
    e.preventDefault();

    if (!this._validate()) return;

    const student = {
      id: crypto.randomUUID(),
      name: this.$name.value.trim(),
      course: this.$course.value.trim(),
      parallel: this.$parallel.value.trim(),
      email: this.$email.value.trim()
    };

    // Emitir evento al dashboard
    this.dispatchEvent(new CustomEvent("add-student", {
      detail: student,
      bubbles: true,
      composed: true
    }));

    this.form.reset();
  }
}

customElements.define("student-form", StudentForm);
