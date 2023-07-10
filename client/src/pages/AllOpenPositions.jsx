import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/JobsContainer';
import JobWrapper from '../assets/wrappers/Job';
import JobInfo from '../components/JobInfo';
import { FaBriefcase, FaLocationArrow } from 'react-icons/fa';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/job');

    return {
      data,
    };
  } catch (error) {
    toast.error(error.response.data.msg);
    return error;
  }
};

const AllOpenPositions = () => {
  const { data, user } = useLoaderData();

  return (
    <Wrapper>
      {data.jobs.length > 0 ? (
        <h5>{data.jobs.length} open positions found</h5>
      ) : (
        <h5>No open positions found</h5>
      )}
      <div className="jobs">
        {data.jobs.map((job) => {
          const { _id, position, company, jobType, jobLocation } = job;
          return (
            <JobWrapper key={_id}>
              <header>
                <div className="main-icon">{company.charAt(0)}</div>
                <div className="info">
                  <h5>Position: {position}</h5>
                  <p>Company: {company}</p>
                </div>
              </header>
              <div className="content">
                <div className="content-center">
                  <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
                  <JobInfo icon={<FaBriefcase />} text={jobType} />
                </div>

                <footer className="actions">
                  <button
                    type="button"
                    className="btn edit-btn"
                    onClick={async (e) => {
                      e.preventDefault();

                      try {
                        const { data } = await customFetch.post(
                          'job-applications',
                          {
                            jobId: _id,
                          }
                        );

                        toast.success('Successfully applied for the job');
                      } catch (error) {
                        toast.error(error.response.data.msg);
                      }
                    }}
                  >
                    Apply
                  </button>
                </footer>
              </div>
            </JobWrapper>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default AllOpenPositions;
