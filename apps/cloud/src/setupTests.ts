// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

global.window = Object.create(window)

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/'
  }
})
