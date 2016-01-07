/* global $ */

(function() {
  console.log('hello world !');
})();

(function() {
  function deleteProduct(event) {
    const url = this.getAttribute('href');

    event.preventDefault();

    $(this).toggleClass('active');

    $.ajax({
      method: 'DELETE',
      url: url,
    })
      .done(function(deletedProduct) {
      $('tr[data-id=' + deletedProduct._id + ']').remove();
    });
  }

  $('.btn-danger').on('click', deleteProduct);
})();

(function() {
  $("[name='status-checkbox']").bootstrapSwitch();

  $("[name='status-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    const status = this.dataset.published;
    const id = this.dataset.id;
    const url = '/api/products/' + id;

    function changeStatus(event, status, url, id) {
      event.preventDefault();

      if (status == 'true'){
        $.ajax({
          method: 'PUT',
          url: url,
          data: {
            published: false,
          }
        });
      } else {
        $.ajax({
          method: 'PUT',
          url: url,
          data: {
            published: true,
          }
        });
      }
    }

    changeStatus(event, status, url, id);
  });
})();