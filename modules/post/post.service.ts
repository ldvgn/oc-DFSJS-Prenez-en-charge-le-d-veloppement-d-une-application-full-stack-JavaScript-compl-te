import { type Post } from "@/prisma/generated/prisma/client";
import { PostRepository, postRepository } from "./post.repository";
import {
  type PostDetail,
  type PostType,
  type PostWithAuthor,
  type SortOrder,
} from "./post.schemas";

export class PostService {
  constructor(private readonly repository: PostRepository = postRepository) {}

  /**
   * Lists the posts of the user's subscribed topics by creation date.
   *
   * @param userId - Subscriber ID
   * @param order - `"desc"` (default) or `"asc"`
   * @returns The posts with their author
   */
  async getFeed(userId: string, order?: SortOrder): Promise<PostWithAuthor[]> {
    return this.repository.findAllBySubscriber(userId, order);
  }

  /**
   * Gets a post with its author, topic and comments.
   *
   * @param id - Post ID
   * @returns The post, or `null` if not found
   */
  async getById(id: string): Promise<PostDetail | null> {
    return this.repository.findById(id);
  }

  /**
   * Creates a post.
   *
   * @param input - Post form data
   * @param authorId - Author ID
   * @returns The created post
   */
  async create(input: PostType, authorId: string): Promise<Post> {
    return this.repository.create({ ...input, authorId });
  }
}

export const postService = new PostService();
