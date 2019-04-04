import React, {FunctionComponent} from 'react';
import Alert from 'reactstrap/lib/Alert';

const TSLoadingAlert: FunctionComponent<TSLoadingAlertProps> = ({componentName}) => (<Alert color="secondary">Loading {componentName}</Alert>);

interface TSLoadingAlertProps {
  componentName: string
}

export default TSLoadingAlert;