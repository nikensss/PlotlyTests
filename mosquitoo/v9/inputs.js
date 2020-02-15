class Inputs {
  constructor(inputs) {
    this._inputs = [...inputs];
    this._fixedInput = {
      name: '',
      value: null
    };
  }

  get fixedInputValues() {
    return this._inputs.find(e => e.name === this.fixedInput.name);
  }

  getValuesOf(name){
    return [...this._inputs.find(i => i.name === name).values];
  }

  get axes() {
    if (this.fixedInput.name === '') {
      throw new Error('No input is fixed');
    }

    return this._inputs
      .filter(i => i.name !== this.fixedInput.name)
      .map(i => new Axis(i.name, i.values));
  }

  get names() {
    return this._inputs.map(v => v.name);
  }

  get fixedInput() {
    return this._fixedInput;
  }

  /**
   * @param {string} inputName
   */
  fixInput({ name, value }) {
    const input = this._inputs.find(i => i.name === name);
    if (input) {
      this.fixedInput.name = name;
      if (value && input.values.includes(value)) {
        this.fixedInput.value = value;
      } else {
        this.fixedInput.value = this._inputs.find(i => i.name === name)[0]
      }
      return;
    }
    throw new Error(`No input with given name: ${name}`);
  }
}
