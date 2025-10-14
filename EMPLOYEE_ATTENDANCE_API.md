# Employee Attendance API Request Bodies

## Base URL: `POST /attend/{employeeId}`

### 1. 🟢 **Simple Check-in** (Most Common)
```json
{
  "Fullname": "John Doe",
  "Checkin": "09:30"
}
```
**Response:** Creates attendance record with status "Present" or "Late" based on time

---

### 2. 🟡 **Check-in with Date** (Specific Date)
```json
{
  "date": "04/10/2025",
  "Fullname": "John Doe",
  "Checkin": "09:30"
}
```
**Note:** Date can be in formats:
- `"04/10/2025"` (DD/MM/YYYY)
- `"2025-10-04"` (YYYY-MM-DD)

---

### 3. 🔴 **Check-out** (End of Day)
```json
{
  "Fullname": "John Doe",
  "Checkout": "17:30",
  "WorkingHours": "8:00:00",
  "Reason": "Completed daily tasks"
}
```

---

### 4. 🟠 **Leave Request** (Full Day Off)
```json
{
  "Fullname": "John Doe",
  "Reason": "Medical appointment",
  "Leavetype": "Medical"
}
```

**Common Leave Types:**
- "Medical"
- "Personal" 
- "Emergency"
- "Vacation"
- "Sick"

---

### 5. 🟣 **Complete Check-in** (All Fields)
```json
{
  "date": "04/10/2025",
  "Fullname": "John Doe",
  "Checkin": "09:15",
  "WorkingHours": "8",
  "Reason": "Regular work day"
}
```

---

## ⚠️ **Important Notes:**

### **Time Format:**
- Use `"HH:mm"` format (24-hour): `"09:30"`, `"17:45"`
- Not: `"9:30 AM"` or `"5:45 PM"`

### **Working Hours:**
- Can be: `"8"` (hours) or `"8:00:00"` (HH:mm:ss)

### **Status Logic:**
- **Present**: Check-in before 10:10 AM
- **Late**: Check-in after 10:10 AM  
- **Leave**: When only Reason provided (no check-in/out)

### **Required Fields:**
- `Fullname` (always required)
- Either `Checkin`, `Checkout`, or `Reason` must be provided

---

## 🧪 **Example API Calls:**

### Check-in:
```bash
POST /attend/670cd9267fa5d3686f5e92e
Content-Type: application/json

{
  "Fullname": "Alice Smith",
  "Checkin": "09:45"
}
```

### Check-out:
```bash
POST /attend/670cd9267fa5d3686f5e92e
Content-Type: application/json

{
  "Fullname": "Alice Smith", 
  "Checkout": "18:00",
  "WorkingHours": "8:15:00"
}
```

### Leave:
```bash
POST /attend/670cd9267fa5d3686f5e92e
Content-Type: application/json

{
  "Fullname": "Alice Smith",
  "Reason": "Family emergency", 
  "Leavetype": "Emergency"
}
```