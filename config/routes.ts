export default [
  // 主界面
  { path: '/', component: './Library' },
  // // 登陆界面
  // {
  //   path: '/user',
  //   layout: false,
  //   routes: [
  //     {
  //       path: '/user',
  //       routes: [
  //         {
  //           name: 'login',
  //           path: '/user/login',
  //           component: './user/Login',
  //         },
  //       ],
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // 字典界面
  {
    path: '/dict',
    name: 'dict-list',
    icon: 'smile',
    component: './Dict',
  },
  // 项目界面
  {
    name: 'project-list',
    icon: 'profile',
    path: '/project',
    component: './Project',
  },
  // 标准库界面
  {
    name: 'library',
    path: '/library',
    icon: 'hdd',
    routes: [
      {
        path: '/library/list',
        name: 'library-list',
        icon: 'hdd',
        component: './Library',
      },
      {
        path: '/library/peptide',
        name: 'peptide-list',
        icon: 'smile',
        component: './Library/Peptide',
      },
      {
        component: './404',
      },
    ],
  },

  // 蛋白库界面
  {
    name: 'protein-list',
    icon: 'profile',
    path: '/protein',
    component: './Protein',
  },
  // 方法库界面
  {
    name: 'method-list',
    icon: 'profile',
    path: '/method',
    component: './Method',
  },
  // 实验列表界面
  {
    name: 'experiment-list',
    icon: 'profile',
    path: '/experiment',
    component: './Experiment',
  },

  // 404
  {
    component: './404',
  },
];
