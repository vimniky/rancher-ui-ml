import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed'

export default Route.extend({
  globalStore: service(),
  scope: service(),
  pageScope: reads('scope.currentPageScope'),
  cluster: reads('scope.currentCluster'),
  project: reads('scope.currentProject'),

  model(params, transition) {
    const store = get(this, 'store');
    const globalStore = get(this, 'globalStore');
    const pageScope = get(this, 'pageScope');

    let pods = [];
    let workloads = [];
    let nodes = [];
    if (pageScope === 'cluster') {
      const opt = {filter: {cluterId: this.get('cluter.id')}}
      nodes = globalStore.find('node', null, opt);
    } else if (pageScope === 'project') {
      const opt = {filter: {projectId: this.get('project.id')}}
      pods = store.find('pod', null);
      workloads = store.findAll('workload', null);
    }
    const notifiers = globalStore.findAll('notifier')
    return hash({
      pods,
      nodes,
      workloads,
      notifiers,
    })
  },

  // setupController(controller, model) {
  //   // if (model.alert) {
  //   //   controller.set('model', model.alert);
  //   // }
  // },

  resetController: function (controller, isExisting/*, transition*/) {
    if (isExisting) {
      controller.setProperties({
      })
    }
  }
});
