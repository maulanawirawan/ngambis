# Privacy Model

This document explains how privacy works in ngambis.

## Overview

ngambis is designed with privacy as a core principle. Users have full control over who can see their data.

## Visibility Levels

### 1. Private

- Only the owner can view the item
- Circle admins CANNOT see private items
- Circle owners CANNOT see private items
- Use for personal notes, sensitive topics, or work-in-progress

### 2. Circle

- All active members of the circle can view
- Default for daily reports (to enable accountability)
- Use for updates you want to share with your group

### 3. Selected Members

- Only specific members you choose can view
- Grant access individually
- Revoke access anytime
- Use for sharing with specific people

## Lock Feature

The lock feature provides an extra layer of privacy:

- Lock icon indicates the item is private
- Lock state is stored in the database
- Even circle admins cannot bypass locks
- Lock status is enforced by Row Level Security

### Lock vs Visibility

| Feature | Visibility | Lock |
|---------|-----------|------|
| Purpose | Control who can see | Extra protection |
| Storage | Database column | Database columns |
| Override | Owner can change | Owner can change |
| Admin bypass | No | No |

## Default Privacy Settings

| Resource | Default Visibility | Can Change? |
|----------|-------------------|-------------|
| Planning card | private | Yes |
| Schedule item | private | Yes |
| Focus session | private | Yes |
| Daily report | circle | Yes |
| Commitment | private | Yes |
| Check-in | user choice | Yes |

## What Circle Admins Can See

Circle admins CAN see:
- Member list
- Circle settings
- Invite management
- Public/shared content

Circle admins CANNOT see:
- Private items of members
- Locked items
- Selected member items (unless they're selected)

## Data Aggregation

Aggregate insights (like charts) do not reveal:
- Private item titles
- Private item content
- Specific user activities

Aggregates only show:
- Counts and totals
- Anonymized patterns
- Public/shared data

## Optional Vault (Future)

A zero-knowledge Vault feature may be added:

- Content encrypted in browser
- AES-GCM encryption
- Key derived from user passphrase
- Server stores only ciphertext
- No password recovery possible
- Vault content excluded from search and insights

**Note**: Current private RLS does NOT provide this level of protection. Operators with service role access can technically read private data.

## Your Rights

You can:
- Export all your data (JSON format)
- Delete your account and data
- Leave any circle
- Remove access for specific members
- Lock any item

## Data We Don't Collect

- No tracking pixels
- No third-party analytics
- No advertising identifiers
- No location tracking
- No device fingerprinting

## Questions?

If you have privacy questions or concerns, please review:
- [SECURITY.md](./SECURITY.md) for technical details
- Supabase privacy policy for infrastructure details
