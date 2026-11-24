const assert = require('assert');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

function kubeconfig(defaultServer, otherServer) {
  return `apiVersion: v1
kind: Config
current-context: default
clusters:
- name: default
  cluster:
    server: ${defaultServer}
- name: other
  cluster:
    server: ${otherServer}
users:
- name: someone
  user:
    token: abc
contexts:
- name: default
  context:
    cluster: default
    user: someone
- name: other
  context:
    cluster: other
    user: someone
`;
}

describe('kubernetes.getNamespaces', function() {
  const modulePath = require.resolve('./kubernetes');
  let server, previousKubeconfig;

  beforeEach(function(done) {
    previousKubeconfig = process.env.KUBECONFIG;
    server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ items: [{ metadata: { name: 'from-other-cluster' } }] }));
    });
    server.listen(0, '127.0.0.1', done);
  });

  afterEach(function(done) {
    if (previousKubeconfig === undefined) delete process.env.KUBECONFIG;
    else process.env.KUBECONFIG = previousKubeconfig;
    delete require.cache[modulePath];
    server.close(done);
  });

  it('lists namespaces from the cluster of the selected context', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'captan-kube-'));
    const file = path.join(dir, 'config');
    const otherServer = `http://127.0.0.1:${server.address().port}`;
    fs.writeFileSync(file, kubeconfig('http://127.0.0.1:1', otherServer));
    process.env.KUBECONFIG = file;
    delete require.cache[modulePath];

    const { getNamespaces } = require('./kubernetes');
    return getNamespaces('other').then(namespaces => {
      assert.deepStrictEqual(namespaces, ['from-other-cluster']);
    });
  });
});
