class Axis{
  constructor(label, values){
    this.label = label;
    this.values = values;
  }

  toString(){
    return `${this.label}: ${this.values}`;
  }
}