# ClubSync, explained in very simple terms

## What this means
ClubSync is basically a school club helper system.

It does one main job:

- the school decides who belongs in which club
- ClubSync watches that decision
- ClubSync gives the right GitHub access
- ClubSync removes access when someone should not have it anymore

So instead of people doing everything by hand, the system does it for them.

## The simple idea
Think of it like a school office with a few folders:

- Google Workspace is the attendance book
- Google Groups are the club sign-up lists
- ClubSync is the person who copies the right names into the right places
- GitHub is the place where the club work lives

If a student is added to a club list, they get the matching GitHub access.
If a student is removed, the access goes away.

That is the whole concept.

## How it is done
This repo shows the process in a few layers.

### 1. The school owns the account system
The school uses its own Google Workspace domain, like a school email system.

That means:

- students use school accounts, not personal accounts
- teachers and advisors can control access
- the school stays in charge if someone graduates or leaves

### 2. Club membership lives in Google Groups
Each club has groups, like a sign-up list.

For example:

- robotics-leads
- robotics-software
- cs-developers
- cross-club-robotics-cs

When a student is placed into one of those groups, that is the signal that they belong there.

### 3. ClubSync reads the group change
ClubSync is the middle piece.

It does not invent the membership. It just watches for changes and then reacts.

When it sees a student added or removed, it knows something needs to change in GitHub.

### 4. GitHub teams get updated
ClubSync does not give access to people one by one in a messy way.

Instead, it updates GitHub teams.

That matters because:

- teams are easier to manage
- teams are easier to review
- teams make permissions cleaner
- teams reduce mistakes

So if the student belongs in a club group, ClubSync puts them in the matching GitHub team.

### 5. Repositories stay protected
Each repository has rules.

That means:

- not everyone can edit everything
- some people can only read
- some can write
- some can review changes
- only a few can manage settings

This is called least privilege.
It just means people only get the access they need, nothing extra.

### 6. Access is removed when it should be removed
This is one of the biggest reasons the system exists.

When a student leaves, graduates, or changes roles, ClubSync updates GitHub again.

So the old access does not just stay there forever.

That helps prevent:

- old accounts staying active
- alumni still having admin access
- people seeing repos they should no longer see

### 7. A faculty advisor stays in control
The school does not want the whole system to depend on only students.

So a faculty advisor or IT owner stays as the final owner.

That way:

- there is always an adult backup
- the club does not lose control if seniors graduate
- important settings can still be fixed if needed

## What happens in real life
Here is the simplest version of the workflow:

1. A student joins a club.
2. A teacher or club leader adds that student to the right Google Group.
3. ClubSync notices the update.
4. ClubSync updates the matching GitHub Team.
5. GitHub gives the student the correct repo access.
6. If the student leaves later, ClubSync removes the access.

That is the whole flow.

## Why this is better than doing it manually
Without ClubSync, someone has to remember everything by hand.

That usually leads to problems like:

- forgetting to add someone
- forgetting to remove someone
- giving too much access by accident
- losing track of who owns what
- confusion during graduation and leadership changes

With ClubSync, the school list becomes the source of truth.
That means the school list is the thing everyone trusts.

## Very simple diagram

```text
Student joins club
        |
        v
School adds student to Google Group
        |
        v
ClubSync notices the change
        |
        v
ClubSync updates GitHub Team
        |
        v
Student gets the right repo access
        |
        v
If student leaves, access is removed
```

## The important message
This repo is not saying "make GitHub complicated."

It is saying:

- let the school control membership
- let ClubSync do the boring copying work
- let GitHub handle the code access
- keep everything safer and easier to manage

## One-sentence summary
ClubSync is a simple bridge between the school’s club lists and GitHub access, so the right people get in, the wrong people stay out, and nobody has to do the same permission work by hand every week.
