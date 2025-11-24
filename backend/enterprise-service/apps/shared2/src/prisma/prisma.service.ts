import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import slugify from 'slugify';

const getPrismaClient = () => {
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

  const SLUG_MODELS = ['Category', 'MusicGroup', 'Concert', 'Merch', 'MerchCategory']
  const updateSlug = Prisma.defineExtension({
    name: 'update slug',
    query: {
      $allOperations: ({ args, operation, model, query }) => {
        console.log('using this shit')
        if (!model || !SLUG_MODELS.includes(model)) return query(args)
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

  return new PrismaClient()
    .$extends(updateUserVersion)
    .$extends(updateSlug)
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  c: ReturnType<typeof getPrismaClient>

  constructor() {
    this.c = getPrismaClient()
  }

  async onModuleInit() {
    await this.c.$connect();
  }

  async onModuleDestroy() {
    await this.c.$disconnect();
  }
}
