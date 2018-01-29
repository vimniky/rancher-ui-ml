import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'

export default Route.extend({
  // projects: service(),
  // namespace: reads('projects.namespace'),

  model() {
    // return this.loadResources();
  },

  loadResources() {
    let store = this.get('store');
    // load all alert related resources
    return hash({
      pods: store.findAll('pod', null),
      workload: store.findAll('workload'),
    });
  },
});
