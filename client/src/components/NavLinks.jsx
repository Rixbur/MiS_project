/* eslint-disable react/prop-types */
import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ isBigSidebar }) => {
  const { user, toggleSidebar } = useDashboardContext();

  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link;
        const { role } = user;
        if (role !== 'hr' && (path === 'post-job' || path === 'my-jobs'))
          return;
        if (role === 'hr' && path === 'open-jobs') return;
        if (role !== 'admin' && path === 'admin') return;

        return (
          <NavLink
            to={path}
            key={text}
            onClick={isBigSidebar ? null : toggleSidebar}
            className="nav-link"
            end
            // className={({ isActive }) =>
            //   isActive ? 'nav-link active' : 'nav-link'
            // }
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
