const ramdaP = require('../ramdaP');

describe('ramdaP', () => {
  describe('convergeP', () => {
    it('should work', async () => {
      const result = await ramdaP.convergeP([x => x, x => x], (a, b) => a + b, 1);

      expect(result).toBe(2);
    });
  });
});
