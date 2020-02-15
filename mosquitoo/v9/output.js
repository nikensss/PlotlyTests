const METHODS = {
  max: 'max',
  average: 'average',
  min: 'min'
};

class Output {
  constructor(name) {
    if (!name) {
      throw new Error('Illegal value for name: must be defined!');
    }
    this._name = name;
    this._data = [];
    this._acc = [];
  }

  get name() {
    return this._name;
  }

  get data() {
    return this._data;
  }

  accumulate(attempts) {
    const val = attempts.map(a => a[this.name]);
    const method = $('.btn-method.btn-success').attr('data-method');
    if (METHODS[method]) {
      this._acc.push(val[method]());
      return;
    }
    throw new Error('Invalid method!');
  }

  newRow() {
    this._data.push([]);
  }

  flush() {
    const method = $('.btn-method.btn-success').attr('data-method');
    if (METHODS[method]) {
      this._data.last().push(this._acc[method]());
      return;
    }
    throw new Error('Invalid method!');
  }

  resetAccumulators() {
    this._acc = [];
  }

  reset() {
    this._data = [];
  }
}
