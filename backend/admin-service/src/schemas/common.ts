import S from 'fluent-json-schema'
import { USER_ROLES } from './user'

export const USERNAME_MAX_LENGTH = 40
export const EMAIL_MAX_LENGTH = 80
export const PASSWORD_MAX_LENGTH = 80
export const COMMENT_MAX_LENGTH = 500
export const AVATAR_IMAGE_MAX_LENGTH = 150

const userResponse = (withToken: boolean) => {
    let tmp = S.object()
        .prop('username', S.string().required().maxLength(USERNAME_MAX_LENGTH))
        .prop('email', S.string().required().maxLength(EMAIL_MAX_LENGTH))
        .prop('image', S.string().required())
        .prop('role', S.enum(USER_ROLES).required())
    if(withToken) {
        tmp = tmp.prop('token', S.string().required())
    }
    return tmp
}




export const schemaCommon = { userResponse }