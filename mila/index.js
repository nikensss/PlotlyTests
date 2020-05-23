function plot() {
  var graphDiv = document.getElementById('plot');
  const x = [];
  const C = [];
  const D = [];
  const B = [];
  const A = [];
  const max = 1000;
  const timeStep = ($('#freq').val() / 1000) * 0.01;
  $('#freqValue').text(timeStep);
  const amplitude = 100;
  const inclineScale = (5 / 2) * 100;

  for (let i = 0; i < max; i += 1) {
    x.push(i);
    C.push(amplitude * Math.sin(i * timeStep + Math.PI / 2) + (inclineScale * i) / max);
    D.push(amplitude * Math.sin(i * timeStep - Math.PI / 2) + (inclineScale * i) / max);
    B.push((C[C.length - 1] + D[D.length - 1]) / 2);
    A.push(2 * amplitude - B[B.length - 1]);

    if (A[A.length - 1] <= 0) {
      break;
    }
  }

  var data = [
    {
      x,
      y: C,
      type: 'scatter',
      name: 'C'
    },
    {
      x,
      y: D,
      type: 'scatter',
      name: 'D'
    },
    {
      x,
      y: B,
      type: 'scatter',
      name: 'B'
    },
    {
      x,
      y: A,
      type: 'scatter',
      name: 'A'
    }
  ];

  var layout = {
    title: 'Rope',
    xaxis: {
      title: 'time',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Position',
      showline: false
    },
    height: 800
  };
  Plotly.newPlot(graphDiv, data, layout);
}

$(document).ready(() => {
  console.log('Ready!');
  plot();

  setTimeout(function () {
    $('#freq').val(1);
    $('#update').click();
    let direction = 1;
    const startingDelta = 1;
    let delta = startingDelta;
    setInterval(function () {
      const v = parseInt($('#freq').val());
      if (v >= 1000 || v <= 0) {
        direction = -direction;
        delta = startingDelta;
      }
      $('#freq').val(v + delta * direction);
      $('#update').click();
    }, 3);
  }, 1500);
});

// A = 100 -
