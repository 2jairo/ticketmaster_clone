import { PrismaClient } from "generated/prisma/client";
import { AdminModelWrapper } from "./admin";
import { MusicGroupWrapper } from "./musicGroup";

export interface PrismaModelWrappers {
    // user: UserModel
    admin: AdminModelWrapper,
    // category: CategoryModel
    // comment: CommentModel
    musicGroup: MusicGroupWrapper
    // concert: ConcertModel
}

export class ModelWrapper<
    M extends keyof PrismaModelWrappers, 
    W extends PrismaModelWrappers[M]
> {
    private m: PrismaClient[M]

    constructor(
        prisma: PrismaClient, 
        model: M,
        private wrapper: (data: any) => W
    ) {
        this.m = prisma[model]
    }

    async findUnique(args: Parameters<PrismaClient[M]['findUnique']>[0]) {
        const resp = (this.m as any).findUnique(args) as ReturnType<PrismaClient[M]['findUnique']>;
        return resp.then((v) => (v ? this.wrapper(v) : null));
    }

    async findUniqueOrThrow(args: Parameters<PrismaClient[M]['findUniqueOrThrow']>[0]) {
        const resp = (this.m as any).findUniqueOrThrow(args) as ReturnType<PrismaClient[M]['findUniqueOrThrow']>;
        return resp.then((v) => this.wrapper(v));
    }

    async findMany(args?: Parameters<PrismaClient[M]['findMany']>[0]) {
        const resp = (this.m as any).findMany(args) as ReturnType<PrismaClient[M]['findMany']>;
        return resp.then((arr ) => arr.map((v) => this.wrapper(v)));
    }

    async findFirst(args: Parameters<PrismaClient[M]['findFirst']>[0]) {
        const resp = (this.m as any).findFirst(args) as ReturnType<PrismaClient[M]['findFirst']>
        return resp.then((v) => v ? this.wrapper(v) : null)
    }

    async findFirstOrThrow(args: Parameters<PrismaClient[M]['findFirstOrThrow']>[0]) {
        const resp = (this.m as any).findFirstOrThrow(args) as ReturnType<PrismaClient[M]['findFirstOrThrow']>;
        return resp.then((v) => this.wrapper(v));
    }

    async findRaw<T = any>(...args: any[]) {
        return (this.m as any).findRaw(...args) as Promise<T>;
    }

    async create(args: Parameters<PrismaClient[M]['create']>[0]) {
        const resp = (this.m as any).create(args) as ReturnType<PrismaClient[M]['create']>;
        return resp.then((v) => this.wrapper(v));
    }

    async createMany(args: Parameters<PrismaClient[M]['createMany']>[0]) {
        return (this.m as any).createMany(args) as ReturnType<PrismaClient[M]['createMany']>;
    }

    async update(args: Parameters<PrismaClient[M]['update']>[0]) {
        const resp = (this.m as any).update(args) as ReturnType<PrismaClient[M]['update']>;
        return resp.then((v) => this.wrapper(v));
    }

    async updateMany(args: Parameters<PrismaClient[M]['updateMany']>[0]) {
        const resp = (this.m as any).updateMany(args) as ReturnType<PrismaClient[M]['updateMany']>;
        return resp
    }

    async upsert(args: Parameters<PrismaClient[M]['upsert']>[0]) {
        const resp = (this.m as any).upsert(args) as ReturnType<PrismaClient[M]['upsert']>;
        return resp.then((v) => this.wrapper(v));
    }

    async delete(args: Parameters<PrismaClient[M]['delete']>[0]) {
        const resp = (this.m as any).delete(args) as ReturnType<PrismaClient[M]['delete']>;
        return resp.then((v) => this.wrapper(v));
    }

    async deleteMany(args: Parameters<PrismaClient[M]['deleteMany']>[0]) {
        return (this.m as any).deleteMany(args) as ReturnType<PrismaClient[M]['deleteMany']>;
    }

    async aggregate(args: Parameters<PrismaClient[M]['aggregate']>[0]) {
        return (this.m as any).aggregate(args) as ReturnType<PrismaClient[M]['aggregate']>;
    }

    async aggregateRaw(args: Parameters<PrismaClient[M]['aggregateRaw']>[0]) {
        return (this.m as any).aggregateRaw(args) as ReturnType<PrismaClient[M]['aggregateRaw']>;
    }

    async count(args?: Parameters<PrismaClient[M]['count']>[0]) {
        return (this.m as any).count(args) as ReturnType<PrismaClient[M]['count']>;
    }

    async groupBy(args: Parameters<PrismaClient[M]['groupBy']>[0]) {
        return (this.m as any).groupBy(args) as ReturnType<PrismaClient[M]['groupBy']>;
    }
}