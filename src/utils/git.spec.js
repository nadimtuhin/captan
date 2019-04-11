const { isDirty } = require('./git');
const { exec } = require('./shell');

test('should be dirty', () => {
  expect(isDirty()).toEqual(false);
});
