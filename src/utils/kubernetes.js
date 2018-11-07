const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.Core_v1Api);


function getContexts() {
  return kc.getContexts();
}

function getCurrentContextObject() {
  return kc.getCurrentContextObject();
}

function getNamespaces() {
  return k8sApi.listNamespace()
    .then((res, err) => {
      if (err) throw Error(err);
      const namespaces = res.body.items;
      return namespaces.map(n => n.metadata.name);
    });
}

module.exports = {
  getContexts,
  getCurrentContextObject,
  getNamespaces
};

// context = {cluster, name, user}
// console.log(getContexts());
// console.log(getClusterNames(kc));
// console.log(getCurrentContextObject(kc));
// getNamespaces(kc).then(n => console.log(n));
