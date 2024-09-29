# 🧪 KUVerse — Test Scenarios

> **Project:** KUVerse  
> **Document:** Test Scenarios  
> **Testing Approach:** Manual Testing  
> **Reference:** [Test Plan](TestPlan.md)

---

## 📋 Overview

This document defines the high-level test scenarios for verifying the core functionality, reliability, security, usability, and compatibility of the **KUVerse** social media platform.

Each scenario represents a major functional or non-functional area that will later be expanded into detailed **test cases**.

---

## 🔐 S1 — User Authentication

**Objective:** Verify that users can successfully register, verify their accounts, and log in.

### Scenarios

- Verify user signup with valid information.
- Verify signup with invalid or incomplete information.
- Verify email/OTP verification.
- Verify incorrect or expired OTP handling.
- Verify successful login with valid credentials.
- Verify login failure with invalid credentials.
- Verify logout functionality.
- Verify appropriate session handling after login/logout.

---

## 🔑 S2 — Password Reset & OTP Flows

**Objective:** Verify that users can securely recover and reset their passwords.

### Scenarios

- Verify password reset request with a registered email.
- Verify password reset request with an unregistered email.
- Verify OTP generation and delivery.
- Verify valid OTP submission.
- Verify invalid OTP handling.
- Verify expired OTP handling.
- Verify successful password reset.
- Verify login using the newly reset password.
- Verify that the previous password can no longer be used after reset.

---

## 📝 S3 — Post Management

**Objective:** Verify the complete lifecycle of user posts.

### Scenarios

- Verify creation of a post with text.
- Verify creation of a post with media.
- Verify creation of a post with both text and media.
- Verify post creation with invalid or unsupported input.
- Verify viewing of posts in the feed.
- Verify editing of an existing post.
- Verify that unauthorized users cannot edit another user's post.
- Verify deletion of a post.
- Verify that unauthorized users cannot delete another user's post.
- Verify that deleted posts are no longer visible.

---

## ❤️ S4 — Comments, Likes & Feed Updates

**Objective:** Verify user interactions with posts and real-time/updated feed behavior.

### Scenarios

- Verify adding a comment to a post.
- Verify viewing comments.
- Verify editing a comment, where supported.
- Verify deleting a comment, where supported.
- Verify liking a post.
- Verify unliking a post.
- Verify like count updates correctly.
- Verify comment count updates correctly.
- Verify feed updates after post interactions.
- Verify appropriate handling of invalid or empty comments.

---

## 🔖 S5 — Bookmarks

**Objective:** Verify that users can save and manage posts using bookmarks.

### Scenarios

- Verify bookmarking a post.
- Verify unbookmarking a post.
- Verify bookmark state is displayed correctly.
- Verify bookmarked posts appear in saved posts.
- Verify removed bookmarks no longer appear in saved posts.
- Verify bookmarked posts persist across sessions.
- Verify unauthorized users cannot access another user's saved posts.

---

## 💬 S6 — Real-Time Chat

**Objective:** Verify reliable real-time communication and message persistence.

### Scenarios

- Verify sending a message.
- Verify receiving a message.
- Verify messages appear in the correct chat thread.
- Verify message persistence after refreshing the page.
- Verify chat history is loaded correctly.
- Verify typing indicator functionality.
- Verify typing indicator appears for the intended recipient.
- Verify typing indicator disappears when typing stops.
- Verify handling of empty or invalid messages.
- Verify unauthorized users cannot access protected chat data.

---

## 📅 S7 — Event Management

**Objective:** Verify event creation, management, discovery, and RSVP functionality.

### Scenarios

- Verify event creation with valid information.
- Verify event creation with missing or invalid information.
- Verify editing an existing event.
- Verify unauthorized users cannot edit another user's event.
- Verify event listing.
- Verify viewing event details.
- Verify RSVP functionality.
- Verify RSVP state is displayed correctly.
- Verify changes to event information are reflected in listings and details.
- Verify deleted or unavailable events are handled correctly, where applicable.

---

## 👤 S8 — Profile Management

**Objective:** Verify profile viewing, editing, and privacy-related fields.

### Scenarios

- Verify viewing a user's profile.
- Verify editing profile information.
- Verify updating profile fields with valid information.
- Verify invalid profile information is rejected appropriately.
- Verify profile changes are persisted.
- Verify privacy-related fields behave according to their settings.
- Verify unauthorized users cannot modify another user's profile.
- Verify updated profile information is reflected across the application.

---

## 🚨 S9 — API Failure & Resilience

**Objective:** Verify that the application handles backend failures and invalid requests gracefully.

### Scenarios

- Verify application behavior when the database is unavailable.
- Verify API behavior when the database connection is lost.
- Verify API response for invalid request payloads.
- Verify API response for missing required fields.
- Verify API response for invalid data types.
- Verify API behavior for malformed requests.
- Verify appropriate HTTP status codes are returned.
- Verify meaningful error responses are returned.
- Verify the UI handles API failures without crashing.
- Verify sensitive backend errors are not unnecessarily exposed to users.

---

## 🔒 S10 — Authorization Enforcement

**Objective:** Verify that protected resources can only be accessed by authorized users.

### Scenarios

- Verify protected API routes reject unauthenticated requests.
- Verify unauthenticated requests return **401 Unauthorized** where applicable.
- Verify authenticated users cannot access resources they are not authorized to access.
- Verify unauthorized resource access returns **403 Forbidden** where applicable.
- Verify users cannot modify another user's posts.
- Verify users cannot delete another user's posts.
- Verify users cannot modify another user's profile.
- Verify users cannot access another user's protected chat data.
- Verify authorization is enforced at the backend rather than relying only on the UI.

---

## 🌐 S11 — Cross-Browser & Responsive UI

**Objective:** Verify consistent application behavior and layout across supported browsers and screen sizes.

### Scenarios

- Verify application functionality on **Google Chrome**.
- Verify application functionality on **Mozilla Firefox**.
- Verify application functionality on **Safari**.
- Verify responsive layout on desktop screens.
- Verify responsive layout on tablet-sized screens.
- Verify responsive layout on mobile-sized screens.
- Verify navigation and menus remain usable across screen sizes.
- Verify posts and media are displayed correctly.
- Verify chat interface remains usable on smaller screens.
- Verify events and profile pages maintain proper layout.
- Verify there are no major visual or functional inconsistencies between supported browsers.

---

## ♿ S12 — Accessibility

**Objective:** Verify that the main application flows are usable and accessible to users with different accessibility needs.

### Scenarios

- Verify meaningful buttons and controls have accessible labels.
- Verify form fields have appropriate labels.
- Verify keyboard navigation through main flows.
- Verify visible focus indicators are present.
- Verify sufficient text/background contrast.
- Verify images have appropriate alternative text where required.
- Verify error messages are understandable and associated with the relevant fields.
- Verify interactive elements are usable without relying solely on color.
- Verify modal/dialog interactions are keyboard accessible.
- Verify the main authentication, post, chat, event, and profile flows for basic accessibility issues.

---

## 📊 Scenario Summary

| ID | Test Area | Priority |
|---|---|---|
| **S1** | User Authentication | 🔴 High |
| **S2** | Password Reset & OTP | 🔴 High |
| **S3** | Post Management | 🔴 High |
| **S4** | Comments, Likes & Feed | 🔴 High |
| **S5** | Bookmarks | 🟠 Medium |
| **S6** | Real-Time Chat | 🔴 High |
| **S7** | Event Management | 🟠 Medium |
| **S8** | Profile Management | 🟠 Medium |
| **S9** | API Failure & Resilience | 🔴 High |
| **S10** | Authorization Enforcement | 🔴 High |
| **S11** | Cross-Browser & Responsiveness | 🟠 Medium |
| **S12** | Accessibility | 🟡 Medium |

---

## 🔗 Related Documents

- [`TestPlan.md`](TestPlan.md)
- [`TestCases.xlsx`](TestCases.xlsx)
- [`RTM.xlsx`](RTM.xlsx)
- [`DefectLog.md`](DefectLog.md)
- [`TestSummary.md`](TestSummary.md)

---

> **Document Status:** Draft  
> **Version:** 1.0  
> **Last Updated:** 27 September 2024