window.onload = function() {
  this.Array.prototype.last = function() {
    return this[this.length - 1];
  };
  Array.prototype.average = function() {
    return this.reduce((t, c) => t + c, 0) / this.length;
  };
  const inputs = new Inputs([
    {
      name: 'stepperPosition',
      values: [
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50'
      ]
    },
    {
      name: 'currentPercentage',
      values: ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73']
    },
    {
      name: 'pulseWidth',
      values: ['1E-6']
    }
  ]);
  const outputs = new Outputs(['measuredEnergy'], data);
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
  const plots = $('.plot')
    .toArray()
    .reduce((t, c) => {
      t.push(c.id);
      return t;
    }, []);
  const plotter = new Plotter(plots, layout);

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
    inputs.fixInput({
      name: inputs.fixedInput.name,
      value: $(this).attr('data-target-int')
    });
    console.log(`${inputs.fixedInput.name}: ${inputs.fixedInput.value}`);
    outputs.update(inputs);
    plotter.plot(inputs, outputs);
    outputs.reset();
    console.log('Plot finished!');
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

  //Initialise the dropdown menu
  const dropdownOptions = inputs.names;
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
  //When clicking one of the dropdown options
  $('.dropdown-button').click(function() {
    console.log('Using ' + $(this).attr('data-setting'));
    const chosenSetting = $(this).attr('data-setting');
    $('.dropdown-toggle').text(chosenSetting);
    $('.dropdown-toggle').attr('data-setting', chosenSetting);
    const buttons = inputs.getValuesOf(chosenSetting);
    inputs.fixInput({
      name: $(this).attr('data-setting'),
      value: buttons[0]
    });
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
