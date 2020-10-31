import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';
import { MyContext } from 'src/types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext) {
    return em.find(Post, {});
  }

  // Ctx - декоратор аргумента для получения контекста
  // Arg - декоратор аргумента для аргумента запроса
  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number, @Ctx() { em }: MyContext) {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(@Arg('title') title: string, @Ctx() { em }: MyContext) {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== undefined) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number, @Ctx() { em }: MyContext) {
    try {
      await em.nativeDelete(Post, { id });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
