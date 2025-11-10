import { FastifySchema } from "fastify"
import S from "fluent-json-schema"
import { MusicGroupStatus } from "generated/prisma/enums"
import { MUSIC_GROUP_STATUS } from "schemas/musicGroup"
import { paginationSchema } from "types/pagination"

const groupResponse = S.object()
	.prop("slug", S.string())
	.prop("image", S.string())
	.prop("followers", S.number())
	.prop("title", S.string())
	.prop("description", S.string())
	.prop("status", S.enum(MUSIC_GROUP_STATUS))
	.prop("isActive", S.boolean())
    .prop("concerts", S.number())

export const GROUPS_PER_PAGE = 10

const groupList: FastifySchema = {
	querystring: paginationSchema(GROUPS_PER_PAGE),
	response: {
		200: S.array().items(groupResponse)
	}
}

export interface createGroupBody {
	title: string
	description?: string
	image?: string
	status?: MusicGroupStatus
    isActive?: boolean
}

const createGroup: FastifySchema = {
	body: S.object()
		.prop("title", S.string())
		.prop("description", S.string())
		.prop("image", S.string())
		.prop("status", S.enum(MUSIC_GROUP_STATUS))
		.prop("isActive", S.boolean())
		.required(["title"]),
	response: {
		201: groupResponse
	}
}

export interface updateGroupBody {
	title?: string
	slug?: string
	description?: string
	image?: string
	status?: MusicGroupStatus
	isActive?: boolean
}

const updateGroup: FastifySchema = {
	body: S.object()
		.prop("title", S.string())
		.prop("slug", S.string())
		.prop("description", S.string())
		.prop("image", S.string())
		.prop("status", S.enum(MUSIC_GROUP_STATUS))
		.prop("isActive", S.boolean())
		.minProperties(1),
	response: {
		200: groupResponse
	}
}

export const dashboardMusicGroupsSchemas = { groupList, createGroup, updateGroup }