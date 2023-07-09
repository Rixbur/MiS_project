/* eslint-disable react/prop-types */
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
// import { Form } from 'react-router-dom';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Link } from 'react-router-dom';
day.extend(advancedFormat);

const JobPost = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
}) => {
  const date = day(createdAt).format('MMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
        </div>

        <footer className="actions">
          <Link to={`../view-applications/${_id}`} className="btn edit-btn">
            View applications
          </Link>
        </footer>
      </div>
    </Wrapper>
  );
};

export default JobPost;
