import { callApi } from "./utils"

export const GetAllFile = () => {
  return callApi('get', '/file')
}

export const CreateFile = (data) => {
  return callApi('post', '/file/create', data)
}

export const DeleteFile = (uuid) => {
  return callApi('delete', '/file/delete/'+uuid)
}

export const UpdateFile = (data) => {
  return callApi('put', '/file/update', data)
}