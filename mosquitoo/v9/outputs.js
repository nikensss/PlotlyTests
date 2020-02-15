class Outputs {
  constructor(names, data) {
    this._outputs = names.map(name => {
      return new Output(name);
    });
    this._dataFilter = new DataFilter(data);
    console.log(`Total outputs: ${this._outputs.length}`);
  }

  resetAccumulators() {
    this._outputs.forEach(output => output.resetAccumulators());
  }

  flush() {
    this._outputs.forEach(output => output.flush());
  }

  newRow() {
    this._outputs.forEach(output => output.newRow());
  }

  accumulate(attempts) {
    this._outputs.forEach(output => output.accumulate(attempts));
  }

  getByName(name) {
    return this._outputs.find(output => output.name === name);
  }

  reset() {
    this._outputs.forEach(output => output.reset());
  }

  update(inputs) {
    const firstFilter = this._dataFilter.get(inputs.fixedInput.name, inputs.fixedInput.value);
    const [xAxis, yAxis] = inputs.axes;
    let secondFilter, thirdFilter, attempts;
    for (let y = 0; y < yAxis.values.length; y++) {
      this.newRow(); //push a new array for each measredVariable
      secondFilter = firstFilter.get(yAxis.name, yAxis.values[y]);
      for (let x = 0; x < xAxis.values.length; x++) {
        this.resetAccumulators();
        thirdFilter = secondFilter.get(xAxis.name, xAxis.values[x]);
        for (let a = 0; a < thirdFilter.getUnique('attempt').length; a++) {
          attempts = thirdFilter.get('attempt', a.toString()).all();
          this.accumulate(attempts);
        }
        this.flush(); //store the data
      }
    }
  }
}
