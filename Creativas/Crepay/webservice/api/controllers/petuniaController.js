'use strict';

module.exports = function (web3) {
  var crePagos = null;
  crePagos = require('../models/crePagos')(web3);

  const initPayment = function (req, res) {
    const input = req.body;
    console.log(input);
    const price = web3.toBigNumber(web3.toWei(input.price, 'szabo'));
    crePagos.startNewPayment(input.id, price, {
      from: crePagos.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: 'OK',
          txId: r
        });
      }
    });
  };

  const checkIfPaymentExists = function (req, res) {
    crePagos.checkIfPaymentExists.call(req.params.id, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: 'OK',
          exists: r
        });
      }
    });
  };

  const getStatus = function (req, res) {
    crePagos.getStatus.call(req.params.id, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          status: r
        });
      }
    });
  };

  const refund = function (req, res) {
    crePagos.refund(req.params.id, {
      from: crePagos.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          txId: r
        });
      }
    });
  };

  const complete = function (req, res) {
    crePagos.complete(req.params.id, {
      from: crePagos.account
    }, (e, r) => {
      if (e) {
        res.status(500, e).end();
      } else {
        res.json({
          txId: r
        });
      }
    });
  };

  return {
    initPayment: initPayment,
    checkIfPaymentExists: checkIfPaymentExists,
    getStatus: getStatus,
    refund: refund,
    complete: complete
  };
};
