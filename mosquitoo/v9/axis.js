class Axis{
  constructor(name, values){
    this.name = name;
    this.values = [...values];
  }

  toString(){
    return `${this.name}: ${this.values}`;
  }

  asFloats() {
    return this.values.map(v => parseFloat(v));
  }
}
