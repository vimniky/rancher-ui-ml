import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'

export default Route.extend({
  scope: service(),
  project: reads('scope.currentProject'),
  globalStore: service(),

  model() {
    let gs = this.get('globalStore');
    return hash({
      alerts: gs.find('projectAlert', null, {filter: this.get('project.id')}),
    });
  },
});
