import React from 'react';
import Home from './components/Home/index';
import List from './components/List/index';

export default [
  {
    path: '/list',
    component: List,
    loadData: List.loadData,
    key: 'list',
    exact: true,
  },
  {
    path: '/',
    component: Home,
    key: 'home',
  },
];
