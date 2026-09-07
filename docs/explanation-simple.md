# ClubSync, explained simply

## What this repo is for
ClubSync is a planning and demo app for school clubs. It is not trying to run a club by itself. It is showing a simple idea:

- use the school’s Google Workspace account as the main login system
- use GitHub as the place where club code lives
- connect the two so club access happens automatically
- remove access automatically when people leave or graduate
- keep a clear paper trail for teachers, staff, and board members

In plain English, it is recommending a safer way to run student clubs without everyone juggling personal accounts, passwords, and manual permission changes.

## The big recommendation
The app is basically saying:

1. The school should own the accounts.
2. Club membership should come from school-managed Google Groups.
3. GitHub access should be given only through teams, not to random individuals.
4. Students should only get the access they actually need.
5. When a student leaves or graduates, access should be removed automatically.
6. A faculty advisor should always stay in control as the final owner.

That is the heart of the whole repo.

## What each part means

### Design document
This is the long explanation. It reads like a proposal or architecture memo for school leaders.

### Diagrams
These show the flow from school login to GitHub access in a visual way.

### Sync scripts
These are example scripts that would do the automatic work behind the scenes.

### Onboarding simulator
This is a pretend test area that shows what happens when a student is added.

### Permission matrix
This is the access chart. It answers questions like:
- who can edit
- who can review
- who can only read
- who can manage everything

### Handover wizard
This explains how student leaders pass the club over to the next group before graduation.

### Proposal generator
This makes a short version for school leaders so they can quickly approve or review the idea.

## The simple story
Think of it like this:

- A student signs in with a school account.
- The school says which club group they belong to.
- ClubSync notices that change.
- ClubSync updates GitHub access.
- The student gets the right repo permissions.
- If the student leaves, the access is removed.

That is the whole system in one sentence.

## Very simple flow diagram

```text
Student
  |
  v
Google Workspace (school login + club groups)
  |
  v
ClubSync (the middle step)
  |
  v
GitHub Org (club repos + teams)
  |
  v
Student gets the right access

Teacher / Advisor also updates the Google Group, and ClubSync sends back a record of what changed.
```

## What this means in plain English
The diagram says the school system is the boss, ClubSync is the helper, and GitHub is the place where the work happens.

The important part is that nobody gets access by hand one person at a time. The school group controls it, and ClubSync keeps GitHub in sync.

## Why the repo cares about this
The repo is trying to solve common club problems:

- students forget passwords
- alumni still have access when they should not
- staff have to do too much manual permission work
- clubs need shared code but should not all see everything
- leadership changes every year, so handover needs to be simple

So the recommendation is not just "use GitHub." It is:

- use school-owned identity
- use automatic team sync
- use least privilege access
- use a planned handover process
- keep control with the school

## Short version
ClubSync recommends a school-run system where Google Workspace decides who belongs in a club, GitHub gives the matching access, and the whole thing is automatic, safer, and easier to manage.
