var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        cardId_shortlink: {
            key: 'cardId_shortlink',
            validate: {
                req: true,
                check: 'checkAlphanumeric'
            }
        },
        idLabels: {
            key: 'idLabels',
            type: 'string',
            validate: {
                req: true,
                check: 'checkAlphanumeric'
            }
        }
    };
module.exports = {
    authOptions: function (dexter) {
        if (!dexter.environment('trello_api_key') || !dexter.environment('trello_token')) {
            this.fail('A [trello_api_key] or [trello_token] environment variables are required for this module');
            return false;
        } else {
            return {
                api_key: dexter.environment('trello_api_key'),
                token: dexter.environment('trello_token')
            }
        }
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(dexter);

        if (!auth) return;

        var t = new trello(auth.api_key, auth.token),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        t.post("/1/cards/" + inputs.cardId_shortlink + "/idLabels", { value: inputs.idLabels}, function(err, data) {
            if (!err) {
                this.complete({success: true});
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
