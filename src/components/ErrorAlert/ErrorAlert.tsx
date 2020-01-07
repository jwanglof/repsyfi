import React, {FunctionComponent} from 'react';
import Alert from 'reactstrap/lib/Alert';

const ErrorAlert: FunctionComponent<IErrorAlertProps> = ({errorText, componentName=null, uid=null}) => (<Alert color="danger">{errorText} <strong>{componentName && `[from component: ${componentName}]`} {uid && `[uid: ${uid}]`}</strong></Alert>);

interface IErrorAlertProps {
  errorText: string | undefined,
  componentName?: string,
  uid?: string
}

export default ErrorAlert;