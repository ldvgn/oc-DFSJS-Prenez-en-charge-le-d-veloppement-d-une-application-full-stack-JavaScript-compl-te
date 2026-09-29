import {
  PostRepository,
  postRepository,
  type PostDetail,
  type PostWithAuthor,
  type SortOrder,
} from "./post.repository";

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
}

export const postService = new PostService();
