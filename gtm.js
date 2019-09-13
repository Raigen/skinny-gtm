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
             'price': product.getIn(['price', 'amount'])
          }]
        }
      }
    })
    
    console.log('product:', event.detail.product.toJS())
  })
  window.eComEventTarget.addEventListener('category', function (event) {
    const products = event.detail.products.map(function(product) {
      return {
        'name': product.get('name'),
        'id': product.get('sku'),
        'price': product.getIn(['price', 'amount'])
      }
    })
    dataLayer.push({
      'ecommerce': {
        'currencyCode': event.detail.products.get(0).getIn(['price', 'currency']),                       // Local currency is optional.
        'impressions': products.toJS()
      }
    });
  })
  window.eComEventTarget.addEventListener('cart:add', function (event) {
    // event.detail.cart is a Immutable.Map
    dataLayer.push({
      event: 'addToCart'
    })
  })
}
