import Component from '@ember/component'
import { alias } from '@ember/object/computed'
import { get, set } from '@ember/object'

const severities = [
  {value: 'emerg', label: 'emergency'},
  {value: 'alert', label: 'alert'},
  {value: 'critical', label: 'crit'},
  {value: 'err', label: 'error'},
  {value: 'warning', label: 'warning'},
  {value: 'notice', label: 'notice'},
  {value: 'info', label: 'info'},
  {value: 'debug', label: 'debug'},
];

export default Component.extend({

  init(...args) {
    this._super(...args);
    this.set('severities', severities);
    let config = {
      severity: 'info',
      program: null,
      endpoint: null,
    }
    const c = get(this, 'model.syslogConfig');
    console.log(c, this.get('model'));
    if (c) {
      config = c;
    }
    this.setProperties({
      'model.syslogConfig': config,
      config,
    });
  },

  logPreview: '# COMMING SOON',

  fieldsStr: function() {
    const keyValueMap = get(this, 'model.outputTags')
    if (!keyValueMap) {
      return '';
    }
    return Object.keys(keyValueMap).map(key => `    "${key}": "${keyValueMap[key]}"`).join(',\n');
  }.property('model.outputTags'),

});
