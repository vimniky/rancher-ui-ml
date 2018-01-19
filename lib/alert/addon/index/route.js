import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'

export default Route.extend({
  // projects: service(),
  // namespace: reads('projects.namespace'),

  model() {
    // return this.loadResources();
  },
  loadResources() {
    let store = this.get('monitoringStore');
    // load all alert related resources
    const filter = {namespace: this.get('namespace')};
    const hash = {
      notifiers: store.find('notifier', null),
      recipients: store.find('recipient', null, {forceReload: true, filter}),
      alerts: store.find('alert', null, {forceReload: true, filter}),
      pods: store.find('pod', null, {filter}),
      deployments: store.find('deployment', null, {filter}),
      nodes: store.find('node'),
      daemonsets: store.find('daemonset', null, {filter}),
      statefulset: store.find('statefulset', null, {filter}),
    };
    return RSVP.hash(hash);
  },
});
