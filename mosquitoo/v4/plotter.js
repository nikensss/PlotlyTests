class Plotter {
  constructor(ids, layout) {
    this.ids = ids;
    this.layout = layout;
  }

  plot(inputs, outputs) {
    const [xAxis, yAxis] = inputs.axes;
    for (let id of this.ids) {
      let plot = $('#' + id);
      let output = outputs.getByName(plot.attr('data-name'));
      if (!output) {
        return;
      }
      if (plot.hasClass('js-plotly-plot')) {
        this.redraw(id, xAxis, yAxis, output.data);
      } else {
        this.newPlot(id, xAxis, yAxis, output.data);
      }
    }
  }

  newPlot(id, xAxis, yAxis, z) {
    this.layout.title = $('#' + id).attr('data-name');
    this.layout.scene.xaxis.title = xAxis.label;
    this.layout.scene.yaxis.title = yAxis.label;
    Plotly.newPlot(
      id,
      [
        {
          x: xAxis.values.map(v => parseFloat(v)),
          y: yAxis.values.map(v => parseFloat(v)),
          z: z,
          type: 'surface'
        }
      ],
      this.layout
    );
  }

  redraw(id, xAxis, yAxis, z) {
    $('#' + id)[0].data = [
      {
        x: xAxis.values.map(v => parseFloat(v)),
        y: yAxis.values.map(v => parseFloat(v)),
        z: z,
        type: 'surface'
      }
    ];
    $('#' + id)[0].layout.scene.xaxis.title = xAxis.label;
    $('#' + id)[0].layout.scene.yaxis.title = yAxis.label;
    Plotly.redraw(id);
  }
}
