window.onload = function() {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
  Array.prototype.max = function() {
    return Math.max.apply(
      null,
      this.filter(n => !isNaN(n) && isFinite(n))
    );
  };
  Array.prototype.average = function() {
    return this.reduce((t, c) => t + (parseFloat(c) || 0), 0) / this.length;
  };
  Array.prototype.min = function() {
    return Math.min.apply(
      null,
      this.filter(n => !isNaN(n) && isFinite(n))
    )
  };
  const inputs = new Inputs(data.inputs);
  const outputs = new Outputs(data.outputs, data.results);
  const layout = {
    title: '',
    scene: {
      camera: { eye: { x: -0.55, y: -1.5, z: 1.7 } },
      xaxis: { title: 'Stepper position' },
      yaxis: { title: 'Pulse width' }
    },
    width: 750,
    height: 750,
    autosize: true,
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90
    }
  };
  const plots = $('.plot')
    .toArray()
    .reduce((t, c) => {
      t.push(c.id);
      return t;
    }, []);
  console.log('Plots: ' + plots)
  const plotter = new Plotter(plots, layout);

  console.log(`Total measurements performed: ${data.results.length}`);

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
    $('.btn-target.btn-success').removeClass('btn-success');
    console.log(`Selected method: ${$('.btn-method.btn-success').attr('data-method')}`)
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
  };

  $('.btn-method').click(function () {
    $('.btn-method.btn-success').removeClass('btn-success');
    $(this).addClass('btn-success');
    console.log('Showing ' + $(this).attr('data-method') + ' on ' + $(this).parent().attr('data-for'));
    $('.btn-target.btn-success').click();
  })

  $('.btn-previous').click(function() {
    const selected = $('.btn-target.btn-success');
    const target = $(".btn-target[data-target-int='" + selected.attr('data-target-previous') + "'");
    if (target) {
      target.click();
    }
  });

  $('.btn-next').click(function() {
    const selected = $('.btn-target.btn-success');
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
    $('.btn-target.btn-success').click();
  });

  //initiliase the plots
  $(".dropdown-button[data-setting='" + dropdownOptions[0] + "']").click();
};
