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
    if (url === '/cart') checkoutStep(1)
    if (url === '/checkout/personal-data') checkoutStep(2)
    if (url === '/checkout/shipping') checkoutStep(3)
    if (url === '/checkout/payment') checkoutStep(4)
    if (url === '/checkout/confirmation') checkoutStep(5)
    if (url === '/o') checkoutStep(6)
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
      'currencyCode': product.salesPrice.currency,
      'add': {
        'products' : [{
          'name': product.get('name'),
          'id': product.get('sku'),
          'price': String(product.getIn(['price', 'amount'])),
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
            'name': product.get('name'),
            'id': product.get('sku'),
            'price': String(product.singleItemPrice.amount),
            'quantity': Math.abs(quantityDelta)
          }]
        }
      }
    })
  })
}
