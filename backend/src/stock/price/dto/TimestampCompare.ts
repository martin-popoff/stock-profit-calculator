import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'compareTimestamps', async: false })
export class CompareTimestamps implements ValidatorConstraintInterface {
  validate(timestamp: number, args: ValidationArguments) {
    return timestamp > args.object[args.constraints[0]];
  }
}
