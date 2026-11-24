const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('cli', function() {
  it('has a shebang that works on Linux (env cannot pass extra args)', function() {
    const firstLine = fs.readFileSync(path.join(__dirname, 'cli.js'), 'utf8').split('\n')[0];
    assert.strictEqual(firstLine, '#!/usr/bin/env node');
  });
});
