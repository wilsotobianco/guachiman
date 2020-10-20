import Guachiman from './index';
import {
  IntersectionObserverDoesNotExist,
  WrongParametersGuachimanError,
} from './errors';
describe('The Guachiman constructor', () => {
  describe('when IO exists', () => {
    beforeAll(() => {
      window.IntersectionObserver = {};
    });
  
    test('assigns relevant references to its properties', () => {
      window.IntersectionObserver = {};
      const instance = new Guachiman(window);
  
      expect(instance.global_).toBe(window);
      expect(instance.performance_).toBe(window.performance);
    });
  
    test('assigns the injected config', () => {
      const foo = 'baz';
      const bar = 'foobar';
      window.IntersectionObserver = {};
  
      const config = { foo, bar };
      const instance = new Guachiman(window, config);
  
      expect(instance.config_).toBe(config);
    });
  
    test('throws an error if the parameters are not right', () => {
      const functionToTest = () => new Guachiman();
  
      expect(functionToTest).toThrow(WrongParametersGuachimanError);
    });
  
    afterAll(() => {
      delete window.IntersectionObserver;
    });
  });
  
  describe('when IO does not exist', () => {
    test('by default throws an error and polyfill is not activated', () => {
      const functionToTest = () => new Guachiman(window);
  
      expect(functionToTest).toThrow(IntersectionObserverDoesNotExist);
    });
  
    test('activates the IO if activatePolyfill is true', () => {
      jest.spyOn(Guachiman.prototype, 'activatePolyfill_');
      
      const instance = new Guachiman(window, {activatePolyfill: true});
  
      expect(instance.activatePolyfill_).toBeCalledTimes(1);
    });
  });
});
