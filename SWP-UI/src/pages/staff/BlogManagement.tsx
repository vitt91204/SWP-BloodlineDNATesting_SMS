import { useEffect, useState } from "react";
import { blogAPI } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Save, Trash2 } from "lucide-react";

export default function BlogManagementStaff() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data);
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
  };

  const handleCreate = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const authorId = userData?.id || userData?.userId;
    if (!authorId) {
      setErrorMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    setEditingPost({ title: "", content: "", authorId });
    setIsNew(true);
    setErrorMessage("");
  };

  const handleSave = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      setErrorMessage("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    const now = new Date().toISOString();
    const data = {
      authorId: editingPost.authorId,
      title: editingPost.title,
      content: editingPost.content,
      createdAt: editingPost.createdAt || now,
      updatedAt: now
    };

    try {
      if (isNew) {
        await blogAPI.create(data);
      } else if (editingPost.id) {
        await blogAPI.update(editingPost.id, data);
      }
      setEditingPost(null);
      setIsNew(false);
      setErrorMessage("");
      fetchPosts();
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      const backendMessage = error?.response?.data?.message;
      setErrorMessage(backendMessage || "Không thể lưu bài viết!");
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
            return (
              <Card key={postId || idx}>
                <CardContent className="pt-6">
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