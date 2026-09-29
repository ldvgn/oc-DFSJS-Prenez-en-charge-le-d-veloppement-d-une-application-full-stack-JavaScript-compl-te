import { type Post } from "@/prisma/generated/prisma/client";
import {
  PostRepository,
  postRepository,
  type PostDetail,
  type PostWithAuthor,
  type SortOrder,
} from "./post.repository";
import { type CreatePostInput } from "./post.schemas";

export class PostService {
  constructor(private readonly repository: PostRepository = postRepository) {}

  /**
   * Returns all posts with their author's username, sorted by creation date.
   *
   * @param order - "desc" (newest first, default) or "asc"
   * @returns - All posts.
   */
  async getAll(order?: SortOrder): Promise<PostWithAuthor[]> {
    return this.repository.findAll(order);
  }

  /**
   * Returns a single post with its author's username, topic and comments.
   *
   * @param id - The post's ID
   * @returns The post, or `null` if not found.
   */
  async getById(id: string): Promise<PostDetail | null> {
    return this.repository.findById(id);
  }

  /**
   * Creates a post for the given author.
   *
   * @param input - Validated post form data
   * @param authorId - The author's ID
   * @returns The created post.
   */
  async create(input: CreatePostInput, authorId: string): Promise<Post> {
    return this.repository.create({ ...input, authorId });
  }
}

export const postService = new PostService();
