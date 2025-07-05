# API Endpoints Documentation

## Database Schema Alignment

Các API endpoints đã được cập nhật để phù hợp với cấu trúc database SQL Server.

## 🔧 Core APIs

### User Management
```typescript
// GET /api/User - Lấy tất cả users
// GET /api/User/{id} - Lấy user theo ID
// POST /api/User - Tạo user mới
// PUT /api/User/{id} - Cập nhật user
// DELETE /api/User/{id} - Xóa user
```

### Address Management
```typescript
// GET /api/Address/{userId} - Lấy địa chỉ theo user ID
// POST /api/Address/{userId} - Tạo địa chỉ mới
// PUT /api/Address/{addressId}/{userId} - Cập nhật địa chỉ
// DELETE /api/Address/{addressId}/{userId} - Xóa địa chỉ
```

## 🧪 Test Management APIs

### TestKit API
```typescript
// GET /api/TestKit - Lấy tất cả bộ kit
// GET /api/TestKit/{id} - Lấy kit theo ID
// POST /api/TestKit - Tạo kit mới
// PUT /api/TestKit/{id} - Cập nhật kit
// DELETE /api/TestKit/{id} - Xóa kit
```

### TestService API
```typescript
// GET /api/TestService - Lấy tất cả dịch vụ
// GET /api/TestService/{id} - Lấy dịch vụ theo ID
// POST /api/TestService/kit/{kitId} - Tạo dịch vụ mới với kit
// PUT /api/TestService/{id}?kitId={kitId} - Cập nhật dịch vụ
// DELETE /api/TestService/{id} - Xóa dịch vụ
```

### TestRequest API
```typescript
// GET /api/TestRequest - Lấy tất cả yêu cầu xét nghiệm
// GET /api/TestRequest/{id} - Lấy yêu cầu theo ID
// POST /api/TestRequest - Tạo yêu cầu mới
// PUT /api/TestRequest/{id} - Cập nhật yêu cầu
// PATCH /api/TestRequest/{id}/status - Cập nhật trạng thái
// GET /api/TestRequest/user/{userId} - Lấy theo user ID
// GET /api/TestRequest/staff/{staffId} - Lấy theo staff ID
```

## 🧬 Sample & Results APIs

### Sample API
```typescript
// GET /api/Sample - Lấy tất cả mẫu
// GET /api/Sample/{id} - Lấy mẫu theo ID
// POST /api/Sample - Tạo mẫu mới
// PUT /api/Sample/{id} - Cập nhật mẫu
// DELETE /api/Sample/{id} - Xóa mẫu
// PATCH /api/Sample/{id}/status - Cập nhật trạng thái mẫu
// GET /api/Sample/request/{requestId} - Lấy mẫu theo request ID
// GET /api/Sample/stats - Thống kê mẫu
```

### TestResult API
```typescript
// GET /api/TestResult - Lấy tất cả kết quả
// GET /api/TestResult/{id} - Lấy kết quả theo ID
// POST /api/TestResult - Tạo kết quả mới
// PUT /api/TestResult/{id} - Cập nhật kết quả
// DELETE /api/TestResult/{id} - Xóa kết quả
// PATCH /api/TestResult/{id}/approve - Phê duyệt kết quả
// GET /api/TestResult/sample/{sampleId} - Lấy theo sample ID
// GET /api/TestResult/customer/{resultId} - Kết quả cho khách hàng
// GET /api/TestResult/{id}/download - Tải PDF
// POST /api/TestResult/{id}/send-email - Gửi email
// GET /api/TestResult/stats - Thống kê kết quả
```

### SubSample API
```typescript
// GET /api/SubSample - Lấy tất cả sub-sample
// GET /api/SubSample/{id} - Lấy sub-sample theo ID
// POST /api/SubSample - Tạo sub-sample mới
// GET /api/SubSample/sample/{sampleId} - Lấy theo sample ID
```

## 🏥 Lab Management APIs

### Lab API
```typescript
// GET /api/Lab/dashboard - Thống kê tổng quan
// GET /api/Lab/recent-activity - Hoạt động gần đây
// GET /api/Lab/sample-progress - Tiến độ mẫu
// GET /api/Lab/result-progress - Tiến độ kết quả
// PATCH /api/Lab/batch-update-samples - Cập nhật hàng loạt mẫu
// PATCH /api/Lab/batch-update-results - Cập nhật hàng loạt kết quả
```

## 💰 Payment APIs

### Payment API
```typescript
// GET /api/Payment - Lấy tất cả thanh toán
// GET /api/Payment/{id} - Lấy thanh toán theo ID
// POST /api/Payment - Tạo thanh toán mới
// PATCH /api/Payment/{id}/status - Cập nhật trạng thái
// GET /api/Payment/request/{requestId} - Lấy theo request ID
// POST /api/Payment/create-payment-url - Tạo URL thanh toán
```

## 📝 Content APIs

### Blog API
```typescript
// GET /api/BlogPost - Lấy tất cả bài viết
// GET /api/BlogPost/{id} - Lấy bài viết theo ID
// POST /api/BlogPost - Tạo bài viết mới
// PUT /api/BlogPost/{id} - Cập nhật bài viết
```

### Feedback API
```typescript
// GET /api/Feedback/user/{userId} - Lấy feedback theo user
// GET /api/Feedback/{id} - Lấy feedback theo ID
// POST /api/Feedback - Tạo feedback mới
// PUT /api/Feedback/{id} - Cập nhật feedback
// DELETE /api/Feedback/{id} - Xóa feedback
```

## 📊 Database Schema Mapping

### Sample Table
```sql
CREATE TABLE Sample (
    sample_id INT PRIMARY KEY IDENTITY(1,1),
    request_id INT NOT NULL,
    collected_by INT NOT NULL,
    collection_time DATETIME,
    received_time DATETIME,
    status VARCHAR(20) CHECK (status IN ('Waiting', 'Received', 'Tested')),
    FOREIGN KEY (request_id) REFERENCES TestRequest(request_id),
    FOREIGN KEY (collected_by) REFERENCES [User](user_id)
);
```

### TestResult Table
```sql
CREATE TABLE TestResult (
    result_id INT PRIMARY KEY IDENTITY(1,1),
    sample_id INT,
    uploaded_by INT,
    approved_by INT,
    uploaded_time DATETIME,
    approved_time DATETIME,
    result_data NVARCHAR(MAX),
    staff_id INT,
    FOREIGN KEY (uploaded_by) REFERENCES [User](user_id),
    FOREIGN KEY (approved_by) REFERENCES [User](user_id),
    FOREIGN KEY (staff_id) REFERENCES [User](user_id),
    FOREIGN KEY (sample_id) REFERENCES Sample(sample_id)
);
```

### TestRequest Table
```sql
CREATE TABLE TestRequest (
    request_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    collection_type VARCHAR(20) CHECK (collection_type IN ('Self', 'At Clinic', 'At Home')),
    status VARCHAR(20) CHECK (status IN ('Pending', 'On-going', 'Arrived', 'Collected', 'Testing', 'Completed')),
    appointment_date DATE,
    slot_time TIME,
    created_at DATETIME DEFAULT GETDATE(),
    staff_id INT,
    address_id INT,
    FOREIGN KEY (user_id) REFERENCES [User](user_id),
    FOREIGN KEY (service_id) REFERENCES TestService(service_id),
    FOREIGN KEY (staff_id) REFERENCES [User](user_id),
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);
```

## 🔄 Status Enums

### Sample Status
- `Waiting` - Chờ thu mẫu
- `Received` - Đã nhận mẫu
- `Tested` - Đã xét nghiệm

### TestRequest Status
- `Pending` - Chờ xử lý
- `On-going` - Đang xử lý
- `Arrived` - Đã đến
- `Collected` - Đã thu mẫu
- `Testing` - Đang xét nghiệm
- `Completed` - Hoàn thành

### Payment Status
- `Pending` - Chờ thanh toán
- `Paid` - Đã thanh toán
- `Failed` - Thất bại
- `Refunded` - Đã hoàn tiền

### Collection Type
- `Self` - Tự thu mẫu
- `At Clinic` - Thu tại phòng khám
- `At Home` - Thu tại nhà

## 🎯 Key Features

1. **Type Safety**: Tất cả API đều có TypeScript interfaces
2. **Error Handling**: Xử lý lỗi toàn diện
3. **Status Management**: Quản lý trạng thái theo workflow
4. **Batch Operations**: Cập nhật hàng loạt cho hiệu quả
5. **Customer Access**: API riêng cho khách hàng
6. **File Operations**: Tải xuống PDF và gửi email
7. **Statistics**: Thống kê và dashboard data

## 🚀 Usage Examples

### Tạo yêu cầu xét nghiệm
```typescript
const newRequest = await testRequestAPI.create({
  user_id: 1,
  service_id: 2,
  collection_type: 'At Home',
  appointment_date: '2024-03-25',
  slot_time: '09:00:00',
  address_id: 1
});
```

### Cập nhật trạng thái mẫu
```typescript
await sampleAPI.updateStatus(1, 'Received');
```

### Phê duyệt kết quả
```typescript
await testResultAPI.approve(1, 5); // resultId, approvedBy
```

### Tạo thanh toán
```typescript
const payment = await paymentAPI.create({
  request_id: 1,
  method: 'VNPay',
  amount: 3500000,
  status: 'Pending'
});
``` 