import {InputType} from 'reactstrap/lib/Input';

export interface IFormikProps {
  labelText: string,
  name: string,
  type?: InputType,
  labelHidden?: boolean,
  suggestions?: string[],
  inputProps?: IFormikInputProps
}

interface IFormikInputProps {
  disabled?: boolean,
  min?: number,
  autoFocus?: boolean,
  step?: string
}
