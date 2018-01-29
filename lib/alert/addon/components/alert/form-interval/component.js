import { get, set } from '@ember/object';
import Component from '@ember/component'

const TIME_UNITS = [
  {
    value: 's',
    label: 'Seconds',
  },
  {
    value: 'm',
    label: 'Minutes',
  },
  {
    value: 'h',
    label: 'Hours',
  },
];

export default Component.extend({

  value: null,
  timeUnit: 's',
  interval: null,

  init() {
    this._super();
    set(this, 'interval', get(this, 'value'));
  },

  handleSuffix(n) {
    return TIME_UNITS.map(item => {
      if (n === 1) {
        return {
          value: item.value,
          label: item.label.substring(0, item.label.length - 1),
        }
      }
      // don't return item directly
      return {
        value: item.value,
        label: item.label,
      };
    });
  },

  timeUnits: function() {
    const i = +this.get('interval');
    return this.handleSuffix(i);
  }.property('interval'),

  setValue: function() {
    const n = +this.get('interval');
    const unit = this.get('timeUnit')
    let value;
    if (unit === 's') {
      this.set('value', n);
    }
    if ('unit' === 'm') {
      this.set('value', n * 60);
    }
    if ('unit' === 'h') {
      this.set('value', n * 3600);
    }
  }.observes('interval', 'timeUnit'),
});
