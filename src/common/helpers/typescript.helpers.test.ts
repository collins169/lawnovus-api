import { Cloneable } from './typescript.helpers';

describe('TypeScript helpers', () => {
  describe('cloneable', () => {
    it('deep clones object', () => {
      const date = new Date('01/01/1999');
      const source = { a: { b: { c: date, f: 5 }, d: [0, false] }, g: 'h' };
      const clone = Cloneable.deepCopy(source);

      expect(clone.a.b.c).toEqual(date);
      expect(clone.a.b.c).not.toBe(date);

      expect(clone.a.d).toEqual([0, false]);
      expect(clone.a.d).not.toBe([0, false]);

      expect(clone).toEqual(source);
      expect(clone).not.toBe(source);
    });

    it('returns primitive value', () => {
      expect(Cloneable.deepCopy(0)).toBe(0);
      expect(Cloneable.deepCopy(5)).toBe(5);
      expect(Cloneable.deepCopy(false)).toBe(false);
      expect(Cloneable.deepCopy(undefined)).toBeUndefined();
      expect(Cloneable.deepCopy(null)).toBeNull();
      expect(Cloneable.deepCopy('')).toBe('');
      expect(Cloneable.deepCopy('text')).toBe('text');
    });
  });
});
