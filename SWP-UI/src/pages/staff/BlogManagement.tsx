import { useEffect, useState } from "react";
import { blogAPI } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Save, Trash2, Upload, X } from "lucide-react";

export default function BlogManagementStaff() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data);
      console.log('📋 Blog posts data:', data);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: any) => {
    setEditingPost({ ...post });
    setIsNew(false);
    setErrorMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    
    // Sử dụng postImage string trực tiếp nếu có
    if (post.postImage) {
      setImagePreview(post.postImage);
    } else {
      setImagePreview(null);
    }
  };

  const handleCreate = () => {
    setEditingPost({ title: "", content: "", postImage: "" });
    setIsNew(true);
    setErrorMessage("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        // Cập nhật postImage trong editingPost
        setEditingPost(prev => ({ ...prev, postImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    // Xóa ảnh hiện tại
    setSelectedImage(null);
    setImagePreview(null);
    // Xóa postImage string
    setEditingPost(prev => ({ ...prev, postImage: "" }));
  };
  const handleSave = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      setErrorMessage("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }
    
    try {
      if (isNew) {
        // Tạo FormData cho create - đơn giản thôi
        const formData = new FormData();
        formData.append('Title', editingPost.title);
        formData.append('Content', editingPost.content);
        
        // Nếu có ảnh được upload
        if (selectedImage) {
          formData.append('PostImage', selectedImage);
        }
        
        // Debug FormData
        console.log('📤 Creating blog with FormData:', {
          title: editingPost.title,
          content: editingPost.content,
          hasImage: !!selectedImage
        });
        
        // Log FormData entries
        for (let [key, value] of formData.entries()) {
          console.log(`📦 FormData ${key}:`, value);
        }
        
        const createResponse = await blogAPI.create(formData);
        console.log('✅ Create response:', createResponse);
      } else {
        // Update - vẫn dùng JSON như cũ
        const now = new Date().toISOString();
        const blogData = {
          title: editingPost.title,
          content: editingPost.content,
          createdAt: editingPost.createdAt || now,
          updatedAt: now,
          postImage: editingPost.postImage || ""
        };
        
        const postId = editingPost.id || editingPost.blogPostId || editingPost.postId;
        if (!postId) {
          setErrorMessage("Không xác định được ID bài viết để cập nhật!");
          return;
        }
        await blogAPI.update(postId as number, blogData);
      }
      
      // Sau khi create/update, làm mới danh sách và reset form
      await fetchPosts();
      setEditingPost(null);
      setIsNew(false);
      setSelectedImage(null);
      setImagePreview(null);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Lỗi khi lưu bài viết:", error);
      const msg = error.response?.data?.message || "Lưu bài viết thất bại!";
      setErrorMessage(msg);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;
    try {
      await blogAPI.delete(postId);
      fetchPosts();
    } catch (error) {
      alert("Xoá bài viết thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button onClick={handleCreate}>+ Tạo bài viết</Button>
        </div>

        {editingPost && (
          <Card className="mb-6">
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>Tiêu đề</Label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Nội dung</Label>
                <Textarea
                  rows={10}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                />
              </div>
              {/* Ảnh minh hoạ */}
              <div>
                <Label>Ảnh minh hoạ (URL)</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg hoặc base64 string"
                  value={editingPost.postImage || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, postImage: e.target.value })}
                />
                {editingPost.postImage && (
                  <div className="mt-2">
                    <img 
                      src={editingPost.postImage} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Hoặc upload file (sẽ convert thành base64) */}
              <div>
                <Label>Hoặc upload file ảnh</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && imagePreview !== editingPost.postImage && (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded border" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Lưu bài viết
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {posts.map((post, idx) => {
            const postId = post.id || post.blogPostId || post.postId;
            console.log('🖼️ Post image data:', { postId, postImage: post.postImage, post });
            return (
              <Card key={postId || idx}>
                <CardContent className="pt-6">
                  {post.postImage && (
                    <img src={post.postImage} alt="Ảnh minh hoạ" className="w-full h-40 object-cover rounded mb-3" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Ngày tạo: {post.createdAt?.slice(0, 10)}
                  </p>
                  <p className="text-gray-800 line-clamp-3 mb-4">{post.content}</p>
                  <div className="flex justify-end space-x-2">
                    {postId ? (
                      <>
                        <Button size="sm" onClick={() => handleEdit(post)}>
                          <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(postId)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Xoá
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-red-500">Không có ID, không thể sửa/xoá</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}