# ClubSync, explained end to end in very simple terms

## What this document is
This is the "how it works" version.

It explains who does what, in what order, and what happens from start to finish.

The short version is:

- the school sets up the club groups
- club staff add students to those groups
- ClubSync watches the group changes
- ClubSync updates GitHub access automatically
- access goes away when the student leaves or graduates

## The main people involved

### 1. School IT
School IT creates and controls the Google Workspace setup.

That usually means:

- creating the school account system
- creating the club Google Groups
- making sure the faculty advisor is always an owner
- keeping the school in charge of the whole setup

### 2. Faculty advisor or club lead
This is the person who actually manages membership day to day.

They:

- decide which student belongs in which club group
- add students to the correct Google Group
- remove students when they leave a club
- help during handover and graduation time

### 3. ClubSync
ClubSync is the middle layer.

It does not decide club membership.
It only reacts to changes.

It:

- notices when someone is added or removed from a Google Group
- maps that group to the right GitHub Team
- updates GitHub access
- keeps a record of what changed

### 4. GitHub
GitHub is where the club code, documents, and repo settings live.

GitHub receives the final access change from ClubSync.

It:

- gives access through teams
- protects repositories with rules
- blocks direct access that is too broad
- removes access when ClubSync says to remove it

## Who creates the Google Groups
The school creates the Google Groups.

In this repo’s model, Google Groups are not random groups made by students.
They are school-owned club lists.

Usually:

- School IT creates the group structure
- the faculty advisor or club lead uses the group names for club membership
- the school keeps ownership of the account system

Examples of group names in the repo are:

- `robotics-leads`
- `robotics-software`
- `cs-developers`
- `cross-club-robotics-cs`

## Who adds people to the Google Groups
Day to day, the faculty advisor or club lead adds the students.

That is the person who says:

- this student is on Robotics
- this student is on CS
- this student is on a cross-club project
- this student is no longer on the team

So the normal flow is:

- the school sets up the groups
- the club staff manage the names inside them
- ClubSync does the technical syncing

## The exact end-to-end flow

### Step 1: The school sets up the system
School IT prepares Google Workspace.

They create the club groups and make sure the faculty advisor is the permanent owner or backup owner.

This matters because the school should never lose control if students graduate.

### Step 2: A club lead adds a student to a group
A faculty advisor or club officer adds a student to the right Google Group.

For example:

- a Robotics student goes into `robotics-software`
- a CS student goes into `cs-developers`
- a shared project student goes into `cross-club-robotics-cs`

At this point, nothing in GitHub has changed yet.
The Google Group is just the source of truth.

### Step 3: ClubSync notices the change
ClubSync watches for group membership changes.

When it sees the student was added, it knows a GitHub change is needed.

This is the key idea:

- Google Group membership says who belongs where
- ClubSync translates that into GitHub access

### Step 4: ClubSync finds the matching GitHub team
ClubSync looks at the group name and finds the matching GitHub Team.

For example:

- `robotics-software` group maps to `robotics-software` team
- `cs-developers` group maps to `cs-developers` team
- `cross-club-robotics-cs` group maps to the matching cross-club team

This is how the system stays organized.
It uses the group name as the bridge between school membership and GitHub permissions.

### Step 5: GitHub access is updated
ClubSync tells GitHub to add the student to that team.

Then GitHub grants the access that team already has.

That means the student does not get random direct access.
They get team-based access, which is cleaner and safer.

### Step 6: The student can work in the right repositories
Now the student can see and use only the repositories their team is allowed to use.

This might mean:

- read access
- write access
- maintain access
- admin access for club officers only

The repo uses least privilege, which means people get only the access they need.

### Step 7: ClubSync records the change
ClubSync also keeps a record of what happened.

That record is useful because:

- the school can audit changes
- the advisor can confirm what happened
- mistakes can be traced later
- graduation handover becomes easier to check

### Step 8: If the student leaves, the process runs backward
If the student leaves the club or graduates, the club lead removes them from the Google Group.

Then ClubSync notices that removal and takes away the matching GitHub access.

So the system works both ways:

- add to the group, gain access
- remove from the group, lose access

## What happens during graduation
Graduation is a special case, so the repo gives it extra attention.

Before a student leader leaves, the repo expects:

- a successor to be named
- the successor to be added to the right Google Group
- GitHub owner/admin access to be transferred
- secrets and tokens to be rotated
- the faculty advisor to confirm the handover

This is why the handover checklist exists.
It prevents the club from getting locked out when senior students leave.

## Why this setup is safer
This system is safer than manually giving out access because it reduces human error.

It helps avoid:

- forgetting to add a new member
- forgetting to remove a former member
- giving admin rights too widely
- using personal accounts instead of school accounts
- losing ownership when students graduate

## Very simple picture of the flow

```text
School IT creates Google Groups
            |
            v
Faculty advisor or club lead adds students
            |
            v
ClubSync notices the membership change
            |
            v
ClubSync matches the Google Group to a GitHub Team
            |
            v
GitHub gives the student the correct access
            |
            v
Student works in the right repositories
            |
            v
If the student leaves, the group membership is removed
            |
            v
ClubSync removes the GitHub access too
```

## One example from start to finish
Imagine a student joins Robotics.

1. School IT already created the Robotics Google Groups.
2. The Robotics advisor adds the student to `robotics-software`.
3. ClubSync sees that change.
4. ClubSync matches `robotics-software` to the GitHub team with the same name.
5. GitHub gives the student access to the robotics software repos.
6. The student can now work on the code.
7. Later, when the student graduates, the advisor removes the student from the group.
8. ClubSync removes the GitHub access.

That is the full loop.

## The main idea in one sentence
Google Groups decide who belongs, ClubSync copies that decision into GitHub, and GitHub access stays correct without manual work every time someone joins, changes roles, or leaves.

## Google Groups vs GitHub organization vs GitHub teams

This part is important because these three things are not the same.

### Google Groups
Google Groups are the school's membership lists.

They answer the question:

- who is in Robotics
- who is in CS
- who is in a cross-club project
- who should be removed

Think of Google Groups as the official sign-up sheet.
They are controlled by the school and club staff.

### GitHub organization
The GitHub organization is the school club's space inside GitHub.

It answers the question:

- where the club's repos live
- what teams exist
- what rules protect the code
- who owns the overall club setup

Think of the organization as the whole club building.
It is the container that holds all the club projects.

### GitHub teams
GitHub teams are the access buckets inside the organization.

They answer the question:

- who can read a repo
- who can write code
- who can review changes
- who can manage settings

Think of teams as the keys to different rooms in the building.
Each team gets a specific level of access.

### How they work together
The simplest way to remember it is:

1. Google Groups decide membership.
2. ClubSync reads that membership.
3. GitHub organization holds the club space.
4. GitHub teams give the actual access.

So the school group list is the source of truth, ClubSync is the bridge, and GitHub teams are the thing that actually open the doors.

### Tiny example
If a student is added to `robotics-software` in Google Groups:

- ClubSync sees that change
- ClubSync finds the matching GitHub team
- GitHub gives that student the access tied to that team

If the student is removed from the Google Group:

- ClubSync sees that too
- GitHub team access is removed

That is why Google Groups and GitHub teams both matter, but they do different jobs.

## How to create a Google Group

This is usually done by School IT or the person who manages the school Google Workspace.

The simple steps are:

1. Open Google Workspace admin.
2. Go to Google Groups.
3. Create a new group for the club or club role.
4. Give it a clear name, like `robotics-software` or `cs-developers`.
5. Set the group email address, like `robotics-software@pioneercss.org`.
6. Decide who can add members.
7. Add the club advisor or club lead as a manager.
8. Save the group.

What this means in plain English:

- the group name should match the club role
- the group email should be easy to understand
- the school should stay in control
- the club advisor should be allowed to manage membership day to day

### Example
If you are making the Robotics Software group, you would create something like:

- group name: Robotics Software
- group email: robotics-software@pioneercss.org
- manager: Robotics advisor or IT

Then students who belong there are added to that group.

## How to create a GitHub Team

This is usually done by the school or the GitHub organization owner.

The simple steps are:

1. Open the GitHub organization.
2. Go to Teams.
3. Create a new team.
4. Give the team the same kind of name as the Google Group.
5. Pick the team purpose, like read, write, or maintain access.
6. Add the right repositories to that team.
7. Save the team.

What this means in plain English:

- the GitHub Team should match the school group name as closely as possible
- the team is what actually gives access to repositories
- the team should only get the access it needs
- the organization owner should control the big setup decisions

### Example
If the Google Group is `robotics-software`, the GitHub Team might also be called `robotics-software`.

That team might have:

- write access to robotics software repos
- read access to some shared repos
- no access to unrelated club repos

## How the two are connected

The school does not want to manage GitHub access one person at a time.

Instead:

- the Google Group is the membership list
- the GitHub Team is the access rule
- ClubSync connects them

So the real setup is not just creating both things.
It is making sure the names line up, so ClubSync can match them correctly.

### Matching rule

If the Google Group is:

- `robotics-leads@pioneercss.org`

then the GitHub Team should be:

- `robotics-leads`

If the Google Group is:

- `cs-developers@pioneercss.org`

then the GitHub Team should be:

- `cs-developers`

This matching is what makes the automation work.

## Very small setup picture

```text
School IT creates Google Group
    |
    v
GitHub owner creates matching GitHub Team
    |
    v
Club lead adds students to the Google Group
    |
    v
ClubSync links the group to the team
    |
    v
GitHub gives the team its access
```

## Who does what

- School IT creates the Google Group and keeps control of the account system.
- The GitHub organization owner creates the GitHub Team.
- The club advisor or club lead adds and removes students from the Google Group.
- ClubSync copies those membership changes into GitHub.

## One simple rule to remember

Google Groups are for membership.

GitHub Teams are for access.

ClubSync is the thing in the middle that keeps them matched up.
