import { MusicGroupModel } from "generated/prisma/models";

export type MusicGroupWrapper = ReturnType<typeof musicGroupWrapper>

export const musicGroupWrapper = (m: MusicGroupModel) => {
    return {
        ...m,
    }
}