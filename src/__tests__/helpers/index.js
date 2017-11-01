/* eslint-env jest */

expect.extend({
  toBeWithin20PercentOf(received: number, argument: number) {
    const pass = received * 1.2 > argument && received / 1.2 < argument;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within 20% of ${argument}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be within 20% of ${argument}`,
      pass: false,
    };
  },
});
