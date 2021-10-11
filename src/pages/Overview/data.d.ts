export type TableListItem = {
  id: string;
  projectId: string;
  expId: string;
  name: string;
  expName: string;
  tags: string[];
  insLibId: string;
  anaLibId: string;
  type: string;
  params: any;
  createDate: string;
  lastModifiedDate: string;
  statistic: any;
  weights: any;
  note: string;
  featureMap: any;
  minTotalScore: number;
  defaultOne: boolean;
  repick: boolean;
};

export type TableListPagination = {
  pageSize: number;
  totalNum: number;
  totalPage: number;
  currentPageNo: number;
};
