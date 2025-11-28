import { UserModelWrapper } from "./user";
import { MusicGroupWrapper } from "./musicGroup";
import { CategoryWrapper } from "./category";
import { ExtendedPrismaClient } from '../plugins/prisma/prisma'
import { ConcertModelWrapper } from "./concert";
import { ShoppingCartModelWrapper } from "./shoppingCart";

export interface PrismaModelWrappers {
    user: UserModelWrapper
    // category: CategoryModel
    // comment: CommentModel
    musicGroup: MusicGroupWrapper
    category: CategoryWrapper
    concert: ConcertModelWrapper
    shoppingCart: ShoppingCartModelWrapper
}

export class ModelWrapper<
    M extends keyof PrismaModelWrappers, 
    W extends PrismaModelWrappers[M]
> {
    private m: ExtendedPrismaClient[M]

    constructor(
        prisma: ExtendedPrismaClient, 
        model: M,
        private wrapper: (data: any) => W
    ) {
        this.m = prisma[model]
    }

    async findUnique(args: Parameters<ExtendedPrismaClient[M]['findUnique']>[0]) {
        const resp = (this.m as any).findUnique(args) as ReturnType<ExtendedPrismaClient[M]['findUnique']>;
        return resp.then((v) => (v ? this.wrapper(v) : null));
    }

    async findUniqueOrThrow(args: Parameters<ExtendedPrismaClient[M]['findUniqueOrThrow']>[0]) {
        const resp = (this.m as any).findUniqueOrThrow(args) as ReturnType<ExtendedPrismaClient[M]['findUniqueOrThrow']>;
        return resp.then((v) => this.wrapper(v));
    }

    async findMany(args?: Parameters<ExtendedPrismaClient[M]['findMany']>[0]) {
        const resp = (this.m as any).findMany(args) as ReturnType<ExtendedPrismaClient[M]['findMany']>;
        return resp.then((arr ) => arr.map((v) => this.wrapper(v)));
    }

    async findFirst(args: Parameters<ExtendedPrismaClient[M]['findFirst']>[0]) {
        const resp = (this.m as any).findFirst(args) as ReturnType<ExtendedPrismaClient[M]['findFirst']>
        return resp.then((v) => v ? this.wrapper(v) : null)
    }

    async findFirstOrThrow(args: Parameters<ExtendedPrismaClient[M]['findFirstOrThrow']>[0]) {
        const resp = (this.m as any).findFirstOrThrow(args) as ReturnType<ExtendedPrismaClient[M]['findFirstOrThrow']>;
        return resp.then((v) => this.wrapper(v));
    }

    async findRaw<T = any>(...args: any[]) {
        return (this.m as any).findRaw(...args) as Promise<T>;
    }

    async create(args: Parameters<ExtendedPrismaClient[M]['create']>[0]) {
        const resp = (this.m as any).create(args) as ReturnType<ExtendedPrismaClient[M]['create']>;
        return resp.then((v) => this.wrapper(v));
    }

    async createMany(args: Parameters<ExtendedPrismaClient[M]['createMany']>[0]) {
        return (this.m as any).createMany(args) as ReturnType<ExtendedPrismaClient[M]['createMany']>;
    }

    async update(args: Parameters<ExtendedPrismaClient[M]['update']>[0]) {
        const resp = (this.m as any).update(args) as ReturnType<ExtendedPrismaClient[M]['update']>;
        return resp.then((v) => this.wrapper(v));
    }

    async updateMany(args: Parameters<ExtendedPrismaClient[M]['updateMany']>[0]) {
        const resp = (this.m as any).updateMany(args) as ReturnType<ExtendedPrismaClient[M]['updateMany']>;
        return resp
    }

    async upsert(args: Parameters<ExtendedPrismaClient[M]['upsert']>[0]) {
        const resp = (this.m as any).upsert(args) as ReturnType<ExtendedPrismaClient[M]['upsert']>;
        return resp.then((v) => this.wrapper(v));
    }

    async delete(args: Parameters<ExtendedPrismaClient[M]['delete']>[0]) {
        const resp = (this.m as any).delete(args) as ReturnType<ExtendedPrismaClient[M]['delete']>;
        return resp.then((v) => this.wrapper(v));
    }

    async deleteMany(args: Parameters<ExtendedPrismaClient[M]['deleteMany']>[0]) {
        return (this.m as any).deleteMany(args) as ReturnType<ExtendedPrismaClient[M]['deleteMany']>;
    }

    async aggregate(args: Parameters<ExtendedPrismaClient[M]['aggregate']>[0]) {
        return (this.m as any).aggregate(args) as ReturnType<ExtendedPrismaClient[M]['aggregate']>;
    }

    async aggregateRaw(args: Parameters<ExtendedPrismaClient[M]['aggregateRaw']>[0]) {
        return (this.m as any).aggregateRaw(args) as ReturnType<ExtendedPrismaClient[M]['aggregateRaw']>;
    }

    async count(args?: Parameters<ExtendedPrismaClient[M]['count']>[0]) {
        return (this.m as any).count(args) as ReturnType<ExtendedPrismaClient[M]['count']>;
    }

    async groupBy(args: Parameters<ExtendedPrismaClient[M]['groupBy']>[0]) {
        return (this.m as any).groupBy(args) as ReturnType<ExtendedPrismaClient[M]['groupBy']>;
    }
}