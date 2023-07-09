import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import {
  HiBriefcase,
  HiCurrencyDollar,
  HiOutlineColorSwatch,
} from 'react-icons/hi';
import { MdAdminPanelSettings } from 'react-icons/md';

const links = [
  { text: 'add custom application', path: '.', icon: <FaWpforms /> },
  {
    text: 'all  custom applications',
    path: 'all-jobs',
    icon: <MdQueryStats />,
  },
  { text: 'post job', path: 'post-job', icon: <HiBriefcase /> },
  { text: 'my job posts', path: 'my-jobs', icon: <HiCurrencyDollar /> },
  {
    text: 'open positions',
    path: 'open-jobs',
    icon: <HiOutlineColorSwatch />,
  },

  { text: 'stats', path: 'stats', icon: <IoBarChartSharp /> },
  { text: 'profile', path: 'profile', icon: <ImProfile /> },
  { text: 'admin', path: 'admin', icon: <MdAdminPanelSettings /> },
];

export default links;
