import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { getOwner } from '@ember/application';

const headers = [
  {
    name:           'state',
    sort:           ['stateSort','name','id'],
    translationKey: 'generic.state',
    width:          125,
  },
  {
    name:           'name',
    sort:           ['displayName','id'],
    translationKey: 'clustersPage.cluster.label',
  },
  {
    name:           'hosts',
    sort:           ['numHosts','name','id'],
    translationKey: 'clustersPage.hosts.label',
    width: 100,
  },
  {
    name:           'cpu',
    sort:           ['cpuPercent','name','id'],
    translationKey: 'clustersPage.cpu.label',
    width: 100,
  },
  {
    name:           'memory',
    sort:           ['memoryPercent','name','id'],
    translationKey: 'clustersPage.memory.label',
    width: 100,
  },
  {
    name:           'pod',
    sort:           ['podPercent','name','id'],
    translationKey: 'clustersPage.pod.label',
    width: 100,
  },
];

export default Controller.extend({
  modalService: service('modal'),
  access: service(),
  scope: service(),
  settings: service(),

  headers: headers,
  sortBy: 'name',
  searchText: null,
  bulkActions: true,

  actions: {
  },
});
