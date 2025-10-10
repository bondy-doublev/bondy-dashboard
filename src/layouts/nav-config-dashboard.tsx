import { Label } from 'src/components/label';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaNewspaper,
  FaCommentDots,
  FaCogs,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaCode,
} from 'react-icons/fa';

// ----------------------------------------------------------------------

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <FaTachometerAlt size={20} />,
  },
  {
    title: 'API Key',
    path: '/api-keys',
    icon: <FaCode size={20} />,
  },
  {
    title: 'Users',
    path: '/users',
    icon: <FaUsers size={20} />,
  },
  {
    title: 'Connections',
    path: '/connections',
    icon: <FaUserFriends size={20} />,
  },
  {
    title: 'Posts',
    path: '/posts',
    icon: <FaNewspaper size={20} />,
    info: (
      <Label color="error" variant="inverted">
        +5
      </Label>
    ),
  },
  {
    title: 'Comments',
    path: '/comments',
    icon: <FaCommentDots size={20} />,
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <FaExclamationTriangle size={20} />,
    info: (
      <Label color="warning" variant="inverted">
        2
      </Label>
    ),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <FaCogs size={20} />,
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <FaSignOutAlt size={20} />,
  },
];
