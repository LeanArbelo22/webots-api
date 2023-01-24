const { palindrome } = require('../utils/testing');

test('palindrome of leandro', () => {
  const result = palindrome('leandro');

  expect(result).toBe('ordnael');
});
