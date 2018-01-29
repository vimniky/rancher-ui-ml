import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  value: 1,

  actions: {
    inc(n) {
      set(this, 'value', +get(this, 'value') + 1);
    },
    dec(n) {
      const value = +get(this, 'value') - 1;
      if (value <= 0) {
        return;
      }
      set(this, 'value', value);
    },
  }
});
