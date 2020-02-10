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
      .filter(i => i.name !== this.fixedInput)
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
    if (this._inputs.some(i => i.name === name)) {
      this.fixedInput.name = name;
      if (value) {
        this.fixedInput.value = value;
      } else {
        this.fixedInput.value = this._inputs.find(i => i.name === name)[0]
      }
      return;
    }
    throw new Error(`No input with given name: ${name}`);
  }
}
