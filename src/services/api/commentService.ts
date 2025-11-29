import axiosInstance from './axios';
import { ApiResponse, Comment } from '../../types';

export interface CreateCommentData {
  comment_productId: string;
  comment_content: string;
  comment_parentId?: string | null;
}

export interface DeleteCommentData {
  commentId: string;
}

class CommentService {
  async createComment(data: CreateCommentData): Promise<ApiResponse<Comment>> {
    const response = await axiosInstance.post<ApiResponse<Comment>>('/comment', data);
    return response;
  }

  async deleteComment(data: DeleteCommentData): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>('/comment', {
      data: { commentId: data.commentId },
    });
    return response;
  }

  async getCommentsByParentId(parentId: string): Promise<ApiResponse<Comment[]>> {
    const response = await axiosInstance.get<ApiResponse<Comment[]>>('/comment', {
      params: { parentId },
    });
    return response;
  }
}

export const commentService = new CommentService();
export default commentService;

