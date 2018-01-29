import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'

export default Route.extend({
  globalStore: service(),

  model() {
    let store = this.get('globalStore');
    return hash({
      alerts: store.findAll('projectAlert'),
    });
  },
});
