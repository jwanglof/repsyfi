import React, {FunctionComponent} from 'react';
import {Col, Row} from 'reactstrap';

const Faq: FunctionComponent<{}> = () => {
  return <Row>
    <Col xs={12}>
      <h1>Why does this application exist?</h1>
      <blockquote className="blockquote">Short story: I couldn't find an exercise application that fit my needs without extra lull-lull.</blockquote>
      <div>
        A slighter longer story: After I started at LiU and got hooked with the student life (partying and studying, and that was it), my motivation for exercise in any kind was gone. I had a few periods where I began to exercise again, but nothing that stuck. After we moved to Karlstad I was quite heavy (think I weighted above 100kg at some point) so I got a healthier life-style (hard not to after LiU ;P ). Anyway, when I exercised the most I had a workout diary where I recorded eeeeeverything, which was in a pad and I had a pen to write with. I wanted to start a new workout diary but I felt that paper and pen was a bit dated, so I started to think about to build an app obviously. This took me about 2 years to start with, and here we are! This application have everything <strong>I</strong> need from an exercise application, but it's highly customizable so if <strong>you</strong> have any other needs and wished, hit me up with an e-mail or write an issue on GitHub <span role="img" aria-label="" aria-labelledby="">❤️</span>
      </div>
    </Col>
  </Row>;
};

export default Faq;