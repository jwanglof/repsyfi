import React, {FunctionComponent} from 'react';
import Alert from 'reactstrap/lib/Alert';

const TSErrorAlert: FunctionComponent<TSErrorAlertProps> = ({errorText, componentName=null, uid=null}) => (<Alert color="danger">{errorText} {componentName && `(from component: ${componentName})`} {uid && `(uid: ${uid})`}</Alert>);

interface TSErrorAlertProps {
  errorText: string | undefined,
  componentName?: string,
  uid?: string
}

export default TSErrorAlert;