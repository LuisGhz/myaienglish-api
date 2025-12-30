import { registerDecorator, ValidationOptions } from 'class-validator';
import { PasswordMatchConstraint } from './password-match.constraint';

export function PasswordMatch(validationOptions?: ValidationOptions) {
  return function (object: Object) {
    registerDecorator({
      name: 'PasswordMatch',
      target: object as Function,
      propertyName: 'confirmPassword',
      options: validationOptions,
      validator: PasswordMatchConstraint,
    });
  };
}
