export class WrongParametersGuachimanError extends Error {
  constructor() {
    super('The `window` parameter is required');
  }
}

export class IntersectionObserverDoesNotExist extends Error {
  constructor() {
    super('Intersection Observer does not exist');
  }
}
