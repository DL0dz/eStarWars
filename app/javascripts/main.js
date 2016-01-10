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

// Edit Product Page
(function() {

  // Initialize photo file input
  $('#photo-input').fileinput({'showUpload':false, 'previewFileType':'any'});

  function editProduct(event) {
    event.preventDefault();

    var url = this.getAttribute('href');
    var inputs = document.getElementsByTagName('input');
    var dataElement = {};

    for(var i=0; i < inputs.length; i++){
      if (inputs[i].getAttribute('type') == 'radio' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i].getAttribute('type') == 'checkbox' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i] === '') {
        return;
      }
      dataElement[i] = inputs[i];
    }

    var photo = dataElement[0].files[0];
    var photoData = new FormData();
    photoData.append('productPhoto', photo);

    var text = {
      title: dataElement[1].value,
      content: dataElement[2].value, 
      quantity: dataElement[3].value, 
      price: dataElement[4].value, 
      category: dataElement[5].value || dataElement[6].value, 
      tags: [dataElement[7].value, dataElement[8].value],
    };

    $.ajax({
      url: url,
      type: 'PUT',
      data: text,
      success: function (data) {
        $.ajax({
          url: '/api/photo/' + data._id,
          type: 'POST',
          data: photoData,
          contentType: false,
          processData: false,
          success: function (data) {
            window.location = '/dashboard';
          }
        });
      }
    });
  }

  $('.btn-edit').on('click', editProduct);
})();

// Add Product Page
(function() {

  // Initialize photo file input
  $('#photo-input').fileinput({'showUpload':false, 'previewFileType':'any'});

  function addProduct(event) {
    event.preventDefault();

    var uploadUrl = this.getAttribute('href');
    var inputs = document.getElementsByTagName('input');
    var dataElement = {};

    for(var i=0; i < inputs.length; i++){
      if (inputs[i].getAttribute('type') == 'radio' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i].getAttribute('type') == 'checkbox' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i] === '') {
        return;
      }
      dataElement[i] = inputs[i];
    }

    var photo = dataElement[0].files[0];
    var photoData = new FormData();
    photoData.append('productPhoto', photo);

    var text = {
      title: dataElement[1].value,
      content: dataElement[2].value,
      created_at: Date.now(),
      published: false,
      quantity: dataElement[3].value, 
      price: dataElement[4].value, 
      category: dataElement[5].value || dataElement[6].value, 
      tags: [dataElement[7].value, dataElement[8].value],
    };

    $.ajax({
      url: uploadUrl,
      type: 'POST',
      data: text,
      success: function (data) {
        $.ajax({
          url: '/api/photo/' + data._id,
          type: 'POST',
          data: photoData,
          contentType: false,
          processData: false,
          success: function (data) {
            window.location = '/dashboard';
          }
        });
      }
    });
  }

  $('.btn-add').on('click', addProduct);
})();