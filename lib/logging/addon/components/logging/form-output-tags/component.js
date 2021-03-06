import Ember from 'ember';
import { inject as service } from '@ember/service'

export default Ember.Component.extend({

  expandFn: null,
  tags: null,

  init() {
    this._super();
    if (!this.get('tags')) {
      this.set('tags', []);
    }
    const it = this.get('initialTags');
    if (it) {
      Object.keys(it).sort().forEach(key => {
        const t = {
          key,
          value: it[key],
        }
        this.get('tags').pushObject(Ember.Object.create(t));
      });
    }
  },

  actions: {
    pastedTags(str, target) {
      let ary = this.get('tags');
      str = str.trim();
      if (str.indexOf('=') === -1 && str.indexOf(':') === -1) {
        // Just pasting a key
        $(target).val(str);
        return;
      }

      let lines = str.split(/\r?\n/);
      lines.forEach((line) => {
        line = line.trim();
        if (!line) {
          return;
        }

        let idx = line.indexOf('=');
        if ( idx === -1 ) {
          idx = line.indexOf(':');
        }

        let key = '';
        let val = '';
        if (idx > 0) {
          key = line.substr(0,idx).trim();
          val = line.substr(idx+1).trim();
        }
        else {
          key = line.trim();
          val = '';
        }
        let existing = ary.filterBy('key',key)[0];
        if (existing) {
          Ember.set(existing,'value',val);
        }
        else {
          ary.pushObject(Ember.Object.create({key: key, value: val}));
        }
      });

      // Clean up empty user entries
      let toRemove = [];
      ary.forEach((item) => {
        if (!item.get('key') && !item.get('value')) {
          toRemove.push(item);
        }
      });
      ary.removeObjects(toRemove);
    },
    addTag() {
      this.get('tags').pushObject(Ember.Object.create({key: null, value: null}));
      Ember.run.next(() => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }
        this.$('INPUT.key').last()[0].focus();
      });
    },
    removeTag(tag) {
      this.get('tags').removeObject(tag);
    }
  },
});
