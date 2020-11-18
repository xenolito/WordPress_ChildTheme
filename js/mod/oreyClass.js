class Car {
  constructor(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
    this._userGears = ["P", "N", "R", "D"];
    this._userGear = this._userGears[0];
  }

  get userGear() {
    return this._userGear;
  }
  set userGear(gear) {
    if (this._userGears.indexOf(gear) < 0)
      throw new Error(`Marcha no válida: ${gear}`);
    this._userGear = gear;
    console.log("marcha cambiada a: " + this._userGear);
  }

  ponMarcha(gear) {
    this.userGear = gear;
  }
}

export { Car };
