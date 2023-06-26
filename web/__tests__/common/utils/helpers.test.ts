import {
  camelize,
  deDupe,
  lowercaseFirstLetter,
  removeFullStopAtEnd,
} from '@/utils/helpers'

const str = 'This is a test'

describe('Utils: helpers', () => {
  describe('camelize', () => {
    it('should make the passed in string camelcase', () => {
      const result = camelize(str)
      expect(result).toBe('thisIsATest')
    })
  })

  describe('deDupe', () => {
    it('should remove duplicates from an array', () => {
      const arr = ['test1', 'test2', 'test1']
      const result = deDupe(arr)
      expect(result).toEqual(['test1', 'test2'])
    })
  })

  describe('lowercaseFirstLetter', () => {
    it('should lowercase the first letter of a string', () => {
      const result = lowercaseFirstLetter(str)
      expect(result).toBe('this is a test')
    })
  })

  describe('removeFullStopAtEnd', () => {
    it('should remove the full stop from the end of the string', () => {
      const result = removeFullStopAtEnd(`${str}.`)
      expect(result).toBe(str)
    })
  })
})
