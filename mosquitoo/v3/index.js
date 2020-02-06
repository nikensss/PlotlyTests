window.onload = function() {
  Array.prototype.average = function() {
    return this.reduce((t, c) => t + c, 0) / this.length;
  };
  const measurementVariables = {
    currentPercentage: [],
    stepperPosition: [],
    pulseWidth: []
  };
  for (const key in measurementVariables) {
    if (measurementVariables.hasOwnProperty(key)) {
      measurementVariables[key] = data.map(v => v[key]).filter((v,i,a) => a.indexOf(v) === i);
    }
  }
  const dataFilter = new DataFilter(data);
  const attempts = Math.max.apply(
    null,
    dataFilter
      .getUnique('attempt')
      .filter(v => v !== 'null')
      .map(v => parseInt(v))
  );
  console.log('Attempts: ' + attempts);
  const layout = {
    title: '',
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
    const [yAxis, xAxis] = Object.keys(measurementVariables).filter(v => v !== chosenSetting);
    const [xValues, yValues] = [measurementVariables[xAxis], measurementVariables[yAxis]];
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
          element = thirdFilter.get('attempt', a.toString()).all();
          if (element) {
            accPA += element.map(v => parseFloat(v.measuredAmplitude)).average();
            accPW += element.map(v => parseFloat(v.measuredPulseWidth)).average();
          } else {
            accPA = 0;
            accPW = 0;
          }
        }
        pulseAmplitudes[y].push(isNaN(accPA) ? 0 : accPA / attempts);
        pulseWidths[y].push(isNaN(accPW) ? 0 : accPW / attempts);
      }
    }
    // pulseAmplitudes.map((v, i, a) => {
    //   if (!isNaN(v)) return v;
    //   if (i === 0) {
    //     return  0;
    //   } else if (i > 0 && i < a.length - 1) {
    //     let p = 1;
    //     let previousNotNaN = a[i - p];
    //     while (isNaN(previousNotNaN)) {
    //       p += 1;
    //       previousNotNaN = a[i - p];
    //     }

    //     let q = 1;
    //     let nextNotNaN = a[i + q];
    //     while (isNaN(nextNotNaN) || q >= a.length) {
    //       q += 1;
    //       nextNotNaN = a[i + q];
    //     }
    //     if (q >= a.length) {
    //       nextNotNaN = previousNotNaN;
    //       q = p + 2;
    //     }

    //     let linearInterpolation = (((nextNotNaN - previousNotNaN) / (q - p)) * (i - p)) / (q - p);
    //     return linearInterpolation;
    //   } else {
    //     return a[i - 1];
    //   }
    // });

    plotter.plot(xAxis, xValues, yAxis, yValues, [pulseAmplitudes, pulseWidths]);
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

  const dropdownOptions = Object.keys(measurementVariables);
  dropdownOptions.forEach(o => {
    $('.dropdown-menu').append(
      $(
        '<button class="dropwdown-item dropdown-button" type="button" data-setting="' +
          o +
          '">' +
          o +
          '</button>'
      )
    );
  });
  $('.dropdown-button').click(function(e) {
    console.log('Using ' + $(this).attr('data-setting'));
    const chosenSetting = $(this).attr('data-setting');
    $('.dropdown-toggle').text(chosenSetting);
    $('.dropdown-toggle').attr('data-setting', chosenSetting);
    const buttons = measurementVariables[chosenSetting];

    //remove all buttons from buttons-banner
    $('.btn-target').remove();
    //add the buttons needed to move through the values of the chosen setting
    buttons.forEach((v, i, a) => {
      const b = buttonMarkUp(i === 0, v, a[i - 1], a[i + 1]);
      $(b).appendTo($('.buttons-banner-settings'));
    });

    $('.btn-target').click(btnTargetClick);
    $('.btn-success').click();
  });

  //initiliase the plots
  $(".dropdown-button[data-setting='" + dropdownOptions[0] + "']").click();
};
