# Week 4: Git From Scratch

## Overview
Coding without **Version Control** is like writing a novel with no "Undo" button and no way to save drafts. **Git** is the industry-standard tool for tracking changes in your code, allowing you to "time travel" to previous versions, experiment safely on branches, and collaborate with thousands of developers without causing chaos. It is not just a "backup tool"; it is the heartbeat of professional software development.

## Core Concepts

### 1. The Three States
To master Git, you must understand where your files live at any given moment:
- **Working Directory**: The files you see and edit in your IDE.
- **Staging Area (Index)**: A "waiting room" where you prepare changes before they are officially recorded.
- **Git Directory (Repository)**: The permanent database where Git stores the compressed history of your project.

### 2. The Commit: A Snapshot in Time
A **Commit** is not a "save." It is a snapshot of your entire project at a specific point. Each commit has a unique ID (a SHA-1 hash) and points to the commit that came before it, creating a chain of history.
- **Pro Tip**: Commits should be "atomic"—meaning they should do exactly one thing (e.g., "Fix login bug" or "Add footer styles").

### 3. Branching: Parallel Universes
A **Branch** is simply a pointer to a commit. By default, you are on the `main` (or `master`) branch. 
- When you want to build a new feature, you "branch off." This creates a parallel universe where you can break things without affecting the stable `main` code.
- **Merging** is the process of bringing those parallel changes back into the main timeline.

### 4. Remote vs. Local
Git is **distributed**. Your computer has a full copy of the entire history (Local). **GitHub**, **GitLab**, or **Bitbucket** are simply "Remotes"—places where you "Push" your local history so others can "Pull" it to their machines.

## Code Examples

### Example 1: The Standard Workflow
This is the loop you will perform dozens of times a day.

```bash
# 1. Initialize a new repo
git init

# 2. Check what's happening
git status

# 3. Add a file to the 'Staging Area' (the waiting room)
git add README.md

# 4. Record the snapshot with a meaningful message
git commit -m "docs: initialize project with readme"

# 5. View your history
git log --oneline
```

### Example 2: Branching and Merging
This demonstrates how to work on a feature safely.

```bash
# 1. Create and switch to a new branch
git checkout -b feature-dark-mode

# ... Edit files to add dark mode ...
git add .
git commit -m "feat: add dark mode css variables"

# 2. Switch back to the stable branch
git checkout main

# 3. Merge the feature into main
git merge feature-dark-mode

# 4. Delete the feature branch (it's no longer needed)
git branch -d feature-dark-mode
```

## Common Mistakes
1. **The "Everything Commit"**: Adding every single file and committing with the message "Updates." This makes it impossible to find specific bugs later. Commit often, and be specific.
2. **Committing Secrets**: Accidentally adding `.env` files with API keys or passwords. Use a `.gitignore` file from day one!
3. **The "Detached HEAD"**: Navigating to an old commit without creating a branch. Any changes you make here will be lost when you switch back.
4. **Merge Panic**: Encountering a **Merge Conflict** and deleting the whole folder. Conflicts are normal; they just mean two people edited the same line. Git just needs you to pick which version to keep.

## Mental Model
Imagine your project is a **Video Game**.
- **Working Directory**: You playing the game right now.
- **Staging Area**: You standing at a "Save Point" choosing which items to keep in your inventory.
- **Commit**: You hitting "Save Game." You can always reload this file later.
- **Branch**: You creating a "New Game Plus" to try a different path without deleting your original progress.

## Key Takeaways
- Git tracks **content**, not just files.
- The **Staging Area** gives you control over what goes into a commit.
- **Atomic commits** and clear messages are the hallmarks of a pro.
- **Branches** are cheap and fast—use them for every new idea.
- **.gitignore** is your best friend for security.

## What's Next
Now that you can track your source code, it’s time to understand what happens to that code after you write it. Next week, we’ll look at **How Compilers Work**, exploring the journey your C code takes as it's transformed from human-readable text into the binary instructions we studied in Week 1.
