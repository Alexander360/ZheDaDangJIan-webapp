import Api from './api';
import fetch from './fetch';

/**
 *判断用户是否存在
 */
export const CheckUserIsExit = (data) => fetch.post(Api.CheckUserIsExit.url,
  {...Api.CheckUserIsExit.data, ...data});

/**
 *判断用户在线状态
 */
export const CheckLoginStatus = (data) => fetch.post(Api.CheckLoginStatus.url,
  {...Api.CheckLoginStatus.data, ...data});

/**
 * 微信登录
 */
export const Login = (data) => fetch.post(Api.Login.url, {...Api.Login.data, ...data});

/**
 * 普通登录
 */
export const ValidateUser = (data) => fetch.post(Api.ValidateUser.url,
  {...Api.ValidateUser.data, ...data});

/**
 * 用户信息
 */
export const GetUserInfo = (data) => fetch.post(Api.GetUserInfo.url,
  {...Api.GetUserInfo.data, ...data});

/**
 * 轮播
 */
export const GetLink = (data) => fetch.post(Api.GetLink.url, {...Api.GetLink.data, ...data});

/**
 * 课程列表
 */
export const GetCourseInfoList = (data) => fetch.post(Api.GetCourseInfoList.url,
  {...Api.GetCourseInfoList.data, ...data});

/**
 * 热门课程
 */
export const WeekCourse = (data) => fetch.post(Api.WeekCourse.url,
  {...Api.WeekCourse.data, ...data});
/**
 * 推荐课程
 */
export const RecommendCourse = (data) => fetch.post(Api.RecommendCourse.url,
  {...Api.RecommendCourse.data, ...data});

/**
 * 课程分类
 */
export const GetChannelInfoList = (data) => fetch.post(Api.GetChannelInfoList.url,
  {...Api.GetChannelInfoList.data, ...data});

/**
 * 获取评论
 */
export const GetCommentList = (data) => fetch.get(Api.GetCommentList.url,
  {...Api.GetCommentList.data, ...data});

/**
 * 考试分类
 */
export const GetExamType = (data) => fetch.post(Api.GetExamType.url,
  {...Api.GetExamType.data, ...data});

/**
 * 考试列表
 */
export const GetExamList = (data) => fetch.post(Api.GetExamList.url,
  {...Api.GetExamList.data, ...data});

/**
 * 获取考试题
 */
export const GetExam = (data) => fetch.post(Api.GetExam.url, {...Api.GetExam.data, ...data});

/**
 * 提交考试题
 */
export const UpdateUserExam = (data) => fetch.post(Api.UpdateUserExam.url,
  {...Api.UpdateUserExam.data, ...data});
/**
 * 退出登录
 */
export const LoginOut = (data) => fetch.post(Api.LoginOut.url, {...Api.LoginOut.data, ...data});

/**
 * 消息中心
 */
export const GetMessageCenter = (data) => fetch.post(Api.GetMessageCenter.url,
  {...Api.GetMessageCenter.data, ...data});

/**
 * 通知内容
 */
export const GetNoticeInfoContent = (data) => fetch.get(
  Api.GetNoticeInfoContent.url + '/' + data.Id, {...Api.GetNoticeInfoContent.data, ...data});

/**
 * 课程详情
 */
export const GetCourseDetail = (data) => fetch.post(Api.GetCourseDetail.url,
  {...Api.GetCourseDetail.data, ...data});

/**
 *  历史记录 Type => All:表示所有， Today:表示今天记录，Earlier:表示更早
 */
export const GetHistoryCourse = (data) => fetch.post(Api.GetHistoryCourse.url,
  {...Api.GetHistoryCourse.data, ...data});

/**
 *  用户课程列表 Finish => 1：完成课程，0：未完成课程 ,2：表示全部
 */
export const GetUserCourseInfoList = (data) => fetch.post(Api.GetUserCourseInfoList.url,
  {...Api.GetUserCourseInfoList.data, ...data});

/**
 *  文章频道
 */
export const GetArticleChannelInfoList = (data) => fetch.post(Api.GetArticleChannelInfoList.url,
  {...Api.GetArticleChannelInfoList.data, ...data});

/**
 *  文章列表
 */
export const GetArticleInfoList = (data) => fetch.post(Api.GetArticleInfoList.url,
  {...Api.GetArticleInfoList.data, ...data});

/**
 *  文章详情
 */
export const ArticleDetail = (data) => fetch.post(Api.ArticleDetail.url,
  {...Api.ArticleDetail.data, ...data});

/**
 *  通知公告
 */
export const GetNoticeInfoList = (data) => fetch.post(Api.GetNoticeInfoList.url,
  {...Api.GetNoticeInfoList.data, ...data});

/**
 *  排行榜 RankType => 1：学时， 2：课程，3：单位
 */
export const GetRankInfoList = (data) => fetch.post(Api.GetRankInfoList.url,
  {...Api.GetRankInfoList.data, ...data});

/**
 *  培训班分类
 */
export const GetTrainingTypeList = (data) => fetch.post(Api.GetTrainingTypeList.url,
  {...Api.GetTrainingTypeList.data, ...data});
/**
 *  线上培训班分类
 */
export const GetOnlineTrainingTypeList = (data) => fetch.post(Api.GetOnlineTrainingTypeList.url,
  {...Api.GetOnlineTrainingTypeList.data, ...data});
/**
 *  线下培训班分类
 */
export const GetOfflineTrainingTypeList = (data) => fetch.post(Api.GetOfflineTrainingTypeList.url,
  {...Api.GetOfflineTrainingTypeList.data, ...data});

/**
 *  培训班列表 JoinStatus => Join：参加； UnJoin：未参加 ；UnAudit：审核中；
 */
export const GetTrainingClass = (data) => fetch.post(Api.GetTrainingClass.url,
  {...Api.GetTrainingClass.data, ...data});

/**
 *  培训班详情
 */
export const GetTrainingDetail = (data) => fetch.post(Api.GetTrainingDetail.url,
  {...Api.GetTrainingDetail.data, ...data});
/**
 *  培训班课程
 */
export const GetClassCourseInfoList = (data) => fetch.post(Api.GetClassCourseInfoList.url,
  {...Api.GetClassCourseInfoList.data, ...data});
/**
 *  培训班考试
 */
export const GetClassExamList = (data) => fetch.post(Api.GetClassExamList.url,
  {...Api.GetClassExamList.data, ...data});
/**
 *  培训班日程
 */
export const GetTrainingScheduleList = (data) => fetch.get(Api.GetTrainingScheduleList.url + data);
/**
 *  培训班日程请假
 */
export const TrainingLeaveCreate = (data) => fetch.post(Api.TrainingLeaveCreate.url,
  {...Api.TrainingLeaveCreate.data, ...data});

/**
 *  签到列表
 */
export const GetClassUserSignList = (data) => fetch.post(Api.GetClassUserSignList.url,
  {...Api.GetClassUserSignList.data, ...data});

/**
 *  获取微信签名
 */
export const GetWechatWxAuthModel = (data) => fetch.post(Api.GetWechatWxAuthModel.url,
  {...Api.GetWechatWxAuthModel.data, ...data});

/**
 *  签到或签退
 */
export const TrainingSignIn = (data) => fetch.post(Api.TrainingSignIn.url,
  {...Api.TrainingSignIn.data, ...data});

/**
 *  取消报名
 */
export const UpdateTrainingStudentdown = (data) => fetch.post(Api.UpdateTrainingStudentdown.url,
  {...Api.UpdateTrainingStudentdown.data, ...data});

/**
 *  报名培训班
 */
export const UpdateTrainingStudentup = (data) => fetch.post(Api.UpdateTrainingStudentup.url,
  {...Api.UpdateTrainingStudentup.data, ...data});

/**
 *  电子书
 */
export const GetBookInfoList = (data) => fetch.post(Api.GetBookInfoList.url,
  {...Api.GetBookInfoList.data, ...data});

/**
 *  电子书章节
 */
export const GetBookChapterInfoList = (data) => fetch.post(Api.GetBookChapterInfoList.url,
  {...Api.GetBookChapterInfoList.data, ...data});

/**
 *  电子书章节内容
 */
export const GetBookChapterContent = (data) => fetch.post(Api.GetBookChapterContent.url,
  {...Api.GetBookChapterContent.data, ...data});

/**
 *  留言类型
 */
export const CommentType = (data) => fetch.post(Api.CommentType.url,
  {...Api.CommentType.data, ...data});

/**
 *  添加留言
 */
export const AddMessage = (data) => fetch.post(Api.AddMessage.url,
  {...Api.AddMessage.data, ...data});

/**
 *  修改用户信息
 */
export const UpdateUserInfo = (data) => fetch.post(Api.UpdateUserInfo.url,
  {...Api.UpdateUserInfo.data, ...data});

/**
 *  获取职级列表
 */
export const GetGradeList = (data) => fetch.post(Api.GetGradeList.url,
  {...Api.GetGradeList.data, ...data});

/**
 *  获取学历列表
 */
export const GetDegreeList = (data) => fetch.post(Api.GetDegreeList.url,
  {...Api.GetDegreeList.data, ...data});

/**
 *  修改手机号
 */
export const UpdateMobile = (data) => fetch.post(Api.UpdateMobile.url,
  {...Api.UpdateMobile.data, ...data});

/**
 *  发送验证码
 */
export const SendMsg = (data) => fetch.post(Api.SendMsg.url, {...Api.SendMsg.data, ...data});

/**
 *  修改密码
 */
export const SetUserPassword = (data) => fetch.post(Api.SetUserPassword.url,
  {...Api.SetUserPassword.data, ...data});

/**
 *  单位列表
 */
export const GetGroupList = (data) => fetch.post(Api.GetGroupList.url,
  {...Api.GetGroupList.data, ...data});

/**
 *  注册
 */
export const Register = (data) => fetch.post(Api.Register.url, {...Api.Register.data, ...data});

/**
 *  讨论列表
 */
export const DiscussList = (data) => fetch.post(Api.DiscussList.url,
  {...Api.DiscussList.data, ...data});

/**
 *  添加讨论
 */
export const AddDiscuss = (data) => fetch.post(Api.AddDiscuss.url,
  {...Api.AddDiscuss.data, ...data});

/**
 *  课程评论
 */
export const getCourseCommentList = (data) => fetch.post(Api.getCourseCommentList.url,
  {...Api.getCourseCommentList.data, ...data});

/**
 *  添加课程评论
 */
export const AddCourseComment = (data) => fetch.post(Api.AddCourseComment.url,
  {...Api.AddCourseComment.data, ...data});

/**
 *  添加评论 objType 0：文章、1：课程、2：电子书、3：学习圈
 */
export const AddComment = (data) => fetch.post(Api.AddComment.url,
  {...Api.AddComment.data, ...data});

/**
 *  提交精品课程进度
 */
export const SyncUserStudyData = (data) => fetch.post(Api.SyncUserStudyData.url,
  {...Api.SyncUserStudyData.data, ...data});

/**
 *  提交Mp4课程进度
 */
export const UploadTimeNode = (data) => fetch.post(Api.UploadTimeNode.url,
  {...Api.UploadTimeNode.data, ...data});

/**
 *  相关课程
 */
export const RelatedCourse = (data) => fetch.post(Api.RelatedCourse.url,
  {...Api.RelatedCourse.data, ...data});

/**
 *  成果展示分类
 */
export const GetProductionTypeInfoList = (data) => fetch.post(Api.GetProductionTypeInfoList.url,
  {...Api.GetProductionTypeInfoList.data, ...data});

/**
 *  成果展示列表
 */
export const GetProductionInfoList = (data) => fetch.post(Api.GetProductionInfoList.url,
  {...Api.GetProductionInfoList.data, ...data});

/**
 *  成果展示详情
 */
export const GetProductionInfo = (data) => fetch.post(Api.GetProductionInfo.url,
  {...Api.GetProductionInfo.data, ...data});

/**
 *  学习档案
 */
export const GetUserRecordList = (data) => fetch.post(Api.GetUserRecordList.url,
  {...Api.GetUserRecordList.data, ...data});

/**
 *  收藏列表
 */
export const GetCollectionList = (data) => fetch.post(Api.GetCollectionList.url,
  {...Api.GetCollectionList.data, ...data});

/**
 *  添加收藏 objType 0：文章、1：课程、2：电子书、3：学习圈
 */
export const AddCollectionList = (data) => fetch.post(Api.AddCollectionList.url,
  {...Api.AddCollectionList.data, ...data});

/**
 *  删除收藏
 */
export const DeleteCollectionList = (data) => fetch.post(Api.DeleteCollectionList.url,
  {...Api.DeleteCollectionList.data, ...data});

/**
 *  考试记录
 */
export const GetPaperList = (data) => fetch.post(Api.GetPaperList.url,
  {...Api.GetPaperList.data, ...data});

/**
 *  课程笔记列表
 */
export const GetExperience = (data) => fetch.post(Api.GetExperience.url,
  {...Api.GetExperience.data, ...data});

/**
 *  添加课程笔记
 */
export const AddExperience = (data) => fetch.post(Api.AddExperience.url,
  {...Api.AddExperience.data, ...data});

/**
 *  课程笔记详情
 */
export const GetExperienceById = (data) => fetch.post(Api.GetExperienceById.url,
  {...Api.GetExperienceById.data, ...data});

/**
 *  获取收件箱，发件箱  0：收件、1：发件
 */
export const GetUserMessage = (data) => fetch.post(Api.GetUserMessage.url,
  {...Api.GetUserMessage.data, ...data});

/**
 *  根据用户名查询用户
 */
export const GetUserByName = (data) => fetch.post(Api.GetUserByName.url,
  {...Api.GetUserByName.data, ...data});

/**
 *  发送站内信
 */
export const AddUserMessage = (data) => fetch.post(Api.AddUserMessage.url,
  {...Api.AddUserMessage.data, ...data});

/**
 *  站内信详情
 */
export const GetMessage = (data) => fetch.post(Api.GetMessage.url,
  {...Api.GetMessage.data, ...data});
/**
 *  点赞 0：文章 1：课程 2：电子书 3：学习圈 4：成果展示
 */
export const AddUserAiss = (data) => fetch.post(Api.AddUserAiss.url,
  {...Api.AddUserAiss.data, ...data});
/**
 *  上传附件（FileCode:文件名，FileType: TrainingAttachment）
 */
export const UploadAttachment = (data, config) => fetch.postFormData(
  '/api/WeChatFile/UploadAttachment', data, config);
/**
 *  三会一课列表
 */
export const MeetRecordPageList = (data) => fetch.post(Api.MeetRecordPageList.url,
  {...Api.MeetRecordPageList.data, ...data});
/**
 *  三会一课--添加会议
 */
export const MeetRecordCreate = (data) => fetch.post(Api.MeetRecordCreate.url,
  {...Api.MeetRecordCreate.data, ...data});
/**
 *  三会一课--会议详细
 */
export const MeetRecordDetail = (data) => fetch.post(Api.MeetRecordDetail.url + data);
/**
 *  三会一课--会议图片
 */
export const MeetPhotoCreate = (data) => fetch.post(Api.MeetPhotoCreate.url,
  {...Api.MeetPhotoCreate.data, ...data});
/**
 *  三会一课--会议详细
 */
export const MeetPhotoDetail = (data) => fetch.post(Api.MeetPhotoDetail.url + data);
