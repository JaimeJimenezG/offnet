/**
 * Model class
 * @class Model
 * @abstract
 * @description
 * Model class is an abstract class that provides a base class for all models.
 */
export declare abstract class Model {
  constructor(attrs?: { [key: string]: any });

  /**
   * Parse an object and assign its values to the model
   * @param attrs
   */
  parse(attrs?: { [key: string]: any }): void;

  /**
   * Convert the model to a JSON object
   * @returns JSON
   */
  json(): JSON;
}
