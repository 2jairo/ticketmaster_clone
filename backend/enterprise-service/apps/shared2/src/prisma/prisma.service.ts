import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import slugify from 'slugify';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super()

    const updateUserVersion = Prisma.defineExtension({
      name: 'update __v',
      query: {
        user: {
          $allOperations: async ({ args, operation, query }) => {
            if (operation !== 'update' && operation !== 'updateMany') {
              return query(args)
            }

            if (args.data.password || args.data.isActive !== undefined || args.data.role) {
              args.data.v = { increment: 1 }
            }
            return query(args)
          }
        }
      }
    })

    const updateSlug = Prisma.defineExtension({
      name: 'update slug',
      query: {
        // category, musicGroup, concert
        $allOperations: ({ args, operation, model, query }) => {
          if (model !== 'Category' && model !== 'MusicGroup' && model !== 'Concert') return query(args)
          if (operation !== 'update' && operation !== 'updateMany' && operation !== 'create') return query(args)

          const value = typeof args.data.title !== 'string'
            ? args.data.title?.set
            : args.data.title

          if (!value) {
            return query(args)
          }

          const slugifiedTitle = slugify(value)
          const uuid = crypto.randomUUID().replaceAll('-', '')
          args.data.slug = `${slugifiedTitle}-${uuid}`
          return query(args)
        }
      }
    })

    this
      .$extends(updateUserVersion)
      .$extends(updateSlug)
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
