import React from 'react';
import { Link } from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/withStyles';
import Helmet from 'react-helmet';
import styles from './style.scss';

class Home extends React.Component {
  Info = () => {
    alert('你点击了我');
  };
  render() {
    return (
      <div className={styles.title}>
        <Helmet title="首页" meta={[{ name: '首页', content: '首页' }]} />
        <div onClick={this.Info}>点我</div>
        <Link to="/list" className={styles.blue}>
          列表页
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
