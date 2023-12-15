'use strict';
module.exports = function (app, web3) {
  var crePagosController = require('../controllers/crePagosController')(web3);

  // todoList Routes
  app.route('/payment/:id/exists')
    .get(crePagosController.checkIfPaymentExists);
  app.route('/payment/:id/status')
    .get(crePagosController.getStatus);
  app.route('/payment')
    .post(crePagosController.initPayment);
  app.route('/payment/:id/refund')
    .post(crePagosController.refund);
  app.route('/payment/:id/complete')
    .post(crePagosController.complete);
};
