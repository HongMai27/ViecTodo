interface IUser {
    email: string
    name: string
    password: string
    avatar: string
  }
  
  interface IAuthenticatedUser {
    email: string
    name: string
  }
  
  export interface IColor {
    name: string
    id: string
    code: string
  }
  
  export interface IIcon {
    name: string
    id: string
    symbol: string
  }
  export type ParamList = {
    Home: undefined;
    TaskDetail: { task: ITask, categories: ICategory[] };
  }
  
  interface ICategory {
    _id: string
    name: string
    user: IUser | string
    isEditable: boolean
    color: IColor
    icon: IIcon
  }
  
  interface ICategoryRequest {
    name: string
    color: IColor
    icon: IIcon
  }
  
  interface ITask {
    _id: string
    name: string
    isCompleted: boolean
    categoryId: string
    createdAt: string
    date: string
    description: string
  }
  
  interface ITaskRequest {
    name: string
    isCompleted: boolean
    categoryId: string
    date: string
    description: string
  }
  