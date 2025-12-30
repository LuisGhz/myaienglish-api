import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

interface PasswordMatchDto {
  password: string;
  confirmPassword: string;
}

@ValidatorConstraint({ name: 'PasswordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(
    _: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const object = validationArguments?.object as PasswordMatchDto;
    return object.password === object.confirmPassword;
  }
  defaultMessage?(): string {
    return 'Passwords do not match';
  }
}
