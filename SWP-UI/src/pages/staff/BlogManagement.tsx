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
  // Lưu url ảnh minh hoạ cho từng post
  const [postImages, setPostImages] = useState({});
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageBlob, setExistingImageBlob] = useState<Blob | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data);
      // Sau khi lấy danh sách, lấy ảnh cho từng post
      const images = {};
      await Promise.all(
        data.map(async (post) => {
          const postId = post.id || post.blogPostId || post.postId;
          if (postId) {
            try {
              const blob = await blogAPI.getImage(postId);
              images[postId] = URL.createObjectURL(blob);
            } catch {
              images[postId] = null;
            }
          }
        })
      );
      setPostImages(images);
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
    if (post.id || post.blogPostId || post.postId) {
      blogAPI.getImage(post.id || post.blogPostId || post.postId)
        .then(blob => {
          setExistingImageBlob(blob);
          setImagePreview(URL.createObjectURL(blob));
        })
        .catch((err) => {
          if (err?.response?.status !== 404) {
            console.error("Lỗi khi tải ảnh blog:", err);
          }
          setExistingImageBlob(null);
          setImagePreview(null);
        });
    }
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
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    // Xóa ảnh hiện tại
    setSelectedImage(null);
    setExistingImageBlob(null);
    setImagePreview(null);
  };
  const handleSave = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      setErrorMessage("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }
    const now = new Date().toISOString();
    // Determine post ID field (supports id, blogPostId, or postId)
    const postId = editingPost.id || editingPost.blogPostId || editingPost.postId;
    try {
      if (isNew) {
        // Tạo mới đa phần dữ liệu trực tiếp
        const formData = new FormData();
        formData.append("authorId", editingPost.authorId);
        formData.append("title", editingPost.title);
        formData.append("content", editingPost.content);
        formData.append("createdAt", editingPost.createdAt || now);
        formData.append("updatedAt", now);
        if (selectedImage) {
          formData.append("imageFile", selectedImage);
        }
        await blogAPI.create(formData);
      } else {
        // Update: build FormData flatten các field giống create để backend [FromForm]
        const postId = editingPost.id || editingPost.blogPostId || editingPost.postId;
        if (!postId) {
          setErrorMessage("Không xác định được ID bài viết để cập nhật!");
          return;
        }
        const formData = new FormData();
        formData.append("authorId", String(editingPost.authorId));
        formData.append("title", editingPost.title);
        formData.append("content", editingPost.content);
        formData.append("createdAt", editingPost.createdAt || now);
        formData.append("updatedAt", now);
        if (selectedImage) {
          formData.append("imageFile", selectedImage);
        } else if (existingImageBlob) {
          formData.append("imageFile", existingImageBlob, "image.jpg");
        }
        await blogAPI.update(postId as number, formData);
      }
      // Sau khi create/update, làm mới danh sách và reset form
      await fetchPosts();
      setEditingPost(null);
      setIsNew(false);
      setSelectedImage(null);
      setExistingImageBlob(null);
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
                <Label>Ảnh minh hoạ</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded border" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"><X className="w-4 h-4 text-red-500" /></button>
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
            return (
              <Card key={postId || idx}>
                <CardContent className="pt-6">
                  {postId && postImages[postId] && (
                    <img src={postImages[postId]} alt="Ảnh minh hoạ" className="w-full h-40 object-cover rounded mb-3" />
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