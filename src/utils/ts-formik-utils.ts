import {InputType} from 'reactstrap/lib/Input';

export interface IFormikProps {
  labelText: string,
  name: string,
  type?: InputType,
  labelHidden?: boolean,
  inputProps?: IFormikInputProps,
  min?: number
}

interface IFormikInputProps {
  disabled?: boolean,
  min?: number
}


/*FieldFormGroup.propTypes = {
  inputProps: PropTypes.shape({
    disabled: PropTypes.bool
  }),
  type: PropTypes.string,
  labelHidden: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
*/