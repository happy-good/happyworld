# Project Blueprint: Interactive Daily Checklist

## 1. Overview

An interactive, full-screen checklist application designed for daily recurring tasks. The app features two primary views: an **Input View** for entering up to seven tasks and a **Confirmation View** for marking them as complete. The state, including user text and completion status, is saved locally, and all tasks automatically reset to a pending state at midnight, ready for a new day.

## 2. Core Views

### **2.1. Input View**

- **Purpose**: To enter and edit the daily checklist items.
- **Components**:
    - A clear heading and the current date.
    - Seven text input fields (`<input type="text">`).
    - Pressing `Enter` moves the focus to the next input field. Pressing `Enter` on the last field switches to the Confirmation View.

### **2.2. Confirmation View**

- **Purpose**: To review and confirm the completion of daily tasks.
- **Components**:
    - A clear heading and the current date.
    - A list of buttons, each corresponding to a task entered in the Input View. Empty tasks are not displayed.
    - Clicking a button marks the task as "확인완료" (Confirmed), and the button is replaced by this text.
    - A "수정" (Edit) button to return to the Input View.

## 3. Key Features & Design

### **3.1. Visual Design**

- **Full-View Switch**: Clear, stateful transitions between the two main views.
- **Distinct Confirmation Screen**: A unique background color for the confirmation view.

### **3.2. Core Features**

1.  **Automatic Daily Reset**: At midnight, all "확인완료" statuses are automatically reset to their initial state. The checklist text is preserved.
2.  **Data Persistence**: User input and confirmation statuses are saved in `localStorage`, so they persist between browser sessions.
3.  **Consistent Date Display**: The current date is shown on both screens.
4.  **Dynamic Confirmation View**: The confirmation screen is built from the saved state.
5.  **Individual Confirmation**: Items can be marked as "확인완료", and this status is saved.
6.  **Empty Input Prevention**: Pressing Enter in an empty input field does not create an empty item in the confirmation view.
7.  **Auto-Reset on Edit**: When a user modifies the text of a task, its status is automatically reset from "확인완료" back to a clickable button, prompting re-confirmation.

## 4. Implementation Plan

This section outlines the plan for the *current* requested change. It will be updated with each new request.

**Last Change Request:**

- **Goal**: 
    1. Prevent the creation of an empty checklist item when Enter is pressed in a blank input field.
    2. When a user edits an item via the "수정" button, ensure the item reverts from "확인완료" back to a clickable button.

- **Completed Steps**:
    1. **Modified `main.js`**: 
        - Updated the `render` function to check if `item.text.trim() === ''`. If true, the item is skipped and not rendered in the confirmation list.
        - Modified the `input` event listener for the text fields. When a user types and changes the value of an input, the `confirmed` status for that specific item is now automatically set to `false` in the state.

