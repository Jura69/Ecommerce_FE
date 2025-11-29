import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { commentService } from '../../services/api';
import { useAuthStore } from '../../store';
import { Comment } from '../../types';

interface CommentSectionProps {
  productId: string;
}

export default function CommentSection({ productId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getCommentsByParentId(productId);
      setComments(response?.metadata || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.createComment({
        comment_productId: productId,
        comment_content: newComment,
        comment_parentId: null,
      });
      setNewComment('');
      fetchComments();
    } catch (err: any) {
      setError(err?.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment({ commentId });
      fetchComments();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete comment');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {user && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box component="form" onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={!newComment.trim()}
            >
              Post Comment
            </Button>
          </Box>
        </Paper>
      )}

      {loading ? (
        <Typography>Loading comments...</Typography>
      ) : comments.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <Box>
          {comments.map((comment) => (
            <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {comment.comment_userId?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {comment.comment_userId?.name || 'Anonymous'}
                    </Typography>
                    {user?._id === comment.comment_userId?._id && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{comment.comment_content}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

