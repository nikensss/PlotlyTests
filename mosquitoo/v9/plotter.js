class Plotter {
  constructor(ids, layout) {
    this.ids = ids;
    this.layout = layout;
  }

  plot(inputs, outputs) {
    const [xAxis, yAxis] = inputs.axes;
    console.log(`Axes: ${xAxis.name} and ${yAxis.name}`);
    for (let id of this.ids) {
      let plot = $('#' + id);
      let output = outputs.getByName(plot.attr('data-name'));
      if (!output) {
        console.error('No output found with name ' + plot.attr('data-name'));
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
    this.layout.scene.xaxis.title = xAxis.name;
    this.layout.scene.yaxis.title = yAxis.name;
    Plotly.newPlot(
      id,
      [
        {
          x: xAxis.asFloats(),
          y: yAxis.asFloats(),
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
        x: xAxis.asFloats(),
        y: yAxis.asFloats(),
        z: z,
        type: 'surface'
      }
    ];
    $('#' + id)[0].layout.scene.xaxis.title = xAxis.name;
    $('#' + id)[0].layout.scene.yaxis.title = yAxis.name;
    Plotly.redraw(id);
  }
}
