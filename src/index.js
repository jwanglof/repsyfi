import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Container} from 'reactstrap';
import {RouterProvider} from 'react-router5';
import createRouter from './create-router'

import 'bootstrap/dist/css/bootstrap.min.css';


const router = createRouter(true);

router.start(() => {
  ReactDOM.render(
    <Container>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Container>,
    document.getElementById('root')
  );
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
