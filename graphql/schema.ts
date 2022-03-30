import {
    makeSchema,
    queryType,
    mutationType,
    asNexusMethod,
    objectType,
    inputObjectType,
    enumType,
    arg,
    nonNull,
    stringArg,
    intArg,
} from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';
import { join } from 'path';

import { mailServer } from '../src/utils/mailServer';

const DateTime = asNexusMethod(DateTimeResolver, 'DateTime');
const SortOrder = enumType({
    name: 'SortOrder',
    members: ['asc', 'desc'],
});
const Role = enumType({
    name: 'Role',
    members: ['USER', 'ADMIN'],
});

const UserSession = inputObjectType({
    name: 'UserSession',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('email');
        t.string('name');
        t.string('image');
        t.field('role', { type: 'Role' });
    },
});

const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('email');
        t.string('name');
        t.string('image');
        t.field('role', { type: 'Role' });
        t.field('created_at', { type: 'DateTime' });
        t.field('updated_at', { type: 'DateTime' });
        t.list.field('posts', { type: 'Post' });
    },
});

const Post = objectType({
    name: 'Post',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('title');
        t.nonNull.string('content');
        t.field('author', { type: 'User' });
        t.string('author_id');
        t.field('created_at', { type: 'DateTime' });
        t.field('updated_at', { type: 'DateTime' });
    },
});

const Team = objectType({
    name: 'Team',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('title');
        t.string('description');
        t.field('owner', { type: 'User' });
        t.string('owner_id');
        t.field('created_at', { type: 'DateTime' });
        t.field('updated_at', { type: 'DateTime' });
    },
});

const Query = queryType({
    definition(t) {
        t.list.field('users', {
            type: 'User',
            args: {
                sortBy: arg({ type: 'SortOrder' }),
            },
            resolve: async (_, { sortBy }, { db }) =>
                db.user.findMany({
                    orderBy: { created_at: sortBy || undefined },
                }),
        });

        t.list.field('teams', {
            type: 'Team',
            args: {
                sortBy: arg({ type: 'SortOrder' }),
            },
            resolve: async (_, { sortBy }, { db }) =>
                db.team.findMany({
                    orderBy: { created_at: sortBy || undefined },
                    include: {
                        owner: true,
                    },
                }),
        });
    },
});

const Mutation = mutationType({
    definition(t) {
        t.field('createTeam', {
            type: 'Team',
            args: {
                title: nonNull(stringArg()),
                description: stringArg(),
                user: nonNull(arg({ type: 'UserSession' })),
            },
            resolve: async (_, { user, title, description }, { db }) => {
                const validUser = await db.user.findUnique({ where: { id: user.id } });

                if (!validUser) return null;

                try {
                    const newTeam = db.team.create({
                        data: {
                            title,
                            description,
                            owner_id: validUser.id,
                        },
                    });

                    // await mailServer.sendMail({
                    //     from: '"Fred Foo 👻" <foo@example.com>',
                    //     to: 'bar@example.com, baz@example.com',
                    //     subject: 'Hello ✔',
                    //     text: `new post '${title}'`,
                    //     html: `new post <b>${title}</b>`,
                    // });

                    return newTeam;
                } catch (error) {
                    throw Error(`${error}`);
                }
            },
        });
    },
});

export const schema = makeSchema({
    types: [Query, Mutation, DateTime, SortOrder, Role, User, UserSession, Team, Post],
    outputs: {
        schema: join(process.cwd(), 'graphql/schema.graphql'),
        typegen: join(process.cwd(), 'graphql/generated/nexus.d.ts'),
    },
    contextType: {
        module: join(process.cwd(), 'graphql/context.ts'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'db',
            },
        ],
    },
});
