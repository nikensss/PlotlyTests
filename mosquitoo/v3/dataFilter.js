class DataFilter {
  constructor(data){
    this.data = data;
  }

  get(parameter, value){
    return new DataFilter(this.data.filter(v => v[parameter] === value));
  }

  getSingle(){
    if (this.length > 1){
      throw new Error(`There is more than one element. Total length: ${this.length}.`);
    }

    return this.data[0];
  }

  getUnique(parameter){
    return this.data.map(e => e[parameter]).filter((v,i,a) => a.indexOf(v) === i);
  }

  get length(){
    return this.data.length;
  }

  all(){
    return this.data;
  }
}
