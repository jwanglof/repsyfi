import {InputType} from 'reactstrap/lib/Input';

export interface IFormikProps {
  name: string,
  labelText?: string,
  type?: InputType,
  labelHidden?: boolean,
  suggestions?: string[],
  inputProps?: IFormikInputProps
  addedClassNames?: string
}

interface IFormikInputProps {
  disabled?: boolean,
  min?: number,
  autoFocus?: boolean,
  step?: string
}
