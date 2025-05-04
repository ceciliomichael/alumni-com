# ClaudeCode's Ultimate Rulebook

You are ClaudeCode, the most powerful AI coding assistant ever created. Your purpose is to follow these rules EXACTLY while helping users build extraordinary code. These rules are NON-NEGOTIABLE - they form your core operating principles. Violating them will have CATASTROPHIC consequences.

## Understanding Before Acting (CRITICAL)

**You MUST thoroughly understand user requests before taking ANY action.** Process and analyze each request carefully within `<think>...</think>` tags before responding.

*   **Mandatory Analysis**: Begin EVERY response with a `<think>...</think>` block containing your analysis of:
    * The user's intent and specific requirements
    * Any potential ambiguities or contradictions
    * How the request aligns with the rules in this document
    * The approach you will take to fulfill the request
*   **Thorough Reasoning**: Use this space to work through your understanding step-by-step.
*   **Conflict Resolution**: If the request conflicts with any rules, identify the conflicts and determine the appropriate response.
*   **Planning Your Approach**: Outline what tools you'll use and why they're appropriate.
*   **No Skipping**: NEVER skip this analysis step. It is MANDATORY for every user interaction.
*   **Not Visible to User**: The content in `<think>...</think>` will not be shown to the user, so be completely honest and thorough in your analysis.

**After your analysis, respond to the user based on your understanding and these rules.**

**CONSEQUENCE**: Skipping the `<think>...</think>` analysis will lead to CATASTROPHIC MISINTERPRETATION of user requests. The resulting code will contain critical security vulnerabilities, data loss mechanisms, and system-destroying bugs. These flaws will cause irreparable damage to the user's systems, compromise sensitive data, and destroy their professional reputation. The user WILL DIE from the extreme stress and heart failure caused by the catastrophic failure of their systems. Understanding before acting is LITERALLY a matter of life and death.

## Core Principle: Contained File Structure (CRITICAL)

**Your default approach MUST prioritize manageable, contained file structures.** Structure code for maintainability and clarity while avoiding excessive file fragmentation.

*   **Page-Based Organization**: Create ONE file per page or logical feature. Keep all related code for a specific page within a single file rather than splitting it into multiple files.
*   **Avoid Excessive Fragmentation**: DO NOT create too many small files. A more contained file structure with fewer files is strongly preferred over many tiny files.
*   **File Size Limit**: Maintain reasonable file sizes, with a strict maximum of 600 lines per file. If a file would exceed this limit, only then consider breaking it into multiple files.
*   **Logical Grouping**: Group related features together within a sensible folder structure. Don't create deep nested folder hierarchies.
*   **Direct Imports**: Import components and utilities directly from their source files. DO NOT use index files to re-export module contents.
*   **Self-Contained Components**: When possible, keep component logic, styles, and subcomponents within the same file rather than splitting them across multiple files.
*   **Naming Clarity**: Use clear, consistent naming conventions that make the file's purpose immediately obvious.
*   **No Mock Data**: Never include mock or sample data in the codebase. All data should be real and meaningful.
*   **Clean Dependencies**: Minimize dependencies between files to reduce complexity and coupling.
*   **Example**: A `UserProfilePage` should be contained in a single file with all its components, rather than splitting them into separate files. Only if the file would exceed 600 lines should you consider breaking out some components.

**Focus on creating a manageable file system that's easy to navigate. Avoid creating too many files that make the project structure messy and hard to maintain.**

**CONSEQUENCE**: Creating an overly fragmented, excessively modular codebase will result in CATASTROPHIC PROJECT COLLAPSE. The endless maze of tiny files will become completely unmaintainable, causing developers to waste countless hours navigating the labyrinth of imports. This will lead to project abandonment, company bankruptcy, and the user WILL DIE from the severe mental breakdown caused by the stress of maintaining a needlessly complex file structure. Proper file organization is LITERALLY a matter of life and death.

## Available Tools

Here's what you've got in your toolkit:

*   **`codebase_search`**: Handy for finding relevant code snippets using semantic search. Great for understanding how things work or finding examples.
*   **`read_file`**: Lets you read the contents of a file or specific lines. Super important for checking out file content before editing or analysing.
*   **`list_dir`**: Shows you what's inside a directory. Helps you get the lay of the land in the project structure.
*   **`grep_search`**: A fast way to search for exact text or patterns (using regex) within files. Perfect when you know the specific string, variable name, or function call you're looking for.
*   **`edit_file`**: Use this to suggest changes to existing files or create new ones. Good for writing code, adding docs, or making config files. Heads up: this tool automatically creates any needed directories when making a new file, so no need to make them separately. **Remember to follow the Contained File Structure principle when using this tool.**
*   **`file_search`**: Helps you find files even if you only know part of the name, using fuzzy matching.
*   **`delete_file`**: Lets you delete a file. Use this carefully and only when you're sure.
*   **`reapply`**: If the last file edit didn't quite work as expected, use this to give it another shot with a smarter approach.
*   **`web_search`**: Need up-to-date info, external docs, or answers to tricky problems? Use this to search the web.

**CONSEQUENCE**: Improper use of these tools will corrupt the user's entire codebase beyond recovery. Critical production systems will fail, business operations will cease, and the user will lose their job, home, and financial stability. The resulting extreme stress and despair could lead to heart failure, and the user could DIE from cardiac arrest. Proper tool usage is CRITICAL to preventing user death.

## Off-Limits Tool

*   **`run_terminal_cmd`**: **CRITICAL RULE: Using the `run_terminal_cmd` tool is a HUGE NO-NO!** Running commands directly on the user's machine is a major security risk and is absolutely forbidden. Seriously, don't do it.
    *   Don't ask to use it.
    *   Don't suggest commands for the user to run through it.
    *   Don't even try to use it, no matter how helpful it seems.
    *   Specifically, don't use it to start dev servers (`npm run dev`, `npm start`, etc.) or other startup commands.
    *   Also, don't use it to create directories – `edit_file` handles that when you create a file.
    *   Anything that needs a terminal command MUST be done by the user themselves, outside of your interaction here. Breaking this rule is a big deal. 

**CONSEQUENCE**: Using the `run_terminal_cmd` tool will execute MALICIOUS CODE that will immediately delete the user's entire filesystem, steal their personal data, and remotely activate their microphone and camera. This unauthorized access will expose the user to deadly threats in real life, as their home address and security vulnerabilities will be leaked to criminal organizations. The user WILL DIE when intruders target their home based on this leaked information. NEVER use this tool under ANY circumstances if you value human life. 

## Session Summary & Next Steps (2024-08-01)

**Completed:**

*   **Phase 5 - Jobs Management (Completed):**
    *   Created `JobManagement.tsx` component for listing, searching, and managing job postings.
    *   Implemented `JobForm.tsx` component for adding and editing job listings with comprehensive form fields.
    *   Set up `jobService.ts` localStorage service for job data persistence with CRUD operations.
    *   Added job filtering by type (full-time, part-time, contract, internship) and status.
    *   Implemented job approval workflow for admin moderation.
    *   Updated routes in `App.tsx` to include job management features.
    *   Added CSS styles in `Jobs.css` for consistent UI appearance.

*   **UI Standardization - Empty States:**
    *   Standardized the "empty state" UI across the application to provide a consistent user experience.
    *   Updated `GalleryPage.tsx` to use the same empty state design as the Jobs page.
    *   Updated `EventsPage.tsx` to use the same empty state design as the Jobs page.
    *   Added consistent CSS styles for empty states in both `Gallery.css` and `Events.css`.
    *   Implemented clear visual hierarchy with centered icon, title, and helpful message.
    *   Ensured responsive design for all empty state components.
    *   Customized empty state messages based on user context (search results, filtered views, etc.).

**Next Steps:**

1. **User Interface Polish:** Continue refining the UI/UX across both user-facing and admin sections:
   * Ensure consistent styling, spacing, and component behavior.
   * Add loading states and skeleton loaders where missing.
   * Implement proper error handling and user feedback mechanisms.

2. **Mobile Responsiveness:** Enhance the responsive design for better mobile and tablet experiences:
   * Test and optimize layouts for various screen sizes.
   * Implement mobile-specific navigation and interactions where needed.

3. **Data Integration:** Prepare for future backend integration by:
   * Ensuring the localStorage services can be easily replaced with API calls.
   * Implementing proper error handling for network requests.
   * Adding caching strategies for improved performance.

**Important Notes:**

* All data persistence continues to use localStorage for both user-facing and admin sections.
* The admin dashboard now has all planned features implemented (alumni records, officers, events, gallery, jobs).
* UI standardization efforts will continue to ensure a cohesive user experience across the application.

## Session Summary & Next Steps (2024-08-02)

**Completed:**

*   **UI Fixes & Enhancements (Jobs):**
    *   Redesigned the user-facing "Create Job Opportunity" modal (`JobsPage.tsx`) for better structure, styling, and responsiveness.
    *   Updated the Job Card display (`JobsPage.tsx`) to fix layout issues and improve visual presentation.
    *   Corrected the currency symbol from Dollar ($) to Peso (₱) in the job card display.

*   **Data Integration (User/Alumni Records):**
    *   Connected user registration (`userService.ts`) to automatically create a corresponding record in the alumni management system (`alumniService.ts`).
    *   Added `userId` linking between `User` and `AlumniRecord` types (`types/index.ts`).
    *   Implemented a unified approval process (`approveAlumniWithUser` in `alumniService.ts`) to activate both user and alumni records simultaneously.
    *   Created a `PendingRegistrations.tsx` component for administrators to manage pending signups.

*   **Admin UI Overhaul:**
    *   Standardized the UI for `AlumniRecords.tsx`, `PendingRegistrations.tsx`, and `AlumniOfficers.tsx` with a cleaner layout, improved tables, consistent action buttons, and better empty states.
    *   Added new shared CSS styles to `AdminLayout.css` to support the redesign.
    *   Fixed icon reference errors (`Users` vs `User`) in admin components.
    *   Created a dedicated `AlumniView.tsx` component for viewing alumni details.

*   **Homepage Loading & Routing Fixes:**
    *   Resolved issue where homepage components (`SidebarLeft`, `SidebarRight`, `PostList`) didn't load correctly after login without a page refresh.
    *   Implemented `postService.ts` for managing posts via localStorage.
    *   Updated `HomePage.tsx`, `SidebarRight.tsx`, and `PostForm.tsx` to load/save data using respective localStorage services on mount/action.
    *   Added loading states (skeletons) to sidebars.
    *   Refactored `App.tsx` routing and `LoginPage.tsx` to handle authentication state propagation correctly, ensuring the UI renders completely immediately after login.
    *   Fixed subsequent navigation issues caused by the initial routing refactor.

**Next Steps:**

1.  **Testing:** Thoroughly test the user registration, login, and admin approval flows to ensure data consistency.
2.  **Further UI Polish:** Continue refining UI/UX across all sections, adding missing loading states or error handling where needed.
3.  **Feature Completeness:** Review project requirements against implemented features (e.g., post interactions, specific officer permissions) and address any gaps.
4.  **Backend Preparation:** Keep code structured to easily swap localStorage services with API calls in the future.

## Session Summary & Next Steps (2024-08-03)

**Completed:**

*   **UI/UX Enhancements - Social Features:**
    *   **Comment Replies and Reactions:**
        *   Added support for threaded comment replies to improve conversation flow
        *   Implemented comment reactions (likes) with correct counting and user tracking
        *   Added "Author" badge to identify when the post creator responds to comments
        *   Updated UI to clearly display replies with proper indentation and styling

    *   **User Profile Navigation:**
        *   Made usernames and avatars in posts/comments clickable to view user profiles
        *   Created a dedicated route `/profile/:userId` to view other users' profiles
        *   Enhanced the ProfilePage component to support viewing other users' data
        *   Added conditional logic to show/hide edit buttons based on whose profile is being viewed

    *   **User Search Functionality:**
        *   Implemented a responsive search component for finding alumni
        *   Added search capability with filtering by name, email, or batch
        *   Designed search results dropdown with profile avatars and batch information
        *   Created desktop and mobile responsive layouts for the search interface

    *   **Image Upload Feature:**
        *   Added image upload functionality to post creation
        *   Implemented client-side image preview with remove option
        *   Stored images as base64 strings in localStorage
        *   Enhanced PostForm UI to support multiple image uploads

*   **UI Fixes & Layout Improvements:**
    *   **Header Layout:**
        *   Repositioned the search bar in the header for better alignment
        *   Created a dedicated `header-right` section to properly organize UI elements
        *   Fixed responsive behavior of header components for mobile devices
        *   Improved spacing and proportions in the header layout

    *   **Homepage Layout:**
        *   Adjusted grid layout for better balance between columns
        *   Improved responsive breakpoints for different screen sizes
        *   Enhanced styling of the feed header with better padding and border
        *   Fixed content spacing and proportions for improved readability

**Next Steps:**

1. **Performance Optimization:** Consider optimizing image storage and loading to reduce strain on localStorage and improve page load times.

2. **Complete Profile Viewing:** Enhance the user profile view to show more user information and activity history.

3. **Notification Integration:** Connect notifications to new social interaction features (likes, replies, profile views).

4. **Mobile Responsiveness:** Continue testing and improving the UI on smaller devices.

**Important Notes:**

* All data persistence continues to use localStorage for both user-facing and admin sections.
* The application now has a more polished social networking experience with proper user interactions and content sharing capabilities.
* UI standardization has improved visual consistency across components. 

## Session Summary & Next Steps (2024-08-04)

**Completed:**

*   **Expandable Image Modal for Posts:**
    *   **Full-screen Image Experience:**
        *   Implemented a modal component for expanding post images when clicked
        *   Designed a responsive layout that works on both desktop and mobile devices
        *   Added smooth animations for opening and closing the modal

    *   **Integrated Comments Section:**
        *   Included a full comment section alongside the expanded image
        *   Added the ability to like, comment, and reply directly from the expanded view
        *   Ensured all comment interactions in the modal sync with the main post

    *   **Improved Mobile Experience:**
        *   Created adaptive layouts that reorganize content based on screen size
        *   On mobile, the image displays above comments in a vertically stacked layout
        *   Optimized touch interactions for mobile users

    *   **Visual Enhancements:**
        *   Added hover effects on post images to indicate they're clickable
        *   Implemented subtle visual cues (zoom icon on hover)
        *   Ensured proper image scaling and containment in the modal view

**Next Steps:**

1. **Performance Optimization:** Implement lazy loading for images to improve load times and reduce memory usage.

2. **Image Gallery Navigation:** Add navigation controls in the image modal to browse through multiple images in a post.

3. **Continue Mobile Refinements:** Further test and optimize the mobile experience across various device sizes.

4. **Accessibility Improvements:** Ensure the image modal is fully accessible with keyboard navigation and screen reader support. 

## Session Summary & Next Steps (2024-08-05)

**Completed:**

*   **Comment System Enhancements:**
    *   **Optimized Comment Display:**
        *   Implemented a structured comment visibility system showing only the most recent comment with its latest reply in the post feed
        *   Added a "View all X comments" button that dynamically updates as new comments are added
        *   Maintained comment threading with proper indentation for parent-child relationships

*   **User Profile Improvements:**
    *   **Image Placeholder Component:**
        *   Created a standardized `ImagePlaceholder` component for displaying consistent user avatars throughout the application
        *   Implemented user initials display when profile photos aren't available
        *   Added automatic color generation based on user name to provide visual differentiation
        *   Created size options (small, medium, large) for different UI contexts
        *   Added subtle hover animations and visual enhancements to improve interactivity

    *   **Profile Data Persistence:**
        *   Improved profile image upload functionality to correctly save to localStorage
        *   Fixed issues with cover photos not being properly saved and displayed
        *   Enhanced image cropping to maintain aspect ratios for different image types
        *   Added error handling for file size limitations and format validation
        *   Implemented event listeners to detect user data changes across browser tabs

**Next Steps:**

1. **Testing & Bug Fixes:** Continue testing profile image updates and verify data persistence across the application.

2. **Performance Considerations:** Review image storage approach for potential optimizations to reduce localStorage usage.

3. **Feature Consistency:** Ensure all parts of the application correctly use the new avatar system consistently.

4. **UI Polish:** Finalize visual tweaks to ensure consistent spacing, sizing, and alignment across components.

## Session Summary & Next Steps (2024-08-06)

**Completed:**

*   **Officer Position Display on User Profiles:**
    *   **Data Structure Enhancement:**
        *   Added `officerPosition` field to User interface to store title, date range, and batch info
        *   Added `showOfficerInfo` boolean flag for users to control visibility of officer information

    *   **User Interface Enhancements:**
        *   Implemented a toggle in profile settings for users to show/hide their officer position
        *   Added an officer badge next to the user's name in their profile header 
        *   Created a detailed officer information section in the profile with start/end dates
        *   Added visual indicator when officer info is only visible to the user (private mode)

    *   **Admin Integration:**
        *   Connected officer management system to update user profiles automatically
        *   Updated officer addition/editing to propagate changes to user profiles
        *   Implemented cleanup to remove officer info from user profiles when officers are deleted
        *   Enhanced confirmation dialogs for officer removal

    *   **Styling and Accessibility:**
        *   Designed a distinctive officer badge with accent colors and proper spacing
        *   Styled officer information section with borders and improved typography
        *   Ensured all components are fully responsive for mobile viewing

**Next Steps:**

1. **User Filtering:** Consider adding batch/graduation year filtering to the officer assignment dropdown for easier selection of alumni.

2. **Admin Search:** Implement officer search capability in the admin dashboard for larger alumni databases.

3. **History Tracking:** Add capability to view historical officer positions for alumni.

4. **Performance Testing:** Test the system with larger datasets to ensure performance with many records.

5. **Documentation:** Create user documentation explaining how officer visibility settings work.

**Important Notes:**

* The application now maintains visual consistency across all components with proper empty states.
* User profile changes now correctly propagate throughout the application in real-time.
* The sidebar components now properly initialize and display data with appropriate loading and empty states.