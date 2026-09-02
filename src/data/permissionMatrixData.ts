/**
 * Default Clubs, Repositories, and Permission Matrix Data
 * Allows dynamic interactive permission matrix calculations and customization
 */

import { ClubInfo, RepositorySpec } from '../types';

export const DEFAULT_CLUBS: ClubInfo[] = [
  {
    id: 'robotics',
    name: 'Robotics Engineering Club',
    code: 'ROBOTICS',
    color: '#3B82F6', // Blue
    iconName: 'Bot',
    description: 'Hardware CAD, firmware engineering, autonomous pathfinding, and FIRST competition team.',
    leadRole: 'Robotics President / Lead Admin',
    googleGroupEmail: 'robotics-leads@pioneercss.org',
    teams: [
      { id: 'robotics-leads', name: 'Robotics Leads', googleGroup: 'robotics-leads@pioneercss.org', githubTeamSlug: 'robotics-leads', description: 'Club officers & team captains', defaultPermission: 'admin' },
      { id: 'robotics-software', name: 'Robotics Software', googleGroup: 'robotics-software@pioneercss.org', githubTeamSlug: 'robotics-software', description: 'Firmware, ROS 2, and vision developers', defaultPermission: 'write' },
      { id: 'robotics-hardware', name: 'Robotics Hardware', googleGroup: 'robotics-hardware@pioneercss.org', githubTeamSlug: 'robotics-hardware', description: 'Onshape CAD and electrical design', defaultPermission: 'write' },
      { id: 'robotics-business', name: 'Robotics Outreach', googleGroup: 'robotics-business@pioneercss.org', githubTeamSlug: 'robotics-business', description: 'Sponsorships, media, and web', defaultPermission: 'write' }
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science Club',
    code: 'CS',
    color: '#10B981', // Emerald
    iconName: 'Code2',
    description: 'Competitive programming, web design, machine learning, and software architecture.',
    leadRole: 'CS Club President',
    googleGroupEmail: 'cs-leads@pioneercss.org',
    teams: [
      { id: 'cs-leads', name: 'CS Leads', googleGroup: 'cs-leads@pioneercss.org', githubTeamSlug: 'cs-leads', description: 'CS Club leadership team', defaultPermission: 'admin' },
      { id: 'cs-developers', name: 'CS Developers', googleGroup: 'cs-developers@pioneercss.org', githubTeamSlug: 'cs-developers', description: 'Software developers and coders', defaultPermission: 'write' },
      { id: 'cs-ai-group', name: 'CS AI Interest Group', googleGroup: 'cs-ai-group@pioneercss.org', githubTeamSlug: 'cs-ai-group', description: 'Machine learning & vision team', defaultPermission: 'write' }
    ]
  },
  {
    id: 'autonomous-vehicle',
    name: 'Autonomous Vehicle Racing Club',
    code: 'AUTO',
    color: '#F59E0B', // Amber
    iconName: 'Car',
    description: '1/10th scale autonomous racecar software, lidar SLAM, and embedded electronics.',
    leadRole: 'Auto Racing Captain',
    googleGroupEmail: 'auto-leads@pioneercss.org',
    teams: [
      { id: 'auto-leads', name: 'Auto Vehicle Leads', googleGroup: 'auto-leads@pioneercss.org', githubTeamSlug: 'auto-leads', description: 'Racecar lead engineers', defaultPermission: 'admin' },
      { id: 'auto-software', name: 'Auto Software & Navigation', googleGroup: 'auto-software@pioneercss.org', githubTeamSlug: 'auto-software', description: 'LiDAR, SLAM, & telemetry developers', defaultPermission: 'write' }
    ]
  },
  {
    id: 'cross-club',
    name: 'Cross-Club Innovation Alliance',
    code: 'CROSS',
    color: '#8B5CF6', // Purple
    iconName: 'Share2',
    description: 'Inter-club collaborative projects spanning Robotics, CS, Auto Vehicles, and Design.',
    leadRole: 'Joint Committee Chair',
    googleGroupEmail: 'cross-club-leads@pioneercss.org',
    teams: [
      { id: 'cross-club-robotics-cs', name: 'Robotics + CS AI Team', googleGroup: 'cross-club-robotics-cs@pioneercss.org', githubTeamSlug: 'cross-club-robotics-cs', description: 'Joint Computer Vision & AI initiative', defaultPermission: 'write', isCrossClub: true },
      { id: 'cross-club-portal-team', name: 'School Club Portal Team', googleGroup: 'cross-club-portal@pioneercss.org', githubTeamSlug: 'cross-club-portal-team', description: 'Multi-club portal & design team', defaultPermission: 'write', isCrossClub: true }
    ]
  }
];

export const DEFAULT_REPOSITORIES: RepositorySpec[] = [
  {
    id: 'robotics-control-os',
    name: 'robotics-control-os',
    clubOwnerId: 'robotics',
    type: 'internal',
    description: 'ROS 2 C++ core motor firmware & path planning algorithms for competition robot.',
    visibility: 'private',
    teamPermissions: {
      'robotics-leads': 'admin',
      'robotics-software': 'write',
      'robotics-hardware': 'read',
      'cross-club-robotics-cs': 'read'
    },
    branchProtection: {
      requirePR: true,
      requiredApprovals: 1,
      dismissStaleApprovals: true,
      requireCodeOwners: true,
      requireStatusChecks: true
    }
  },
  {
    id: 'robotics-chassis-cad',
    name: 'robotics-chassis-cad',
    clubOwnerId: 'robotics',
    type: 'internal',
    description: 'Onshape DXF/STEP files and 3D print schematics for drivetrain.',
    visibility: 'private',
    teamPermissions: {
      'robotics-leads': 'admin',
      'robotics-hardware': 'write',
      'robotics-software': 'read'
    },
    branchProtection: {
      requirePR: false,
      requiredApprovals: 0,
      dismissStaleApprovals: false,
      requireCodeOwners: false,
      requireStatusChecks: false
    }
  },
  {
    id: 'vision-ai-shared',
    name: 'vision-ai-shared',
    clubOwnerId: 'cross-club',
    type: 'cross-club-private',
    description: 'Shared TensorRT & OpenCV camera detection library co-maintained by Robotics & CS.',
    visibility: 'private',
    teamPermissions: {
      'robotics-leads': 'admin',
      'cs-leads': 'admin',
      'cross-club-robotics-cs': 'write',
      'robotics-software': 'write',
      'cs-ai-group': 'write'
    },
    branchProtection: {
      requirePR: true,
      requiredApprovals: 2,
      dismissStaleApprovals: true,
      requireCodeOwners: true,
      requireStatusChecks: true
    }
  },
  {
    id: 'club-website-template',
    name: 'club-website-template',
    clubOwnerId: 'cs',
    type: 'shared-assets',
    isTemplate: true,
    description: 'Generic, modern React + Tailwind web template for all school clubs.',
    visibility: 'internal',
    teamPermissions: {
      'cs-leads': 'admin',
      'cs-developers': 'write',
      'cross-club-portal-team': 'write',
      'robotics-business': 'read'
    },
    branchProtection: {
      requirePR: true,
      requiredApprovals: 1,
      dismissStaleApprovals: true,
      requireCodeOwners: true,
      requireStatusChecks: true
    }
  },
  {
    id: 'school-robotics-open-source',
    name: 'school-robotics-open-source',
    clubOwnerId: 'robotics',
    type: 'cross-club-public',
    description: 'Public showcase repository containing competition code releases and CAD exports.',
    visibility: 'public',
    teamPermissions: {
      'robotics-leads': 'admin',
      'robotics-software': 'maintain',
      'robotics-business': 'write'
    },
    branchProtection: {
      requirePR: true,
      requiredApprovals: 1,
      dismissStaleApprovals: true,
      requireCodeOwners: true,
      requireStatusChecks: true
    }
  }
];
