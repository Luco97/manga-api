import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ArrayContainsSome(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ArrayContainsSome',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string[], args: ValidationArguments) {
          for (let index = 0; index < value?.length; index++) {
            const element = value[index];
            if (!property.includes(element)) return false;
          }
          return true;
        },
      },
    });
  };
}
