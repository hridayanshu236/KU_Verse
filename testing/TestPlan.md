# 🧪 KUVerse — Test Plan

> **Project:** KUVerse  
> **Testing Approach:** Manual Testing  
> **Technology Stack:** MERN (MongoDB, Express.js, React, Node.js)  
> **Project Type:** Academic Project — Second Year, Computer Engineering

---

## 1. 📋 Project Overview

**KUVerse** is a social media platform developed using the **MERN stack** as part of an academic project for second-year Computer Engineering.

The platform provides core social-media functionalities including user authentication, posts, bookmarks, chat, events and profile management.

---

## 2. 🎯 Test Objective

The primary objective of this test plan is to verify that the core functionalities of KUVerse work correctly and meet the expected functional and usability requirements.

Testing will focus on:

- Authentication and authorization
- Post management
- Comments and likes
- Media uploads
- Bookmarks
- Chat functionality
- Event management
- Profile management
- Backend API functionality
- UI responsiveness and cross-browser compatibility

---

## 3. 🔍 Test Scope

### 3.1 In-Scope

The following features and components are included in testing:

1. **User Authentication & Authorization**
   - User registration
   - Login/logout
   - Session handling
   - Authorization and access control

2. **Posts**
   - Post creation
   - Post editing
   - Post deletion
   - Comments
   - Likes
   - Media uploads

3. **Bookmarks**
   - Adding bookmarks
   - Removing bookmarks
   - Viewing bookmarked posts

4. **Chat**
   - Sending messages
   - Receiving messages
   - Chat thread functionality

5. **Events**
   - Event creation
   - Event editing
   - Event details

6. **Profile**
   - Profile viewing
   - Profile editing

7. **Backend API**
   - API endpoint functionality
   - Request and response validation
   - Error handling
   - Authentication and authorization of protected routes

8. **UI & Responsiveness**
   - Layout validation
   - Responsive behavior
   - Cross-browser compatibility

### 3.2 Out-of-Scope

The following areas are excluded from the current testing scope:

1. Third-party service integrations
2. Performance and load testing beyond defined benchmarks

---

## 4. 🧭 Test Strategy

### 4.1 Test Method

**Manual Testing**

Testing will primarily be performed manually using documented test scenarios and test cases. API testing will be performed using **Postman**.

### 4.2 Test Levels

| Test Level | Purpose |
|---|---|
| **Unit Testing** | Verify individual components or functions in isolation |
| **Integration Testing** | Verify interaction between application components, APIs, and the database |
| **System Testing** | Verify the complete application against specified requirements |
| **Acceptance Testing** | Verify that the application meets the expected user and project requirements |

### 4.3 Test Types

The following testing types will be performed:

- **Functional Testing** — Verify that features behave according to requirements.
- **API Testing** — Verify backend routes, requests, responses, status codes, and error handling.
- **UI/UX Validation** — Verify interface behavior, usability, layout, and consistency.
- **Cross-Browser Compatibility Testing** — Verify functionality across supported browsers.
- **Session Handling Testing** — Verify login sessions, protected routes, and unauthorized access.
- **Exploratory Testing** — Explore the application beyond predefined test cases to identify unexpected defects.

---

## 5. 🖥️ Test Environment

| Component | Environment |
|---|---|
| **Frontend** | Local development environment |
| **Backend** | Local server |
| **Database** | MongoDB |
| **Browsers** | Google Chrome, Mozilla Firefox, Safari |
| **API Testing Tool** | Postman |
| **Test Data** | Seed accounts, sample posts, events, and chat threads |

---

## 6. 🚪 Entry Criteria

Testing will begin when the following conditions are satisfied:

-  Test environment has been successfully staged.
-  Backend server is running successfully.
-  Database connection is established.
-  Seed data is available.
-  Test accounts are available.
-  Required API routes are implemented and accessible.
-  Initial smoke test has been completed successfully.
-  Postman environment/configuration is ready.

---

## 7. 🏁 Exit Criteria

Testing will be considered complete when the following conditions are satisfied:

-  All high-priority test cases have passed.
-  Critical and high-severity defects have been resolved or appropriately documented.
-  Required API routes have been tested successfully.
-  Regression testing has been completed.
-  Test results have been documented.
-  Test Summary Report has been prepared.
-  Defect Log has been finalized.

---

## 8. 📅 Test Schedule

| Phase | Duration | Activities |
|---|---|---|
| **Phase 1** | Week 0–1 | Test Plan Preparation |
| **Phase 2** | Week 1–3 | Individual component testing |
| **Phase 3** | Week 4–6 | Integration testing |
| **Phase 4** | Week 7–8 | API testing and defect fixing |
| **Phase 5** | Week 9 | Regression testing |
| **Phase 6** | Week 10 | Test documentation and Deliverables preparation |

---

## 9. 📦 Test Deliverables

The following deliverables will be maintained as part of the testing process:

| Deliverable | Format |
|---|---|
| Test Plan | `TestPlan.md` |
| Test Scenarios | `TestScenarios.md` |
| Test Cases | `TestCases.xlsx` |
| Requirements Traceability Matrix | `RTM.xlsx` |
| Defect Log | `DefectLog.md` |
| Test Summary Report | `TestSummary.md` |

---

## 10. 📊 Defect Management

Identified defects will be documented and tracked throughout the testing lifecycle.

Each defect should contain relevant information such as:

- Defect ID
- Title/Summary
- Description
- Steps to Reproduce
- Expected Result
- Actual Result
- Severity
- Priority
- Environment
- Status
- Related Test Case
- Evidence, where applicable

Defects will be re-tested after fixes and included in regression testing where applicable.

---

## 11. 🔄 Regression Testing

Regression testing will be performed after defect fixes and significant application changes to ensure that previously working functionality has not been negatively affected.

Regression testing will primarily focus on:

- Authentication and session handling
- Posts and interactions
- Bookmarks
- Chat
- Events
- Profiles
- API functionality
- Previously failed test cases

---

## 12. 📝 Test Execution & Reporting

Test cases will be executed according to the defined test scenarios and test schedule.

Test execution results will be recorded using statuses such as:

- **Pass**
- **Fail**
- **Blocked**
- **Not Run**

Failed test cases will be associated with corresponding defect reports where applicable.

At the completion of testing, a **Test Summary Report** will be prepared containing the overall testing results, defect status, coverage and final testing observations.

---

## 13. ✅ Approval

| Role | Name | Status |
|---|---|---|
| Test/QA | — | Pending |
| Development | — | Pending |
| Project/Team | — | Pending |

---

> **Document Status:** Final  
> **Version:** 2.0  
> **Last Updated:** 19 November 2024