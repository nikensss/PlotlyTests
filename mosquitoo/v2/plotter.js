class Plotter {
  constructor(ids, layout) {
    this.ids = ids;
    this.layout = layout;
  }

  plot(xLabel, x, yLabel, y, data) {
    for (let id of this.ids) {
      if ($('#' + id).hasClass('js-plotly-plot')) {
        this.redraw(id, xLabel, x, yLabel, y, data[this.ids.indexOf(id)]);
      } else {
        this.newPlot(id, xLabel, x, yLabel, y, data[this.ids.indexOf(id)]);
      }
    }
  }

  newPlot(id, xLabel, x, yLabel, y, z) {
    this.layout.scene.xaxis.title = xLabel;
    this.layout.scene.yaxis.title = yLabel;
    Plotly.newPlot(
      id,
      [
        {
          x: x.map(v => parseFloat(v)),
          y: y.map(v => parseFloat(v)),
          z: z,
          type: 'surface'
        }
      ],
      this.layout
    );
  }

  redraw(id, xLabel, x, yLabel, y, z) {
    $('#' + id)[0].data = [
      {
        x: x.map(v => parseFloat(v)),
        y: y.map(v => parseFloat(v)),
        z: z,
        type: 'surface'
      }
    ];
    $('#' + id)[0].layout.scene.xaxis.title = xLabel;
    $('#' + id)[0].layout.scene.yaxis.title = yLabel;
    Plotly.redraw(id);
  }
}
