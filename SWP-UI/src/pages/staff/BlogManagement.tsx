import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  FileText, 
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Save
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'Draft' | 'Published';
  createdDate: string;
  publishedDate?: string;
  author: string;
}

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 'BP001',
      title: 'Tầm quan trọng của xét nghiệm ADN trong y học hiện đại',
      content: 'Nội dung chi tiết về xét nghiệm ADN...',
      excerpt: 'Xét nghiệm ADN đang đóng vai trò quan trọng trong việc chẩn đoán và điều trị bệnh...',
      status: 'Published',
      createdDate: '2024-01-10',
      publishedDate: '2024-01-10',
      author: 'Dr. Nguyễn Văn A'
    },
    {
      id: 'BP002',
      title: 'Quy trình lấy mẫu xét nghiệm ADN tại nhà',
      content: 'Hướng dẫn chi tiết về quy trình lấy mẫu...',
      excerpt: 'Quy trình lấy mẫu xét nghiệm ADN tại nhà đơn giản và an toàn...',
      status: 'Draft',
      createdDate: '2024-01-12',
      author: 'Dr. Trần Thị B'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <Badge className="bg-green-100 text-green-800">Đã xuất bản</Badge>;
      case 'Draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleNewPost = () => {
    const newPost: BlogPost = {
      id: `BP${String(blogPosts.length + 1).padStart(3, '0')}`,
      title: '',
      content: '',
      excerpt: '',
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      author: 'Current User'
    };
    setEditingPost(newPost);
    setIsNewPost(true);
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNewPost(false);
    setIsEditing(true);
  };

  const handleSavePost = () => {
    if (editingPost) {
      if (isNewPost) {
        setBlogPosts(prev => [...prev, editingPost]);
      } else {
        setBlogPosts(prev =>
          prev.map(post =>
            post.id === editingPost.id ? editingPost : post
          )
        );
      }
      setIsEditing(false);
      setEditingPost(null);
      setIsNewPost(false);
    }
  };

  const handlePublishPost = (postId: string) => {
    setBlogPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { 
              ...post, 
              status: 'Published', 
              publishedDate: new Date().toISOString().split('T')[0]
            }
          : post
      )
    );
  };

  const handleUnpublishPost = (postId: string) => {
    setBlogPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, status: 'Draft', publishedDate: undefined }
          : post
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
    setIsNewPost(false);
  };

  if (isEditing && editingPost) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {isNewPost ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Hủy
              </Button>
              <Button onClick={handleSavePost}>
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={editingPost.title}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  title: e.target.value
                })}
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>
            
            <div>
              <Label htmlFor="excerpt">Mô tả ngắn</Label>
              <Textarea
                id="excerpt"
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  excerpt: e.target.value
                })}
                placeholder="Nhập mô tả ngắn cho bài viết"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                value={editingPost.content}
                onChange={(e) => setEditingPost({
                  ...editingPost,
                  content: e.target.value
                })}
                placeholder="Nhập nội dung bài viết"
                rows={10}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quản lý Blog
          </CardTitle>
          <Button onClick={handleNewPost}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Card key={post.id} className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Tác giả: {post.author}</span>
                      <span>Tạo: {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                      {post.publishedDate && (
                        <span>Xuất bản: {new Date(post.publishedDate).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {getStatusBadge(post.status)}
                    <p className="text-sm text-gray-500 mt-1">ID: {post.id}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem trước
                  </Button>
                  
                  {post.status === 'Draft' ? (
                    <Button 
                      size="sm"
                      onClick={() => handlePublishPost(post.id)}
                    >
                      Xuất bản
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnpublishPost(post.id)}
                    >
                      Hủy xuất bản
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-500 mb-6">Tạo bài viết đầu tiên để chia sẻ kiến thức với khách hàng</p>
              <Button onClick={handleNewPost}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo bài viết đầu tiên
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 