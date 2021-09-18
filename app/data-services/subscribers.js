'use strict';
var Subscriber         = require('mongoose').model('Subscriber');
var customErrors = require('n-custom-errors');
exports.getSubscribers = (filter, keys) => {
    return Subscriber
      .find(filter, keys)
      .exec();
  };

exports.getSubscriber= (filter) => {
    return Subscriber
      .findOne(filter)
      .exec()
      .then(subscriber => {
        if (!subscriber) {
          return customErrors.rejectWithObjectNotFoundError('subscriber is not found');
        }
        return subscriber;
      });
};

exports.updatePages = (filter, pages) => {
    return Subscriber
      .findOne(filter)
      .exec()
      .then(subscriber => {
        if (!subscriber) {
          return customErrors.rejectWithObjectNotFoundError('subscriber is not found');
        }
        subscriber.pages = pages;
        subscriber.save();
        return subscriber;
      });
}

exports.saveSubscriber = subscriber => {
  return subscriber.save();
};
