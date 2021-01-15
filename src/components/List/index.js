import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../store/actions/global';
import Helmet from 'react-helmet';

class List extends Component {
  componentDidMount() {
    this.init();
  }

  init = () => {
    this.props.actions.getList();
  };

  render() {
    const { list = [], name } = this.props;

    return (
      <div>
        <Helmet title="列表页" meta={[{ name: '列表页', content: '列表页' }]} />
        {name},欢迎你
        <br />
        <Link to="/">index</Link>
        <ul>
          {list.map((item) => {
            return (
              <li key={item.name}>
                name:{item.name} -- score:{item.score}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

/**
 * store.dispatch的返回结果就等于actions.getList()函数里返回的那个Promise
 *
 * @param {*} store
 */
List.loadData = (store) => {
  return store.dispatch(actions.getList()); //ssr目前也是请求远程服务器的数据随后装载进store中
};

const mapStateToProps = (state) => {
  return {
    list: state.global.list,
    name: state.global.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
