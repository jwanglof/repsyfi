import React, {FunctionComponent} from 'react';
import {Col, Row} from 'reactstrap';

const News: FunctionComponent<INewsProps> = () => {
  const news: Array<INewsArticle> = [
    {
      heading: "First!",
      body: "This is a body",
      createdTimestamp: Date.now()
    }
  ];

  return <Row>
    {news.map((n: INewsArticle) => <><Col xs={12}><h2>{n.heading}</h2></Col><Col xs={12}>{n.body}</Col></>)}
  </Row>;
};

interface INewsProps {}

interface INewsArticle {
  heading: string,
  body: string,
  createdTimestamp: number
}

export default News;