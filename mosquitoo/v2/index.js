window.onload = function() {
  const pulseWidths = [500e-9, 600e-9, 700e-9, 800e-9, 900e-9, 1e-6]; //6.0
  const stepperPositions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]; //10.0
  const attempts = 10;

  const dataFilter = new DataFilter(data);
  const layout = {
    title: 'Measured pulse amplitude',
    scene: {
      camera: { eye: { x: -0.55, y: -1.5, z: 1.7 } },
      xaxis: { title: 'Stepper position' },
      yaxis: { title: 'Pulse width' }
    },
    width: window.innerWidth * 0.45,
    height: window.innerHeight * 0.88,
    autosize: true,
    xaxis: {
      title: ''
    },
    yaxis: {
      title: ''
    }
  };
  const plotter = new Plotter(['plot-amplitude', 'plot-pw'], layout);

  const layoutPulseAmplitude = {
    title: 'Measured pulse amplitude',
    scene: {
      camera: { eye: { x: -0.55, y: -1.5, z: 1.7 } },
      xaxis: { title: 'Stepper position' },
      yaxis: { title: 'Pulse width' }
    },
    width: window.innerWidth * 0.45,
    height: window.innerHeight * 0.88,
    autosize: true,
    xaxis: {
      title: 'Stepper position'
    },
    yaxis: {
      title: 'Pulse width'
    }
  };
  const layoutPulseWidth = Object.assign({}, layoutPulseAmplitude);
  layoutPulseWidth.title = 'Measured pulse width';

  console.log(data.length);
  const settings = {
    currentPercentage: 'Current Percentage',
    pulseWidth: 'Pulse width',
    stepperPosition: 'Stepper position'
  };

  function btnTargetClick() {
    //highlight in green the currently selected button
    $('.btn-target').removeClass('btn-success');
    $(this)
      .addClass('btn-success')
      .trigger('active')
      .trigger('focus');

    const chosenSetting = $('.dropdown-toggle').attr('data-setting');
    const currentSettingValue = $(this).attr('data-target-int');
    console.log(`Clicked button ${chosenSetting}: ${currentSettingValue}`);
    const [yAxis, xAxis] = Object.keys(settings).filter(v => v !== chosenSetting);
    const [xValues, yValues] = [dataFilter.getUnique(xAxis), dataFilter.getUnique(yAxis)];
    console.log(xAxis + ': ' + xValues);
    console.log(yAxis + ': ' + yValues);
    //we get all the data for the current value of the selected setting
    const firstFilter = dataFilter.get(chosenSetting, currentSettingValue);

    const [pulseAmplitudes, pulseWidths] = [[], []];
    let secondFilter, thirdFilter, element, accPA, accPW;
    for (let y = 0; y < yValues.length; y++) {
      [pulseAmplitudes[y], pulseWidths[y]] = [[], []];
      secondFilter = firstFilter.get(yAxis, yValues[y]);
      for (let x = 0; x < xValues.length; x++) {
        [accPA, accPW] = [0, 0];
        thirdFilter = secondFilter.get(xAxis, xValues[x]);
        for (let a = 0; a < attempts; a++) {
          element = thirdFilter.get('attempt', a.toString()).getSingle();
          accPA += element.measuredAmplitude;
          accPW += element.measuredPulseWidth;
        }
        pulseAmplitudes[y].push(accPA / attempts);
        pulseWidths[y].push(accPW / attempts);
      }
    }

    plotter.plot(settings[xAxis], xValues, settings[yAxis], yValues, [
      pulseAmplitudes,
      pulseWidths
    ]);
  }

  $('.btn-previous').click(function() {
    const selected = $('.btn-success');
    const target = $(".btn-target[data-target-int='" + selected.attr('data-target-previous') + "'");
    if (target) {
      target.click();
    }
  });

  $('.btn-next').click(function() {
    const selected = $('.btn-success');
    const target = $(".btn-target[data-target-int='" + selected.attr('data-target-next') + "'");
    if (target) {
      target.click();
    }
  });

  $(document).keyup(function(e) {
    if (e.which === 37) {
      $('.btn-previous').click();
    } else if (e.which === 39) {
      $('.btn-next').click();
    }
  });

  $('.dropdown-button').click(function(e) {
    console.log('Using ' + $(this).attr('data-setting'));
    const chosenSetting = $(this).attr('data-setting');
    $('.dropdown-toggle').text(settings[chosenSetting]);
    $('.dropdown-toggle').attr('data-setting', chosenSetting);
    const buttons = dataFilter.getUnique(chosenSetting);

    //remove all buttons from buttons-banner
    $('.btn-target').remove();
    const btnNext = $('.btn-next');
    //add the buttons needed to move through the values of the chosen setting
    buttons.forEach((v, i, a) => {
      const b = buttonMarkUp(i === 0, v, a[i - 1], a[i + 1]);
      $(b).insertBefore(btnNext);
    });

    $('.btn-target').click(btnTargetClick);
    $('.btn-success').click();
  });

  $(".dropdown-button[data-setting='currentPercentage']").click();
};

function buttonMarkUp(isFirst, dataTargetInt, dataTargetPrevious = '', dataTargetNext = '') {
  return (
    '<button class="btn btn-primary btn-target ' +
    (isFirst ? 'btn-success' : '') +
    '" data-target="target' +
    dataTargetInt +
    '" data-target-previous="' +
    dataTargetPrevious +
    '" data-target-next="' +
    dataTargetNext +
    '" data-target-int="' +
    dataTargetInt +
    '">' +
    dataTargetInt +
    '</button>'
  );
}
