### 1️⃣ GetInstituteOnTaluka

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetInstituteOnTaluka`

**Query Parameters:**

| Name   | Type   | Required |
| ------ | ------ | -------- |
| Taluka | string | ✅ Yes    |

**Example Request:**

```
GET /GetInstituteOnTaluka?Taluka=Nashik
```

**Response Structure:**

```json
{
  "ResponseCode": number,
  "Message": string | null,
  "ResponseData": Institute[]
}
```

**Institute Object:**

```json
{
  "CCode": number,
  "InstituteName": string,
  "Address": string | null,
  "Taluka": string | null,
  "District": string | null,
  "States": string | null,
  "PinCode": string | null,
  "Email": string | null,
  "WebSite": string | null,
  "EstablishYear": number | null,
  "OCode": number,
  "InstituteTypeID": number
}
```

---

### 2️⃣ GetSectionOnInstitute

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetSectionOnInstitute`

**Query Parameters:**

| Name  | Type   | Required |
| ----- | ------ | -------- |
| CCode | number | ✅ Yes    |

**Example Request:**

```
GET /GetSectionOnInstitute?CCode=109003
```

**Response Structure:**

```json
{
  "ResponseCode": number,
  "Message": string | null,
  "ResponseData": Section[]
}
```

**Section Object:**

```json
{
  "SectionID": number,
  "SectionName": string,
  "IsSelected": boolean,
  "CCode": number
}
```

---

### 3️⃣ GetCourseListOnSection

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetCourseListOnSection`

**Query Parameters:**

| Name      | Type   | Required |
| --------- | ------ | -------- |
| SectionID | number | ✅ Yes    |
| CCode     | number | ✅ Yes    |

**Example Request:**

```
GET /GetCourseListOnSection?SectionID=15&CCode=109003
```

**Course Object:**

```json
{
  "Selected": boolean,
  "CCode": number,
  "CourseID": number,
  "SectionID": number,
  "FacultyID": number,
  "Course": string | null,
  "CourseName": string,
  "CourseDuration": string | null,
  "ClassLock": boolean
}
```

---

### 4️⃣ GetClassListOnCourse

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetClassListOnCourse`

**Query Parameters:**

| Name     | Type   | Required |
| -------- | ------ | -------- |
| CourseID | number | ✅ Yes    |
| CCode    | number | ✅ Yes    |
| RoleID   | number | ✅ Yes    |

**Example Request:**

```
GET /GetClassListOnCourse?CourseID=15102&CCode=109003&RoleID=12
```

**Class Object:**

```json
{
  "Selected": boolean,
  "CCode": number,
  "CourseID": number,
  "ClassID": number,
  "SectionID": number,
  "FacultyID": number,
  "TypeOfMarksID": number | null,
  "ClassName": string,
  "ClassLock": boolean
}
```

---

### 5️⃣ GetClassMediumTypeList

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetClassMediumTypeList`

**Query Parameters:**

| Name    | Type   | Required |
| ------- | ------ | -------- |
| ClassID | number | ✅ Yes    |
| CCode   | number | ✅ Yes    |

**Medium Object:**

```json
{
  "PaperLanguageMediumID": number,
  "Medium": string,
  "AddBy": string | null,
  "AddByTime": string | null,
  "EditBy": string | null,
  "EditByTime": string | null
}
```

---

### 6️⃣ GetEnrolledCourse

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetEnrolledCourse`

**Query Parameters:**

| Name               | Type   | Required |
| ------------------ | ------ | -------- |
| MeritStudentInfoID | number | ✅ Yes    |
| ClassID            | number | ✅ Yes    |
| CCode              | number | ✅ Yes    |

---

### 7️⃣ GetAdmissionClassSubjectPaperList

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetAdmissionClassSubjectPaperList`

**Query Parameters:**

| Name                  | Type   | Required |
| --------------------- | ------ | -------- |
| ClassID               | number | ✅ Yes    |
| CCode                 | number | ✅ Yes    |
| MeritEnrollMentID     | number | ✅ Yes    |
| PaperLanguageMediumID | number | ✅ Yes    |

**Response Data:**

```json
{
  "instituteClass": InstituteClass,
  "subjectGroups": [],
  "subjectGroupsDetails": []
}
```

---

### 8️⃣ GetDirectAdmissionClass

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetDirectAdmissionClass`

**Query Parameters:**

| Name    | Type   | Required |
| ------- | ------ | -------- |
| CCode   | number | ✅ Yes    |
| ClassID | number | ✅ Yes    |

---

### 🔟 SaveMeritAdmissionEnrollMent

**Method:** `POST`
**Endpoint:**
`/api/Admission/Registration/SaveMeritAdmissionEnrollMent`

**Request Body:**

```json
{
  "MeritAdmissionEnrollment": {
    "MeritStudentInfoID": number,
    "EnrollMentDate": "ISO Date",
    "CCode": string,
    "SectionID": string,
    "CourseID": string,
    "ClassID": string,
    "MeritFormStatusId": number,
    "Taluka": string
  }
}
```

**Success Response:**

```json
{
  "ResponseCode": 1,
  "ResponseData": {
    "v_Return": 1
  }
}
```

---

### 1️⃣1️⃣ GetEnrollmentList

**Method:** `GET`
**Endpoint:**
`/api/Admission/Registration/GetEnrollmentList`

**Query Parameters:**

| Name             | Type   | Required |
| ---------------- | ------ | -------- |
| registrationId   | number | ✅ Yes    |
| ApplicationToken | string | ✅ Yes    |

**Enrollment Object (Key Fields):**

```json
{
  "MeritEnrollMentID": number,
  "EnrollMentNo": string,
  "InstituteName": string,
  "ClassName": string,
  "MeritFormStatus": string,
  "PaymentAmount": number
}
```

---

### ✅ Success Criteria (All APIs)

* **HTTP Status:** `200 OK`
* **ResponseCode:** `1` → Success
