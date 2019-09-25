window.dataLayer = []

// Google Tag Manager
;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DGSPZ5');

function checkoutStep(step) {
dataLayer.push({
  'event': 'checkout',
  'ecommerce': {
    'checkout': {
      'actionField': {'step': step}
    }
  }
})
}

if (window.eComEventTarget) {
  window.eComEventTarget.addEventListener('pageview', function (event) {
    var url = event.detail.url
    if (url === '/cart') return checkoutStep(1)
    if (url === '/checkout/personal-data') return checkoutStep(2)
    if (url === '/checkout/shipping') return checkoutStep(3)
    if (url === '/checkout/payment') return checkoutStep(4)
    if (url === '/checkout/confirmation') return checkoutStep(5)
    if (url === '/o') return checkoutStep(6)
    dataLayer.push({
      event: 'Pageview',
      pagePath: url,
      pageTitle: document.title
    })
  })
  
  window.eComEventTarget.addEventListener('product', function (event) {
    const product = event.detail.product
    dataLayer.push({
      'ecommerce': {
        'currencyCode': product.getIn(['price', 'currency']),
        'detail': {
          'products': [{
             'name': product.get('name'),
             'id': product.get('sku'),
             'price': String(product.getIn(['price', 'amount']))
          }]
        }
      }
    })
    
    console.log('product:', event.detail.product.toJS())
  })
  window.eComEventTarget.addEventListener('category', function (event) {
    const category = event.detail.category
    const categoryName = category !== undefined ? category.get('title') : 'null'
    const products = event.detail.products.map(function(product, index) {
      return {
        'name': product.get('name'),
        'id': product.get('sku'),
        'price': String(product.getIn(['price', 'amount'])),
        'category': categoryName,
        'list': 'category/' + categoryName,
        'position': index + 1
      }
    })
    dataLayer.push({
      'ecommerce': {
        'currencyCode': event.detail.products.get(0).getIn(['price', 'currency']),                       // Local currency is optional.
        'impressions': products.toJS()
      }
    });
  })
  
  /* Cart interactions */
  window.eComEventTarget.addEventListener('cart:add', function (event) {
    // product is a plain JSON
    const product = event.detail.product
    const ecommerce = product ? {
      'currencyCode': product.price.currency,
      'add': {
        'products' : [{
          'name': product.name,
          'id': product.sku,
          'price': String(product.price.amount),
          'quantity': event.detail.quantity
        }]
      }
    } : undefined
    
    dataLayer.push({
      event: 'addToCart',
      'ecommerce': ecommerce
    })
  })
  window.eComEventTarget.addEventListener('cart:setQuantity', function (event) {
    // product is a plain JSON
    const product = event.detail.lineItem
    const quantityDelta = event.detail.quantityDelta
    const eventName = quantityDelta > 0 ? 'addToCart' : 'removeFromCart'
    const action = quantityDelta > 0 ? 'add' : 'remove'
    
    dataLayer.push({
      event: eventName,
      'ecommerce': {
        'currencyCode': product.singleItemPrice.currency,
        [action]: {
          'products' : [{
            'name': product.name,
            'id': product.sku,
            'price': String(product.singleItemPrice.amount),
            'quantity': Math.abs(quantityDelta)
          }]
        }
      }
    })
  })
  window.eComEventTarget.addEventListener('order:completed', function (event) {
    var order = event.detail;
    if (order) {
      dataLayer.push({
        event: 'purchase',
        'ecommerce': {
          'purchase': {
            'actionField': {
              'id': order.orderId,                         // Transaction ID. Required for purchases and refunds.
              'affiliation': 'Online Store',
              'revenue': order.grandTotal,                     // Total transaction value (incl. tax and shipping)
              'tax': order.lineItemContainer.totalTax.amount,
              'shipping': order.shippingData.price.amount
              // 'coupon': order.couponCampaign.name
            },
            'products': order.lineItemContainer.productLineItems.map(function(product) {
              return {
                'id': product.sku,
                'name': product.name,
                'price': product.singleItemPrice.amount,
                'quantity': product.quantity.amount
              }
            })
          }
        }
      })
    }
  })
}
