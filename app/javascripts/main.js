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
      if (inputs[i].getAttribute('type') === 'radio' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i].getAttribute('type') === 'checkbox' && !(inputs[i].checked)) {
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
      tags: [dataElement[7].value, dataElement[8].value, dataElement[9].value],
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
      if (inputs[i].getAttribute('type') === 'radio' && !(inputs[i].checked)) {
        inputs[i].value = '';
        dataElement[i] = inputs[i].value;
      } else if (inputs[i].getAttribute('type') === 'checkbox' && !(inputs[i].checked)) {
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
      tags: [dataElement[7].value, dataElement[8].value, dataElement[9].value],
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


//Display orders
(function() {
  function displayOrders(event) {
    event.preventDefault();
    $.ajax({
      url: '/api/orders',
      type: 'GET',
      success: function (datas) {
        $('.js-history-infos').empty();
        datas.forEach(function callback(order) {
          $('.js-history-infos').append(
          '<tr><td>'+ order._id +'</td><td class="lowercase">'+ order.client.email +'</td><td>'+ order.total +'</td><td>'+ (order.finalized ? "oui" : "non") +'</td></tr>'
          );
        });
      },
    });
  }

  $('.js-panel-dashboard').on('click', displayOrders);
})();


// add product to the cart
(function() {
  function addToCart(event) {
    event.preventDefault();
    var url = this.parentNode.getAttribute('action');
    var quantity = this.previousElementSibling.lastElementChild.value;
    $.ajax({
      url: url,
      type: 'PUT',
      data: {quantity: quantity},
      success: function (data) {
      }
    });
  }

  $('.js-addToCart').on('click', addToCart);
})();

// remove product from the cart
(function() {
  function removeFromCart(event) {
    event.preventDefault();
    var url = this.getAttribute('href');
    var productId = url.split('/').pop();

    $.ajax({
      url: url,
      type: 'PUT',
      success: function (data) {

        var cartProductQuantity = $('.js-cart-quantity').text();
        var productPrice = $('.js-product-price[data-id=' + productId + ']').text();
        var totalPrice = $('.js-total').text();

        $('tr[data-id=' + productId + ']').addClass('js-product--remove').fadeOut(1000);
        $('.js-cart-quantity').text(cartProductQuantity - 1);

        $('.js-total').text(totalPrice - productPrice);

      }
    });
  }

  $('.js-removeFromCart').on('click', removeFromCart);
})();
