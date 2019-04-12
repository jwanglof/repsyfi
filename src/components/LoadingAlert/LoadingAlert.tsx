import React, {FunctionComponent} from 'react';
import Alert from 'reactstrap/lib/Alert';

const LoadingAlert: FunctionComponent<ILoadingAlertProps> = ({componentName}) => (<Alert color="secondary">Loading {componentName}</Alert>);

interface ILoadingAlertProps {
  componentName: string
}

export default LoadingAlert;