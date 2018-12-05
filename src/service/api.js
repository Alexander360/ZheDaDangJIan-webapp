/**
 * 页面接口api
 */
const API_URL = '/api';
const Platform = '/wechat';
/*
* 账号：jyadmin 密码：666666
* */
export default {
  //判断用户是否存在
  CheckUserIsExit: {
    url: API_URL + Platform + '/CheckUserIsExit',
    data: {Account: ''}
  },
  //判断用户在线状态
  CheckLoginStatus: {
    url: API_URL + Platform + '/CheckLoginStatus',
    data: {Mac: ''}
  },
  //微信--登录
  Login: {
    url: API_URL + Platform + '/Login',
    data: {Code: '', Account: '', Password: '', Mac: '', CId: ''}
  },
  //普通浏览器--登录
  ValidateUser: {
    url: API_URL + Platform + '/ValidateUser',
    data: {Account: '', Password: '', Mac: '', CId: ''}
  },
  //获取用户信息
  GetUserInfo: {
    url: API_URL + Platform + '/GetUserInfo',
    data: {}
  },
  //轮播
  GetLink: {
    url: API_URL + Platform + '/GetLink',
    data: {Page: 1, Rows: 5}
  },
  //课程列表
  GetCourseInfoList: {
    url: API_URL + Platform + '/GetCourseInfoList',
    data: {
      TeacherName: '',
      ChannelId: '',
      Keyword: '',
      Sort: 'Id',
      Order: 'desc',
      Page: '1',
      Rows: '10'
    }
  },
  //热门课程
  WeekCourse: {
    url: API_URL + Platform + '/WeekCourse',
    data: {
      TeacherName: '',
      ChannelId: '',
      Keyword: '',
      Sort: 'Id',
      Order: 'desc',
      Page: '1',
      Rows: '10'
    }
  },
  // 推荐课程
  RecommendCourse: {
    url: API_URL + Platform + '/RecommendCourse',
    data: {Page: 1, Rows: 2}
  },
  //课程分类
  GetChannelInfoList: {
    url: API_URL + Platform + '/GetChannelInfoList',
    data: {ParentId: 0}
  },
  //获取评论 0:文章，1：课程，2：电子书，3：学习圈，4：成果展示
  GetCommentList: {
    url: API_URL + Platform + '/GetCommentList',
    data: {objType: '', objId: ''}
  },
  //考试分类
  GetExamType: {
    url: API_URL + Platform + '/GetExamType',
    data: {ParentId: 0, ParentCode: ''}
  },
  //考试列表
  GetExamList: {
    url: API_URL + Platform + '/GetExamList',
    data: {ExamType: 'All', TypeId: '', Keyword: '', Page: 1, Rows: 10}
  },
  //获取考试题
  GetExam: {
    url: API_URL + Platform + '/GetExam',
    data: {Id: ''}
  },
  //提交考试题
  UpdateUserExam: {
    url: API_URL + Platform + '/UpdateUserExam',
    data: {ExamId: '', Data: null}
  },
  //退出登录
  LoginOut: {
    url: API_URL + Platform + '/LoginOut',
    data: {Mac: ''}
  },
  //消息中心
  GetMessageCenter: {
    url: API_URL + Platform + '/GetMessageCenter',
    data: {Page: 1, Rows: 10, Keyword: ''}
  },
  //通知内容
  GetNoticeInfoContent: {
    url: API_URL + Platform + '/GetNoticeInfoContent',
    data: {}
  },
  //课程详情
  GetCourseDetail: {
    url: API_URL + Platform + '/GetCourseDetail',
    data: {Id: ''}
  },
  //历史记录 Type => All:表示所有， Today:表示今天记录，Earlier:表示更早
  GetHistoryCourse: {
    url: API_URL + Platform + '/GetHistoryCourse',
    data: {Type: '', Keyword: '', Sort: 'sort', Order: 'desc', Page: 1, Rows: 20}
  },
  //用户课程列表 Finish => 1：完成课程，0：未完成课程 ,2：表示全部
  GetUserCourseInfoList: {
    url: API_URL + Platform + '/GetUserCourseInfoList',
    data: {Finish: '2', Keyword: '', Page: 1, Rows: 10}
  },
  //文章频道
  GetArticleChannelInfoList: {
    url: API_URL + Platform + '/GetArticleChannelInfoList',
    data: {ParentId: '', ParentCode: ''}
  },
  //文章列表
  GetArticleInfoList: {
    url: API_URL + Platform + '/GetArticleInfoList',
    data: {CategoryId: '', Keyword: '', CategoryCode: '', Page: '1', Rows: '10'}
  },
  //文章详情
  ArticleDetail: {
    url: API_URL + Platform + '/ArticleDetail',
    data: {Id: ''}
  },
  //通知公告
  GetNoticeInfoList: {
    url: API_URL + Platform + '/GetNoticeInfoList',
    data: {Keyword: '', Page: '1', Rows: '10'}
  },
  //排行榜 RankType => 1：学时， 2：课程，3：单位
  GetRankInfoList: {
    url: API_URL + Platform + '/GetRankInfoList',
    data: {RankType: '', TotalCount: '20'}
  },
  //培训班分类
  GetTrainingTypeList: {
    url: API_URL + Platform + '/GetTrainingTypeList?IsOnline=1',
    data: {}
  },
  //培训班分类
  GetOnlineTrainingTypeList: {
    url: API_URL + Platform + '/GetTrainingTypeList?IsOnline=1',
    data: {}
  },
  //培训班分类
  GetOfflineTrainingTypeList: {
    url: API_URL + Platform + '/GetTrainingTypeList?IsOnline=0',
    data: {}
  },
  //培训班列表 JoinStatus => Join：参加； UnJoin：未参加 ；UnAudit：审核中；
  GetTrainingClass: {
    url: API_URL + Platform + '/GetTrainingClass',
    data: {TypeId: '', TrainName: '', JoinStatus: '', Page: '1', Rows: '20'}
  },
  //培训班详情
  GetTrainingDetail: {
    url: API_URL + Platform + '/GetTrainingDetail',
    data: {Id: ''}
  },
  //培训班课程
  GetClassCourseInfoList: {
    url: API_URL + Platform + '/GetClassCourseInfoList',
    data: {TrainingId: '', Page: 1, Rows: 10, Sort: 'Sort', Order: 'desc'}
  },
  //培训班考试
  GetClassExamList: {
    url: API_URL + Platform + '/GetClassExamList',
    data: {Id: ''}
  },
  // 培训班日程
  GetTrainingScheduleList: {
    url: API_URL + Platform + '/GetTrainingScheduleList?TCID=',
    data: {}
  },
  // 培训班请假
  TrainingLeaveCreate: {
    url: API_URL + Platform + '/TrainingLeaveCreate',
    data: {TrainingScheduleId: ''}
  },
  //签到列表
  GetClassUserSignList: {
    url: API_URL + Platform + '/GetClassUserSignList',
    data: {TrainingId: '', TodayFlag: '', Order: 'desc', Page: '1', Rows: '20'}
  },
  //获取微信签名
  GetWechatWxAuthModel: {
    url: API_URL + Platform + '/GetWechatWxAuthModel',
    data: {Url: ''}
  },
  //签到或签退
  TrainingSignIn: {
    url: API_URL + Platform + '/TrainingSignIn',
    data: {TrainingId: '', SignType: '', Longitude: '', Latitude: '', Position: ''}
  },
  //取消报名培训班
  UpdateTrainingStudentdown: {
    url: API_URL + Platform + '/UpdateTrainingStudentdown',
    data: {Id: ''}
  },
  //报名培训班
  UpdateTrainingStudentup: {
    url: API_URL + Platform + '/UpdateTrainingStudentup',
    data: {Id: ''}
  },
  //电子书
  GetBookInfoList: {
    url: API_URL + Platform + '/GetBookInfoList',
    data: {Keyword: '', BookTypeId: '', BookTypeCode: '', Page: '1', Rows: '10'}
  },
  //电子书章节
  GetBookChapterInfoList: {
    url: API_URL + Platform + '/GetBookChapterInfoList',
    data: {BookId: '', Page: '1', Rows: '30'}
  },
  //电子书章节内容
  GetBookChapterContent: {
    url: API_URL + Platform + '/GetBookChapterContent',
    data: {Id: ''}
  },
  //留言类型
  CommentType: {
    url: API_URL + Platform + '/CommentType',
    data: {}
  },
  //添加留言
  AddMessage: {
    url: API_URL + Platform + '/AddMessage',
    data: {MainId: '', ParentId: '', Title: '', Content: '', ClassCode: ''}
  },
  //修改用户信息
  /*
  * {
  *   "Account": "sample string 1",
      "Name": "sample string 2",
      "DepartmentName": "sample string 3",
      "GroupId": 4,
      "IdCard": "sample string 5",
      "Email": "sample string 6",
      "Grade": 7,
      "Business": "sample string 8",
      "Sex": "sample string 9",
      "Nation": "sample string 10",
      "Degree": 11,
      "Party": "sample string 12",
      "Birthday": "2017-12-07 14:11:25",
      "Tel": "sample string 14",
      "Mobile": "sample string 15",
      "SmgCode": "sample string 16"
  * }
  * */
  UpdateUserInfo: {
    url: API_URL + Platform + '/UpdateUserInfo',
    data: {}
  },
  //获取职级列表
  GetGradeList: {
    url: API_URL + Platform + '/GetGradeList',
    data: {}
  },
  //获取学历列表
  GetDegreeList: {
    url: API_URL + Platform + '/GetDegreeList',
    data: {}
  },
  //修改手机号
  UpdateMobile: {
    url: API_URL + Platform + '/UpdateMobile',
    data: {OldMobile: '', NewMobile: '', SmgCode: ''}
  },
  //发送验证码
  SendMsg: {
    url: API_URL + Platform + '/SendMsg',
    data: {MobileNo: ''}
  },
  //修改密码
  SetUserPassword: {
    url: API_URL + Platform + '/SetUserPassword',
    data: {OldPassword: '', Password: ''}
  },
  //单位列表
  GetGroupList: {
    url: API_URL + Platform + '/GetGroupList',
    data: {ParentId: '1'}
  },
  //注册
  Register: {
    url: API_URL + Platform + '/Register',
    data: {
      Account: '',
      Password: '',
      Name: '',
      GroupId: '',
      IdCard: '',
      Grade: '',
      Mobile: '',
      SmgCode: '',
      PortalId: 1
    }
  },
  //讨论列表
  DiscussList: {
    url: API_URL + Platform + '/DiscussList',
    data: {MainId: '0', Sort: 'CreateDate', Order: 'desc', Page: '1', Rows: '10'}
  },
  //添加讨论
  AddDiscuss: {
    url: API_URL + Platform + '/AddDiscuss',
    data: {MainId: '0', ParentId: '0', Content: ''}
  },
  //课程评论
  getCourseCommentList: {
    url: API_URL + Platform + '/getCourseCommentList',
    data: {CourseId: '', Keyword: '', Page: '1', Rows: '10'}
  },
  //添加课程评论
  AddCourseComment: {
    url: API_URL + Platform + '/AddCourseComment',
    data: {CourseId: '', Content: '', Score: ''}
  },
  //添加评论 objType 0：文章、1：课程、2：电子书、3：学习圈
  AddComment: {
    url: API_URL + Platform + '/AddComment',
    data: {ObjType: 1, ObjId: 2, Content: '', Star: ''}
  },
  //提交精品课程进度
  SyncUserStudyData: {
    url: API_URL + Platform + '/SyncUserStudyData',
    data: {CourseId: '', Data: {NodeId: '', Time: '', Status: ''}}
  },
  //提交Mp4课程进度
  UploadTimeNode: {
    url: API_URL + Platform + '/UploadTimeNode',
    data: {CourseId: '', TimeNode: ''}
  },
  //相关课程
  RelatedCourse: {
    url: API_URL + Platform + '/RelatedCourse',
    data: {CourseId: '', Page: 1, Rows: 10}
  },
  //成果展示分类
  GetProductionTypeInfoList: {
    url: API_URL + Platform + '/GetProductionTypeInfoList',
    data: {ParentId: '', ParentCode: ''}
  },
  //成果展示列表
  GetProductionInfoList: {
    url: API_URL + Platform + '/GetProductionInfoList',
    data: {CategoryId: '', CategoryCode: '0', Keyword: '', Page: 1, Rows: 10}
  },
  //成果展示详情
  GetProductionInfo: {
    url: API_URL + Platform + '/GetProductionInfo',
    data: {Id: ''}
  },
  //学习档案
  GetUserRecordList: {
    url: API_URL + Platform + '/GetUserRecordList',
    data: {Page: 1, Rows: 10, OrderType: '1', OrderDesc: 'desc'}
  },
  //收藏列表
  GetCollectionList: {
    url: API_URL + Platform + '/GetCollectionList',
    data: {startTime: '', endTime: ''}
  },
  //添加收藏 objType 0：文章、1：课程、2：电子书、3：学习圈
  AddCollectionList: {
    url: API_URL + Platform + '/AddCollectionList',
    data: {CollectionName: '', Remark: '', ObjId: '', ObjType: 0}
  },
  //删除收藏
  DeleteCollectionList: {
    url: API_URL + Platform + '/DeleteCollectionList',
    data: {IdItem: []}
  },
  //考试记录
  GetPaperList: {
    url: API_URL + Platform + '/GetPaperList',
    data: {}
  },
  //课程笔记列表
  GetExperience: {
    url: API_URL + Platform + '/GetExperience',
    data: {CourseId: ''}
  },
  //添加课程笔记
  AddExperience: {
    url: API_URL + Platform + '/AddExperience',
    data: {CourseId: '', ExperienceContent: '', ExperienceTitle: ''}
  },
  //课程笔记详情
  GetExperienceById: {
    url: API_URL + Platform + '/GetExperienceById  ',
    data: {ExperienceId: ''}
  },
  //获取收件箱，发件箱  0：收件、1：发件
  GetUserMessage: {
    url: API_URL + Platform + '/GetUserMessage',
    data: {MessageType: ''}
  },
  //根据用户名查询用户
  GetUserByName: {
    url: API_URL + Platform + '/GetUserByName',
    data: {UserName: ''}
  },
  //发送站内信
  AddUserMessage: {
    url: API_URL + Platform + '/AddUserMessage',
    data: {ToUser: '', MessageContent: '', MessageTitle: ''}
  },
  //站内信详情
  GetMessage: {
    url: API_URL + Platform + '/GetMessage',
    data: {MessageId: ''}
  },
  //点赞 0：文章 1：课程 2：电子书 3：学习圈 4：成果展示
  AddUserAiss: {
    url: API_URL + Platform + '/AddUserAiss',
    data: {ObjId: '', ObjType: 4}
  },
  // 三会一课列表
  MeetRecordPageList: {
    url: API_URL + Platform + 'Meet/MeetRecordPageList',
    data: {Page: 1, Rows: 10, Order: 'desc', Sort: 'Sort'}
  },
  // 三会一课--添加会议
  MeetRecordCreate: {
    url: API_URL + Platform + 'Meet/MeetRecordCreate',
    data: {}
  },
  // 三会一课--添加会议
  MeetRecordDetail: {
    url: API_URL + Platform + 'Meet/MeetRecordDetail?id=',
    data: {}
  },
  // 三会一课--添加会议图片
  MeetPhotoCreate: {
    url: API_URL + Platform + 'Meet/MeetPhotoCreate',
    data: {}
  },
  // 三会一课--会议图片
  MeetPhotoDetail: {
    url: API_URL + Platform + 'Meet/MeetPhotoDetail?id=',
    data: {}
  }
};
