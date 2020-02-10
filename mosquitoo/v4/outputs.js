class Outputs {
  constructor(names, data) {
    this._outputs = names.map(n => {
      return {
        name: n,
        data: [],
        acc: []
      };
    });
    this._dataFilter = new DataFilter(data);
  }

  resetAccumulators() {
    this._outputs.forEach(e => (e.acc = []));
  }

  flush() {
    this._outputs.forEach(e => e.data.last().push(e.acc.average()));
  }

  newRow() {
    this._outputs.forEach(e => e.data.push([]));
  }

  accumulate(measurements) {
    this._outputs.forEach(output =>
      output.acc.push(
        measurements.map(measurement => parseFloat(measurement[output.name])).average()
      )
    );
  }

  getByName(name) {
    return this._outputs.find(e => e.name === name);
  }

  reset() {
    this._outputs.forEach(e => (e.data = []));
  }

  update(inputs) {
    const firstFilter = this._dataFilter.get(inputs.fixedInput.name, inputs.fixedInput.value);
    const [xAxis, yAxis] = inputs.axes;
    let secondFilter, thirdFilter, attempt;
    for (let y = 0; y < yAxis.values.length; y++) {
      this.newRow(); //push a new array for each measredVariable
      secondFilter = firstFilter.get(yAxis.label, yAxis.values[y]);
      for (let x = 0; x < xAxis.values.length; x++) {
        this.resetAccumulators();
        thirdFilter = secondFilter.get(xAxis.label, xAxis.values[x]);
        for (let a = 0; a < thirdFilter.length; a++) {
          attempt = thirdFilter.get('attempt', a.toString()).all();
          this.accumulate(attempt);
        }
        this.flush(); //push the accumulators
      }
    }
  }
}
