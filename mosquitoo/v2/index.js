window.onload = function() {
  const dataFilter = new DataFilter(data);
  const attempts = Math.max.apply(null, dataFilter.getUnique('attempt'));
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

  console.log(data.length);
  const settings = {
    currentPercentage: 'Current Percentage',
    pulseWidth: 'Pulse width',
    stepperPosition: 'Stepper position'
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

  function btnTargetClick() {
    //highlight in green the currently selected button
    $('.btn-target').removeClass('btn-success');
    $(this)
      .addClass('btn-success')
      .trigger('active')
      .trigger('focus');

    const chosenSetting = $('.dropdown-toggle').attr('data-setting');
    const currentSettingValue = $(this).attr('data-target-int');
    console.log(`${chosenSetting}: ${currentSettingValue}`);
    const [yAxis, xAxis] = Object.keys(settings).filter(v => v !== chosenSetting);
    const [xValues, yValues] = [dataFilter.getUnique(xAxis), dataFilter.getUnique(yAxis)];
    console.log(xAxis + ': ' + xValues);
    console.log(yAxis + ': ' + yValues);
    //we get all the data for the current value of the selected setting

    const [pulseAmplitudes, pulseWidths] = [[], []];
    const firstFilter = dataFilter.get(chosenSetting, currentSettingValue);
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
    console.log('Plot finished!');
    console.log('');
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
    //add the buttons needed to move through the values of the chosen setting
    buttons.forEach((v, i, a) => {
      const b = buttonMarkUp(i === 0, v, a[i - 1], a[i + 1]);
      $(b).insertBefore($('.btn-next'));
    });

    $('.btn-target').click(btnTargetClick);
    $('.btn-success').click();
  });

  //initiliase the plots
  $(".dropdown-button[data-setting='currentPercentage']").click();
};
