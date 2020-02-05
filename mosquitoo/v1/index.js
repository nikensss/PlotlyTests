window.onload = function() {
  console.log('Loading JS...');

  $('.btn-target').click(function() {
    //highlight in green the currently selected button
    const btns = $('.btn-target');
    btns.removeClass('btn-success');
    $(this).addClass('btn-success');

    //if all is selected, do not change any opacity but move the 'height'
    if ($('.btn-all').attr('data-isAllSelected') === 'true') {
      $('.target-element').removeClass('top-layer');
      $('.' + $(this).attr('data-target')).addClass('top-layer');
      return;
    }
    //hide all elements and then show the actual target
    $('.target-element')
      .css('opacity', 0)
      .removeClass('top-layer');
    $('.' + $(this).attr('data-target'))
      .css('opacity', 1)
      .addClass('top-layer');
  });

  $('.btn-previous').click(function() {
    const selected = $('.btn-success');
    const btns = $('.btn-target');
    const index = parseInt(selected.attr('data-target').replace('target', ''));
    if (index <= 0) {
      return;
    }
    $(btns[index - 1]).click();
  });

  $('.btn-next').click(function() {
    const selected = $('.btn-success');
    const btns = $('.btn-target');
    const index = parseInt(selected.attr('data-target').replace('target', ''));
    if (index >= btns.length - 1) {
      return;
    }
    $(btns[index + 1]).click();
  });

  $('.btn-all').click(function() {
    //make all the elements's position relative
    $('.content').toggleClass('position-relative');

    //get the status
    const isAllSelectd = $(this).attr('data-isAllSelected') === 'true';
    if (isAllSelectd) {
      //if the button is clicked and 'isAllSelected' means we want to see single
      $(this).attr('data-isAllSelected', 'false');
      $(this).text('All');
      //hide all of them and then show the one that is selected
      $('.target-element').css('opacity', 0);
      $('.' + $('.btn-success').attr('data-target')).css('opacity', 1);
    } else {
      $(this).attr('data-isAllSelected', 'true');
      $(this).text('Single');
      //show all of them
      $('.target-element').css('opacity', 1);
    }
  });

  $(document).keyup(function(e) {
    if (e.which === 37) {
      $('.btn-previous').click();
    } else if (e.which === 39) {
      $('.btn-next').click();
    }
  });

  console.log('Done!');
};
