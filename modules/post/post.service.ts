import {
  PostRepository,
  postRepository,
  PostWithAuthor,
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
}

export const postService = new PostService();
