/* global $ */

(function() {
  console.log('hello world !');
})();

// Dashboard Page

// Button to remove a product
(function() {
  function deleteProduct(event) {
    var url = this.getAttribute('href');

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

// Switch button to change the status of a product
(function() {
  $("[name='status-checkbox']").bootstrapSwitch();

  $("[name='status-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    var status = this.dataset.published;
    var id = this.dataset.id;
    var url = '/api/products/' + id;

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

// Edit Page
(function() {
  function editProduct(event) {
    event.preventDefault();

    var url = this.getAttribute('href');
    var form = $('#edit-form')[0];
    var dataElement = {};

    for(var i=0; i < form.elements.length; i++){
      if (form.elements[i].getAttribute('type') == 'radio' && !(form.elements[i].checked)) {
        form.elements[i].value = '';
        dataElement[i] = form.elements[i].value;
      } else if (form.elements[i].getAttribute('type') == 'checkbox' && !(form.elements[i].checked)) {
        form.elements[i].value = '';
        dataElement[i] = form.elements[i].value;
      } else if (form.elements[i] === '') {
        return;
      }
      dataElement[i] = form.elements[i];
    }

    var data = {
      title: dataElement[0].value,
      content: dataElement[1].value, 
      quantity: dataElement[2].value, 
      price: dataElement[3].value, 
      category: dataElement[4].value || dataElement[5].value, 
      tags: [dataElement[6].value, dataElement[7].value],
    };

    $.ajax({
      url: url,
      type: 'PUT',
      data: data,
      success: function (data) {
        window.location.href = '/dashboard';
      }
    });
  }

  $('.btn-edit').on('click', editProduct);
})();